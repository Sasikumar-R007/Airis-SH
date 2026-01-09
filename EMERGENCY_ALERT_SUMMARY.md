# Emergency Alert System - Complete Implementation Summary

## 🎯 Overview

The Emergency Alert system allows the Airis-SH device to automatically trigger emergency notifications when a strong shake is detected. The system will:
1. **Detect** strong shake via MPU6050 sensor on ESP32
2. **Transmit** emergency signal via BLE to web app
3. **Call** the primary emergency contact immediately
4. **Send SMS** to all contacts with phone numbers
5. **Send Email** to all contacts with email addresses

## 📋 How It Works

### Hardware Side (ESP32)
1. **Shake Detection**: MPU6050 accelerometer detects strong shake
2. **Threshold Check**: Total acceleration exceeds `EMERGENCY_SHAKE_THRESHOLD` (30000)
3. **Cooldown**: 5-second cooldown prevents multiple triggers
4. **BLE Notification**: Sends value `1` via BLE characteristic `0xFFE1`
5. **Serial Log**: Prints `🚨 EMERGENCY ALERT TRIGGERED!` to Serial Monitor

### Software Side (Web App)
1. **BLE Connection**: Web app connects to ESP32 via Web Bluetooth API
2. **Monitoring**: Listens for notifications on emergency characteristic
3. **Alert Detection**: Receives value `1` indicating emergency
4. **Immediate Response**:
   - **Calls** first contact with phone number (via `tel:` protocol)
   - **Sends SMS** to all contacts with phone numbers (via `sms:` protocol)
   - **Sends Email** to all contacts with email addresses (via `mailto:` protocol)
5. **User Notification**: Shows toast notification with alert status

## 🔧 Implementation Files

### Hardware
- **`board.ino`** (Modified): Contains emergency detection logic and BLE service

### Software
- **`src/services/BleEmergencyService.ts`**: BLE connection and emergency detection
- **`src/services/EmergencyService.ts`**: Phone calling, SMS, and email sending
- **`src/App.tsx`**: Initializes emergency monitoring on app load
- **`src/screens/Caregiver.tsx`**: UI for emergency contacts and connection status

### Documentation
- **`EMERGENCY_HARDWARE_INTEGRATION.md`**: Complete integration guide
- **`EMERGENCY_ALERT_SUMMARY.md`**: This file

## 🚀 Quick Start

### Step 1: Update Hardware Code
1. Open `board.ino`
2. Add the emergency detection code from `EMERGENCY_HARDWARE_INTEGRATION.md`
3. Upload to ESP32
4. Test shake detection in Serial Monitor

### Step 2: Configure Emergency Contacts
1. Open the web app
2. Navigate to "Emergency & Caregiver" page
3. Add at least one emergency contact with phone number
4. Set a message template
5. Click "Connect Device for Emergency Monitoring"

### Step 3: Test
1. Ensure device is connected (green status indicator)
2. Strongly shake the ESP32 device
3. Verify:
   - Phone call is initiated
   - SMS is sent
   - Email is sent
   - Toast notification appears

## 📱 Phone Calling Functionality

### How It Works
- Uses `tel:` protocol which works on:
  - ✅ **Mobile devices** (Android/iOS): Directly initiates phone call
  - ⚠️ **Desktop browsers**: May open dialer app (Skype, etc.) or do nothing

### Implementation
```typescript
// In EmergencyService.ts
callEmergencyContact(phone: string) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  window.location.href = `tel:${cleanPhone}`
}
```

### Limitations
- **Desktop**: May not work directly (depends on OS and installed apps)
- **Mobile**: Works perfectly on Android and iOS
- **Browser Support**: Requires user permission on some browsers

### Alternative Solutions
For production, consider:
1. **Backend API**: Use Twilio API for reliable phone calling
2. **WebRTC**: For browser-based calling (requires backend)
3. **Native App**: Electron app with native calling APIs

## 🔌 BLE Integration

### Service Structure
```
Service UUID: 0xFFE0
Characteristic UUID: 0xFFE1 (Notify)
Value: 0 = No alert, 1 = Emergency detected
```

### Connection Flow
1. User clicks "Connect Device" (or auto-connects on app load)
2. Browser requests BLE device (user must grant permission)
3. App connects to ESP32 device
4. Subscribes to emergency characteristic notifications
5. Monitors for emergency alerts continuously

### Connection Status
- **Green**: Device connected, monitoring active
- **Yellow**: Device not connected, click to connect

## ⚙️ Configuration

### Hardware Threshold
Adjust in `board.ino`:
```cpp
const int EMERGENCY_SHAKE_THRESHOLD = 30000;  // Adjust as needed
```

**Recommended values:**
- Very sensitive: 20000-25000
- Normal: 30000-35000
- Less sensitive: 40000-50000

### Cooldown Period
Prevents multiple alerts:
```cpp
const unsigned long EMERGENCY_COOLDOWN = 5000; // 5 seconds
```

### Emergency Contacts
- Configure in "Emergency & Caregiver" page
- At least one contact with phone number required for calling
- Email addresses optional but recommended

## 🧪 Testing

### Hardware Test
1. Upload code to ESP32
2. Open Serial Monitor (115200 baud)
3. Shake device strongly
4. Should see: `🚨 EMERGENCY ALERT TRIGGERED!`

### Software Test
1. Open web app
2. Check browser console for connection status
3. Configure emergency contacts
4. Test with "Test SOS Alert" button
5. Verify phone call, SMS, and email

### Integration Test
1. Connect device via BLE
2. Strongly shake ESP32
3. Verify:
   - Emergency alert detected
   - Phone call initiated
   - SMS sent
   - Email sent
   - Toast notification shown

## 🐛 Troubleshooting

### Issue: Emergency not detected
- **Check**: BLE connection status
- **Check**: Serial Monitor shows alert
- **Solution**: Ensure device is connected and threshold is appropriate

### Issue: Phone call not working
- **Check**: Phone number format (should be valid)
- **Check**: Device type (mobile works best)
- **Solution**: On desktop, may need dialer app installed

### Issue: Too sensitive/Not sensitive enough
- **Adjust**: `EMERGENCY_SHAKE_THRESHOLD` value
- **Test**: Different threshold values
- **Solution**: Find balance between false positives and missed alerts

### Issue: Multiple alerts
- **Check**: Cooldown period (5 seconds)
- **Adjust**: Increase `EMERGENCY_COOLDOWN` if needed

## 🔒 Security & Privacy

1. **No Authentication**: Emergency alerts bypass authentication (by design)
2. **Local Storage**: Contact information stored locally, never sent to server
3. **BLE Encryption**: Standard BLE security protocols
4. **Rate Limiting**: Cooldown period prevents spam

## 🚀 Future Enhancements

1. **Location Tracking**: Include GPS coordinates in alert
2. **Backend Integration**: Use Twilio/SendGrid for reliable delivery
3. **Alert History**: Log all emergency alerts
4. **Multiple Alert Types**: Different gestures for different emergencies
5. **Caregiver Dashboard**: Web portal for viewing alerts
6. **Two-Way Communication**: Allow caregivers to respond

## 📞 Support

For issues:
1. Check Serial Monitor output
2. Check browser console for errors
3. Verify BLE connection status
4. Test emergency threshold values
5. Review `EMERGENCY_HARDWARE_INTEGRATION.md` for detailed guide

---

**Note**: This implementation uses client-side protocols (`tel:`, `sms:`, `mailto:`) which work best on mobile devices. For production deployment, consider integrating with backend services (Twilio, SendGrid) for more reliable delivery across all platforms.

