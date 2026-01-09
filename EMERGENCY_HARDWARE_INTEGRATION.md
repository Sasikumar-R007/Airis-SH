# Emergency Alert System - Hardware Integration Guide

## Overview
This guide explains how to integrate the Emergency Alert (SOS) functionality between the ESP32 hardware and the web application.

## How It Works

### Flow Diagram
```
ESP32 (Hardware)
    │
    │ Strong Shake Detected (MPU6050)
    │
    ├─→ Emergency Alert Flag Set
    │
    ├─→ BLE Characteristic Updated (0xFFE1)
    │
    └─→ Web App (BLE Service)
         │
         ├─→ Detects Emergency Alert
         │
         ├─→ Calls Primary Emergency Contact
         │
         ├─→ Sends SMS to All Phone Contacts
         │
         └─→ Sends Email to All Email Contacts
```

## Hardware Implementation (ESP32)

### Step 1: Add Emergency Detection to board.ino

Add the following code to your `board.ino` file:

```cpp
#include <BleMouse.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Wire.h>
#include <I2Cdev.h>
#include <MPU6050.h>

MPU6050 mpu;
BleMouse bleMouse("AirMouse", "ESP32", 100);

// --- Emergency Alert BLE Service ---
BLEServer* pServer = NULL;
BLECharacteristic* pEmergencyChar = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// Emergency Service UUIDs
#define EMERGENCY_SERVICE_UUID        "0000ffe0-0000-1000-8000-00805f9b34fb"
#define EMERGENCY_CHAR_UUID           "0000ffe1-0000-1000-8000-00805f9b34fb"

// Emergency detection parameters
const int EMERGENCY_SHAKE_THRESHOLD = 30000;  // Adjust based on testing
unsigned long lastEmergencyTime = 0;
const unsigned long EMERGENCY_COOLDOWN = 5000; // 5 seconds between alerts

// --- Existing code (sensitivity, deadzone, etc.) ---
float sensitivity = 1.1;
int deadzone = 30;
float dwellSec = 1.5;
int flickThreshold = 16000;

// --- Cursor smoothing ---
static int avgDx = 0, avgDy = 0;
unsigned long dwellStart = 0;
bool dwellArmed = false;

// --- Gyro offsets ---
long gxOffset = 0, gyOffset = 0, gzOffset = 0;

// BLE Server Callbacks
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Device connected");
    }

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Device disconnected");
    }
};

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  mpu.initialize();
  mpu.setSleepEnabled(false);

  calibrateGyro();

  // Initialize BLE Mouse
  bleMouse.begin();

  // Initialize Emergency BLE Service
  BLEDevice::init("AirMouse");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService* pService = pServer->createService(EMERGENCY_SERVICE_UUID);

  // Create Emergency Characteristic (Notify)
  pEmergencyChar = pService->createCharacteristic(
    EMERGENCY_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_NOTIFY
  );

  pEmergencyChar->addDescriptor(new BLE2902());

  pService->start();

  // Start advertising
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(EMERGENCY_SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  BLEDevice::startAdvertising();

  Serial.println("AirMouse READY - Emergency Alert Active");
}

void loop() {
  if (!bleMouse.isConnected()) return;

  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // --- Apply offsets ---
  gx -= gxOffset;
  gy -= gyOffset;
  gz -= gzOffset;

  // --- Hard deadzone on RAW gyro ---
  if (abs(gx) < deadzone) gx = 0;
  if (abs(gy) < deadzone) gy = 0;

  // --- EMERGENCY DETECTION (Strong Shake) ---
  // Calculate total acceleration magnitude
  float totalAccel = sqrt(ax*ax + ay*ay + az*az);
  
  // Check for strong shake (emergency gesture)
  if (totalAccel > EMERGENCY_SHAKE_THRESHOLD) {
    unsigned long currentTime = millis();
    
    // Prevent multiple triggers within cooldown period
    if (currentTime - lastEmergencyTime > EMERGENCY_COOLDOWN) {
      lastEmergencyTime = currentTime;
      triggerEmergencyAlert();
    }
  }

  // --- Existing cursor movement code ---
  int dx = gx / 350;
  int dy = -gy / 350;

  avgDx = (avgDx * 7 + dx) / 8;
  avgDy = (avgDy * 7 + dy) / 8;

  int moveX = avgDx * sensitivity;
  int moveY = avgDy * sensitivity;

  bleMouse.move(moveX, moveY);

  // --- LEFT CLICK (steady hold) ---
  if (abs(moveX) < 1 && abs(moveY) < 1) {
    if (!dwellArmed) {
      dwellArmed = true;
      dwellStart = millis();
    } else if (millis() - dwellStart > dwellSec * 1000) {
      bleMouse.click(MOUSE_LEFT);
      Serial.println("LEFT CLICK");
      dwellArmed = false;
    }
  } else {
    dwellArmed = false;
  }

  // --- RIGHT CLICK (flick/twist) ---
  if (abs(gz) > flickThreshold) {
    bleMouse.click(MOUSE_RIGHT);
    Serial.println("RIGHT CLICK");
    avgDx = avgDy = 0;
    delay(200);
  }

  // Handle BLE disconnection
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    Serial.println("Start advertising");
    oldDeviceConnected = deviceConnected;
  }

  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }

  delay(10);
}

/**
 * Trigger Emergency Alert
 * Sends notification to connected BLE clients
 */
void triggerEmergencyAlert() {
  Serial.println("🚨 EMERGENCY ALERT TRIGGERED!");
  
  if (deviceConnected && pEmergencyChar) {
    // Send value 1 to indicate emergency
    uint8_t emergencyValue = 1;
    pEmergencyChar->setValue(&emergencyValue, 1);
    pEmergencyChar->notify();
    
    Serial.println("Emergency alert sent via BLE");
    
    // Optional: Flash LED or vibrate motor here
    // digitalWrite(LED_PIN, HIGH);
    // delay(100);
    // digitalWrite(LED_PIN, LOW);
  } else {
    Serial.println("No BLE client connected for emergency alert");
  }
}

void calibrateGyro() {
  Serial.println("⚙️ Calibrating gyro... Keep device STILL");
  long gxSum = 0, gySum = 0, gzSum = 0;

  for (int i = 0; i < 500; i++) {
    int16_t ax, ay, az, gx, gy, gz;
    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
    gxSum += gx;
    gySum += gy;
    gzSum += gz;
    delay(5);
  }

  gxOffset = gxSum / 500;
  gyOffset = gySum / 500;
  gzOffset = gzSum / 500;

  Serial.println("✅ Gyro calibration done");
}
```

### Step 2: Adjust Emergency Threshold

The `EMERGENCY_SHAKE_THRESHOLD` value (30000) may need adjustment based on:
- Device sensitivity
- User's typical movement patterns
- Desired shake intensity

**Testing:**
1. Upload the code to ESP32
2. Test with gentle shakes (should NOT trigger)
3. Test with strong shakes (should trigger)
4. Adjust threshold until it works reliably

**Recommended values:**
- Very sensitive: 20000-25000
- Normal: 30000-35000
- Less sensitive: 40000-50000

## Software Implementation (Web App)

### Step 1: Initialize Emergency Monitoring

Add to your `App.tsx` or a dedicated service:

```typescript
import { bleEmergencyService } from './services/BleEmergencyService'
import { sendSOSAlert } from './services/EmergencyService'
import { useSettings } from './context/SettingsContext'

// In your App component or a dedicated hook
useEffect(() => {
  // Set up emergency alert callback
  bleEmergencyService.setCallbacks({
    onEmergencyDetected: async () => {
      const { settings } = useSettings()
      const contacts = settings.emergencyContacts
      const message = settings.messageTemplate || 'Emergency alert from Airis-SH device!'
      
      if (contacts.length > 0) {
        // Trigger emergency response
        await sendSOSAlert(contacts, message, {
          callFirst: true,  // Call first contact immediately
          sendSMS: true,    // Send SMS to all
          sendEmail: true   // Send email to all
        })
        
        // Show notification
        showToast('🚨 Emergency alert triggered!', 'error')
      } else {
        showToast('No emergency contacts configured', 'warning')
      }
    }
  })
  
  // Connect to device
  bleEmergencyService.connect().then(connected => {
    if (connected) {
      console.log('Emergency monitoring active')
    }
  })
  
  // Cleanup on unmount
  return () => {
    bleEmergencyService.disconnect()
  }
}, [])
```

### Step 2: Add Connection Status Indicator

Update your Dashboard to show emergency monitoring status:

```typescript
const isEmergencyMonitoringActive = bleEmergencyService.getConnected()
```

## Testing the Integration

### 1. Hardware Test
1. Upload the modified `board.ino` to ESP32
2. Open Serial Monitor (115200 baud)
3. Shake the device strongly
4. You should see: `🚨 EMERGENCY ALERT TRIGGERED!`

### 2. BLE Connection Test
1. Open the web app
2. The app should automatically connect to the device
3. Check browser console for: `✅ Emergency monitoring active`

### 3. Full Integration Test
1. Configure at least one emergency contact in the app
2. Set a message template
3. Strongly shake the ESP32 device
4. Verify:
   - Phone call is initiated (if first contact has phone)
   - SMS is sent (if contacts have phone numbers)
   - Email is sent (if contacts have email addresses)

## Troubleshooting

### Issue: Emergency alert not detected
- **Check:** BLE connection status in browser console
- **Check:** Serial monitor shows "Emergency alert sent via BLE"
- **Solution:** Ensure device is connected and BLE service is active

### Issue: Phone call not working
- **Check:** Phone number format is correct
- **Check:** Device supports `tel:` protocol (mobile devices work best)
- **Solution:** On desktop, may need to use Skype or other dialer app

### Issue: Too sensitive / Not sensitive enough
- **Adjust:** `EMERGENCY_SHAKE_THRESHOLD` in `board.ino`
- **Test:** Different threshold values until it works reliably

### Issue: Multiple alerts triggered
- **Check:** `EMERGENCY_COOLDOWN` period (currently 5 seconds)
- **Adjust:** Increase cooldown if needed

## Security Considerations

1. **Emergency alerts should be immediate** - No authentication required
2. **Contact information is stored locally** - Never sent to server
3. **BLE communication is encrypted** - Standard BLE security
4. **Rate limiting** - Cooldown period prevents spam

## Future Enhancements

1. **Location tracking** - Include GPS coordinates in alert
2. **Alert history** - Log all emergency alerts
3. **Multiple alert types** - Different gestures for different emergencies
4. **Backend integration** - For reliable SMS/Email delivery
5. **Caregiver dashboard** - Web portal for caregivers to view alerts

## Support

For issues or questions:
1. Check Serial Monitor output
2. Check browser console for errors
3. Verify BLE connection status
4. Test emergency threshold values

---

**Note:** This implementation uses client-side phone calling (tel: protocol) which works best on mobile devices. For production, consider integrating with a backend service for more reliable SMS/Email delivery.

