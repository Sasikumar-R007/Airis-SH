# Airis-SH Software Design Analysis & Architecture Plan

## Executive Summary

This document provides a comprehensive analysis of the current Airis-SH web application, identifies gaps between hardware capabilities and frontend design, and proposes a practical software architecture for full system integration.

**Current State:** Frontend-only React/TypeScript application with rich UI but no hardware connectivity  
**Hardware State:** ESP32 + MPU6050 with basic BLE HID Mouse functionality (cursor movement, left/right click)  
**Goal:** Bridge the gap to create a fully functional assistive mouse control system

---

## 1. Current Software Design Abstract

### 1.1 Technology Stack

**Frontend:**

- React 18.2.0 with TypeScript 5.3.3
- Vite 5.0.8 (build tool)
- React Router DOM 6.20.0 (client-side routing)
- Tailwind CSS 3.3.6 (styling)
- Framer Motion 10.16.16 (animations)
- Lucide React 0.294.0 (icons)

**State Management:**

- React Context API (`SettingsContext.tsx`)
- LocalStorage persistence for settings
- Component-level state for UI interactions

**Architecture Pattern:**

- Single Page Application (SPA)
- Component-based architecture
- Context-based global state management
- No backend or API layer currently

### 1.2 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app shell with navigation
│   ├── Slider.tsx      # Custom slider component
│   ├── Toast.tsx       # Notification system
│   └── ToggleSwitch.tsx # Toggle switch component
├── context/
│   └── SettingsContext.tsx  # Global settings state (localStorage-backed)
├── screens/            # Main application screens
│   ├── Dashboard.tsx   # Device status overview
│   ├── GestureSettings.tsx
│   ├── ComfortMode.tsx
│   ├── AccessibilityTools.tsx
│   ├── Caregiver.tsx
│   ├── DeviceSettings.tsx
│   └── About.tsx
├── App.tsx             # Root component with routing
└── main.tsx            # Application entry point
```

### 1.3 Current Features (UI-Only Implementation)

#### **Dashboard Screen**

- **Connection Status Display:** Shows "connected", "searching", or "disconnected" (simulated)
- **Battery Level Indicator:** Circular progress display (hardcoded 75%)
- **Current Mode Display:** Shows Normal/Comfort Mode/Safe Mode (UI state only)
- **Gesture Status:** Animated indicator for gesture detection (simulated with random values)
- **LED Status Indicators:** Visual animation (no hardware control)

**Gap:** All data is simulated. No actual BLE connection or device status polling.

#### **Gesture Settings Screen**

- **Dwell Time Slider:** 1-3 seconds (saved to localStorage, not sent to device)
- **Twist Sensitivity:** 1-10 scale (saved to localStorage, not sent to device)
- **SOS Gesture Toggle:** Enable/disable (UI only)
- **Auto-Center Gesture Toggle:** Enable/disable (UI only)
- **Volume Twist Gesture Toggle:** Enable/disable (UI only)
- **Live Preview:** Animated device mockup (purely visual)

**Gap:** Settings are stored locally but never communicated to ESP32. Hardware uses hardcoded values:

- `dwellSec = 1.5` (fixed in firmware)
- `flickThreshold = 16000` (fixed in firmware)
- No SOS, auto-center, or volume twist gestures implemented in firmware

#### **Comfort Mode Screen**

- **Comfort Mode Toggle:** Switches UI state between Normal/Comfort Mode
- **Anti-Shake Strength Slider:** 1-10 scale (saved to localStorage)
- **Cursor Smoothing Level Slider:** 1-10 scale (saved to localStorage)
- **LED Calming Animation:** Visual preview (no hardware LED control)

**Gap:** Comfort Mode is a UI concept only. Hardware has no "comfort mode" implementation. The firmware does have:

- `sensitivity` parameter (currently 1.1, fixed)
- Smoothing via averaging (`avgDx`, `avgDy`)
- Deadzone filtering

But these are not dynamically adjustable from the web app.

#### **Accessibility Tools Screen**

- **Auto On-Screen Keyboard:** Toggle (UI only, no OS integration)
- **Cursor Glow Ring:** Toggle (UI only, no OS cursor modification)
- **Slow Mode:** Toggle (UI only, no actual cursor speed reduction)
- **Large Pointer Mode:** Toggle (UI only, no OS cursor size change)
- **Safe Mode:** Toggle (disables clicks in UI state, but hardware still sends clicks)

**Gap:** All accessibility features are UI-only. They would require:

- OS-level integration (Windows/Mac/Linux APIs)
- Browser extension or native app wrapper
- Or firmware-level click blocking (for Safe Mode)

#### **Caregiver/Emergency Screen**

- **Emergency Contacts Management:** Add/edit/delete contacts (localStorage only)
- **Message Template:** Customizable SOS message (localStorage only)
- **SOS Status Display:** Visual indicator
- **Test SOS Button:** Shows toast notification (no actual alert sent)

**Gap:** No actual SMS/email sending capability. Would require:

- Backend service (Twilio, SendGrid, etc.)
- API integration
- Or mobile app with native SMS/email APIs

#### **Device Settings Screen**

- **Sensor Calibration Wizard:** Multi-step UI flow (not connected to hardware)
- **X/Y Sensitivity Sliders:** Separate axis controls (saved locally, not sent to device)
- **Firmware Upload:** Button with "coming soon" message
- **Device Information:** Hardcoded values (v2.1.0, ASH-2024-1234, etc.)
- **Factory Reset:** Confirmation dialog (clears localStorage only)

**Gap:**

- Calibration wizard doesn't trigger hardware calibration
- Sensitivity sliders don't affect firmware
- No OTA (Over-The-Air) firmware update mechanism
- Device info is static

### 1.4 State Management Analysis

**SettingsContext.tsx:**

- Stores 15+ settings in a single context
- Persists to localStorage automatically
- No validation or type checking beyond TypeScript
- No synchronization with hardware
- Settings are assumed to map 1:1 with hardware parameters (incorrect assumption)

**App.tsx State:**

- `connectionStatus`: Simulated with interval timer
- `batteryLevel`: Hardcoded to 75%
- `currentMode`: UI state only
- `gestureActive`: Random simulation

**Gap:** No real-time device communication. All state is local/simulated.

### 1.5 UI Assumptions About Hardware/Software Interaction

The frontend makes several incorrect assumptions:

1. **Settings are instantly applied:** UI assumes changing a slider immediately affects device behavior. Reality: Settings must be sent via BLE.

2. **Device responds to all settings:** UI exposes settings (SOS, auto-center, volume twist) that don't exist in firmware.

3. **Calibration is a web app process:** UI shows a calibration wizard, but firmware calibration happens on-device at startup.

4. **Real-time status updates:** UI shows "live" gesture detection, but there's no data stream from device.

5. **Battery monitoring exists:** UI displays battery level, but ESP32 has no battery monitoring hardware in current setup.

6. **Multiple modes are firmware features:** UI has "Comfort Mode" as a toggle, but firmware has no mode switching logic.

---

## 2. Hardware Capabilities vs Frontend Design

### 2.1 Current Hardware Implementation (board.ino)

**Implemented:**

- ✅ Cursor movement via gyro (gx, gy)
- ✅ Left click via dwell (steady hold ~1.5s)
- ✅ Right click via wrist twist (gz > 16000 threshold)
- ✅ Gyro calibration on startup (500-sample average)
- ✅ Deadzone filtering (30 raw units)
- ✅ Cursor smoothing (7/8 averaging)
- ✅ BLE HID Mouse connection

**Hardcoded Parameters:**

```cpp
float sensitivity = 1.1;           // Not adjustable
int deadzone = 30;                  // Not adjustable
float dwellSec = 1.5;               // Not adjustable
int flickThreshold = 16000;         // Not adjustable
int dx = gx / 350;                  // Fixed divisor
int dy = -gy / 350;                 // Fixed divisor
```

**Missing (from frontend expectations):**

- ❌ No BLE service for configuration
- ❌ No parameter adjustment via BLE
- ❌ No status reporting (battery, mode, etc.)
- ❌ No comfort mode logic
- ❌ No SOS gesture detection
- ❌ No auto-center gesture
- ❌ No volume twist gesture
- ❌ No scroll gestures
- ❌ No battery monitoring hardware
- ❌ No LED control
- ❌ No vibration motor control

### 2.2 Feature Mapping Matrix

| Frontend Feature      | Hardware Status               | Gap                                    |
| --------------------- | ----------------------------- | -------------------------------------- |
| Dwell Time Adjustment | ❌ Hardcoded (1.5s)           | Needs BLE config service               |
| Twist Sensitivity     | ❌ Hardcoded (16000)          | Needs BLE config service               |
| X/Y Sensitivity       | ❌ Hardcoded (1.1, /350)      | Needs BLE config service               |
| Comfort Mode          | ❌ Not implemented            | Needs firmware mode logic              |
| Anti-Shake Strength   | ⚠️ Partial (smoothing exists) | Needs adjustable smoothing             |
| Cursor Smoothing      | ⚠️ Partial (fixed averaging)  | Needs adjustable smoothing             |
| Sensor Calibration    | ✅ Exists (on startup)        | Needs remote trigger via BLE           |
| SOS Gesture           | ❌ Not implemented            | Needs gesture detection + alert system |
| Auto-Center           | ❌ Not implemented            | Needs gesture detection                |
| Volume Twist          | ❌ Not implemented            | Needs gesture detection                |
| Battery Level         | ❌ No hardware                | Needs battery monitoring circuit       |
| LED Control           | ❌ Not implemented            | Needs LED hardware + control           |
| Safe Mode             | ❌ Not implemented            | Needs click blocking logic             |
| Scroll Gestures       | ❌ Not implemented            | Future feature                         |
| Firmware OTA          | ❌ Not implemented            | Needs OTA update system                |

**Legend:**

- ✅ Fully implemented
- ⚠️ Partially implemented (needs enhancement)
- ❌ Not implemented

---

## 3. Identified Gaps

### 3.1 Communication Gap

**Problem:** No communication channel between web app and ESP32.

**Current State:**

- ESP32 acts as BLE HID Mouse (standard mouse protocol)
- Web app is a standalone React SPA
- No shared communication protocol

**Required:**

- BLE GATT service for configuration
- Web Bluetooth API integration in frontend
- Or: Intermediate bridge service (Node.js/Electron)

### 3.2 Data Flow Gap

**Problem:** Settings flow is unidirectional (UI → localStorage), but needs to be bidirectional (UI ↔ Device).

**Current Flow:**

```
User adjusts slider → updateSettings() → localStorage → [STOPS HERE]
```

**Required Flow:**

```
User adjusts slider → updateSettings() → BLE write → ESP32 receives → Firmware applies → ESP32 confirms → UI updates
```

### 3.3 Feature Mismatch Gap

**Problem:** Frontend exposes features that don't exist in firmware.

**Examples:**

- SOS Gesture (no detection logic in firmware)
- Auto-Center Gesture (no detection logic)
- Volume Twist (no detection logic)
- Comfort Mode toggle (no mode switching in firmware)
- Battery monitoring (no hardware)

**Impact:** Users can "configure" features that don't work, leading to confusion.

### 3.4 Real-Time Status Gap

**Problem:** UI shows "live" status, but device doesn't report status.

**Missing:**

- Connection status (currently simulated)
- Battery level (hardcoded)
- Gesture detection events (simulated)
- Mode status (UI-only)
- Calibration status

**Required:** BLE characteristic for status reporting or periodic polling.

### 3.5 Calibration Gap

**Problem:** Calibration happens on-device at startup, but UI shows a "wizard."

**Current:** Firmware calibrates automatically in `setup()`

**UI Expectation:** User-triggered calibration via web app

**Solution Options:**

1. Add BLE command to trigger calibration remotely
2. Remove calibration wizard from UI (misleading)
3. Make calibration a background process (no user interaction)

### 3.6 Accessibility Features Gap

**Problem:** UI toggles for OS-level features (cursor glow, large pointer, on-screen keyboard) cannot be implemented from a web app.

**Limitation:** Web apps run in browser sandbox and cannot:

- Modify OS cursor appearance
- Control OS accessibility settings
- Trigger OS on-screen keyboard

**Solutions:**

1. Create Electron wrapper (desktop app with OS APIs)
2. Create browser extension (limited OS access)
3. Remove these features from web app
4. Document that these require manual OS configuration

---

## 4. Proposed Software Architecture

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Application (React)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   UI Layer   │  │  State Mgmt  │  │  BLE Service │     │
│  │  (Screens)   │→ │  (Context)   │→ │  (Web API)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │ Web Bluetooth API
                             │ (or Bridge Service)
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    ESP32 Firmware                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  BLE HID     │  │  BLE Config  │  │  Status      │     │
│  │  Mouse       │  │  Service      │  │  Reporting   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │            │
│         ↓                  ↓                  ↓            │
│  ┌──────────────────────────────────────────────────┐     │
│  │         Mouse Control Logic                      │     │
│  │  (Cursor, Clicks, Gestures)                      │     │
│  └──────────────────────────────────────────────────┘     │
│         │                                                  │
│         ↓                                                  │
│  ┌──────────────┐                                         │
│  │   MPU6050    │                                         │
│  │   Sensor     │                                         │
│  └──────────────┘                                         │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Communication Protocol Design

#### **Option A: Web Bluetooth API (Recommended for MVP)**

**Pros:**

- Direct browser-to-device communication
- No intermediate server needed
- Works on Chrome/Edge (desktop)
- Low latency

**Cons:**

- Not supported on iOS Safari
- Requires HTTPS (or localhost)
- Limited to Chrome/Edge browsers

**Implementation:**

```typescript
// BLE Service Structure
Service UUID: 0x1812 (HID) - Existing
Service UUID: 0xFFE0 (Custom Config) - New

Characteristics:
- 0xFFE1: Write Configuration (sensitivity, dwell, etc.)
- 0xFFE2: Read Status (battery, mode, connection)
- 0xFFE3: Write Commands (calibrate, reset, etc.)
- 0xFFE4: Notify Events (gesture detected, click events)
```

#### **Option B: Bridge Service (Node.js/Electron)**

**Pros:**

- Cross-browser compatible
- Can use native BLE libraries (noble, bleno)
- Can integrate OS-level features
- Better for production deployment

**Cons:**

- Requires separate service process
- More complex deployment
- Higher latency

**Implementation:**

```
Web App → WebSocket/HTTP → Node.js Bridge → BLE Library → ESP32
```

#### **Option C: Hybrid Approach**

- Web Bluetooth for Chrome/Edge users
- Bridge service for Safari/other browsers
- Electron app for desktop deployment with OS integration

### 4.3 Data Flow Design

#### **Settings Update Flow:**

```
1. User adjusts slider in UI
2. SettingsContext.updateSettings() called
3. BLE Service writes to device characteristic
4. ESP32 receives BLE packet
5. ESP32 parses and validates parameter
6. ESP32 updates internal variable
7. ESP32 sends confirmation packet
8. Web app receives confirmation
9. UI shows success toast
10. Settings persisted to localStorage (backup)
```

#### **Status Polling Flow:**

```
1. Web app connects to device
2. Web app subscribes to status notifications
3. ESP32 periodically sends status updates:
   - Connection state
   - Battery level (if available)
   - Current mode
   - Gesture activity
4. Web app updates UI in real-time
```

#### **Calibration Flow:**

```
1. User clicks "Start Calibration" in UI
2. Web app sends calibration command via BLE
3. ESP32 enters calibration mode
4. ESP32 collects 500 samples (same as current)
5. ESP32 calculates offsets
6. ESP32 stores offsets in EEPROM/Flash
7. ESP32 sends completion status
8. Web app shows success message
```

### 4.4 Firmware Modifications Required

#### **New BLE Service (Custom Configuration)**

```cpp
// Add to board.ino
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Service UUID
#define SERVICE_UUID "ffe0abcd-1234-5678-9012-abcdef123456"

// Characteristic UUIDs
#define CONFIG_CHAR_UUID "ffe1abcd-1234-5678-9012-abcdef123456"
#define STATUS_CHAR_UUID "ffe2abcd-1234-5678-9012-abcdef123456"
#define COMMAND_CHAR_UUID "ffe3abcd-1234-5678-9012-abcdef123456"
#define EVENT_CHAR_UUID "ffe4abcd-1234-5678-9012-abcdef123456"

BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pConfigChar;
BLECharacteristic *pStatusChar;
BLECharacteristic *pCommandChar;
BLECharacteristic *pEventChar;

// Configuration structure
struct DeviceConfig {
  float sensitivity;
  int deadzone;
  float dwellSec;
  int flickThreshold;
  int smoothingLevel;
  bool comfortMode;
  bool safeMode;
};

DeviceConfig config = {
  .sensitivity = 1.1,
  .deadzone = 30,
  .dwellSec = 1.5,
  .flickThreshold = 16000,
  .smoothingLevel = 7,
  .comfortMode = false,
  .safeMode = false
};

// Callback for configuration writes
class ConfigCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    // Parse incoming data and update config
    // Validate ranges
    // Apply to mouse control logic
  }
};

void setupBLEConfig() {
  BLEDevice::init("Airis-SH-Config");
  pServer = BLEDevice::createServer();
  pService = pServer->createService(SERVICE_UUID);

  pConfigChar = pService->createCharacteristic(
    CONFIG_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );
  pConfigChar->setCallbacks(new ConfigCallbacks());

  // Similar for other characteristics...

  pService->start();
  pServer->getAdvertising()->start();
}
```

#### **Parameter Application in Loop:**

```cpp
void loop() {
  // Use config.sensitivity instead of hardcoded 1.1
  int moveX = avgDx * config.sensitivity;
  int moveY = avgDy * config.sensitivity;

  // Use config.dwellSec instead of hardcoded 1.5
  if (millis() - dwellStart > config.dwellSec * 1000) {
    if (!config.safeMode) {  // Safe mode blocks clicks
      bleMouse.click(MOUSE_LEFT);
    }
  }

  // Use config.flickThreshold instead of hardcoded 16000
  if (abs(gz) > config.flickThreshold) {
    if (!config.safeMode) {
      bleMouse.click(MOUSE_RIGHT);
    }
  }

  // Apply comfort mode smoothing
  if (config.comfortMode) {
    // Enhanced smoothing logic
  }
}
```

### 4.5 Frontend BLE Service Implementation

```typescript
// src/services/BleService.ts
export class BleService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private service: BluetoothRemoteGATTService | null = null;
  private configChar: BluetoothRemoteGATTCharacteristic | null = null;
  private statusChar: BluetoothRemoteGATTCharacteristic | null = null;

  async connect(): Promise<void> {
    // Request device
    this.device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Airis-SH" }],
      optionalServices: ["ffe0abcd-1234-5678-9012-abcdef123456"],
    });

    // Connect to GATT server
    this.server = await this.device.gatt?.connect();

    // Get service
    this.service = await this.server.getPrimaryService(
      "ffe0abcd-1234-5678-9012-abcdef123456"
    );

    // Get characteristics
    this.configChar = await this.service.getCharacteristic(
      "ffe1abcd-1234-5678-9012-abcdef123456"
    );

    this.statusChar = await this.service.getCharacteristic(
      "ffe2abcd-1234-5678-9012-abcdef123456"
    );

    // Subscribe to status notifications
    await this.statusChar.startNotifications();
    this.statusChar.addEventListener(
      "characteristicvaluechanged",
      this.handleStatusUpdate.bind(this)
    );
  }

  async writeConfig(config: DeviceConfig): Promise<void> {
    if (!this.configChar) throw new Error("Not connected");

    const buffer = this.serializeConfig(config);
    await this.configChar.writeValue(buffer);
  }

  async readStatus(): Promise<DeviceStatus> {
    if (!this.statusChar) throw new Error("Not connected");

    const value = await this.statusChar.readValue();
    return this.deserializeStatus(value);
  }

  private handleStatusUpdate(event: Event): void {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    const status = this.deserializeStatus(value);

    // Emit event or update context
    this.onStatusUpdate?.(status);
  }

  onStatusUpdate?: (status: DeviceStatus) => void;
}
```

### 4.6 State Management Enhancement

```typescript
// Enhanced SettingsContext with BLE integration
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [bleService] = useState(() => new BleService());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize BLE connection
    bleService
      .connect()
      .then(() => {
        setIsConnected(true);
        // Load settings from device
        bleService.readStatus().then((deviceStatus) => {
          // Merge device settings with local settings
          setSettings((prev) => ({ ...prev, ...deviceStatus }));
        });
      })
      .catch((err) => {
        console.error("BLE connection failed:", err);
        // Fallback to localStorage
      });

    // Subscribe to status updates
    bleService.onStatusUpdate = (status) => {
      setSettings((prev) => ({ ...prev, ...status }));
    };
  }, []);

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    // Persist to localStorage (backup)
    localStorage.setItem("airis-sh-settings", JSON.stringify(newSettings));

    // Send to device if connected
    if (isConnected) {
      try {
        await bleService.writeConfig(newSettings);
      } catch (err) {
        console.error("Failed to write to device:", err);
        // Show error toast
      }
    }
  };

  // ... rest of implementation
};
```

---

## 5. Implementation Roadmap

### Phase 1: Foundation (NOW - Can Implement)

**Goal:** Establish basic communication between web app and ESP32.

**Tasks:**

1. ✅ Add BLE GATT service to ESP32 firmware (custom config service)
2. ✅ Implement Web Bluetooth API service in React app
3. ✅ Create device connection flow in UI
4. ✅ Implement basic parameter writing (sensitivity, dwell time)
5. ✅ Test bidirectional communication

**Deliverables:**

- ESP32 accepts configuration via BLE
- Web app can connect and send settings
- Settings are applied in real-time on device

**Estimated Effort:** 2-3 weeks

### Phase 2: Core Features (After Phase 1)

**Goal:** Make existing UI features functional.

**Tasks:**

1. ✅ Implement X/Y sensitivity adjustment (separate axes)
2. ✅ Implement twist sensitivity adjustment
3. ✅ Implement comfort mode logic in firmware
4. ✅ Implement anti-shake/smoothing adjustment
5. ✅ Implement remote calibration trigger
6. ✅ Add status reporting (connection, mode, gesture activity)

**Deliverables:**

- All sliders in Gesture Settings work
- Comfort Mode toggle affects device behavior
- Calibration wizard triggers hardware calibration
- Dashboard shows real device status

**Estimated Effort:** 3-4 weeks

### Phase 3: Advanced Features (Future)

**Goal:** Implement features that require new firmware logic.

**Tasks:**

1. ⏳ Implement SOS gesture detection
2. ⏳ Implement auto-center gesture
3. ⏳ Implement volume twist gesture
4. ⏳ Add scroll gesture support
5. ⏳ Implement safe mode (click blocking)
6. ⏳ Add LED control (if hardware added)
7. ⏳ Add vibration motor control (if hardware added)

**Deliverables:**

- All gesture toggles in UI are functional
- Safe mode prevents accidental clicks
- LED animations work (if hardware available)

**Estimated Effort:** 4-6 weeks

### Phase 4: Accessibility & Polish (Future)

**Goal:** OS-level integration and production readiness.

**Tasks:**

1. ⏳ Create Electron wrapper for OS-level features
2. ⏳ Implement cursor glow (OS API)
3. ⏳ Implement large pointer mode (OS API)
4. ⏳ Implement auto on-screen keyboard (OS API)
5. ⏳ Add battery monitoring (if hardware added)
6. ⏳ Implement OTA firmware updates
7. ⏳ Add error handling and retry logic
8. ⏳ Add connection persistence/reconnection

**Deliverables:**

- Desktop app with full OS integration
- All accessibility features functional
- Production-ready error handling

**Estimated Effort:** 6-8 weeks

### Phase 5: Emergency Features (Future)

**Goal:** Implement caregiver/emergency functionality.

**Tasks:**

1. ⏳ Add backend service for SMS/email
2. ⏳ Implement SOS alert system
3. ⏳ Add emergency contact management (cloud sync)
4. ⏳ Add usage analytics (privacy-respecting)
5. ⏳ Add remote monitoring for caregivers

**Deliverables:**

- SOS alerts work end-to-end
- Caregivers can monitor device usage
- Emergency contacts receive alerts

**Estimated Effort:** 4-6 weeks (requires backend infrastructure)

---

## 6. What Can Be Implemented NOW

### ✅ Immediate Implementation (Current Hardware)

1. **BLE Configuration Service**

   - Add custom BLE service to ESP32
   - Expose characteristics for reading/writing config
   - No hardware changes needed

2. **Web Bluetooth Integration**

   - Implement BLE service in React app
   - Connect to device and read/write settings
   - Works on Chrome/Edge desktop

3. **Real-Time Parameter Adjustment**

   - Sensitivity (overall)
   - Dwell time
   - Twist threshold
   - Deadzone
   - Smoothing level

4. **Remote Calibration**

   - Trigger calibration via BLE command
   - Show progress in UI
   - Confirm completion

5. **Status Reporting**

   - Connection status (real)
   - Current mode (if implemented)
   - Gesture activity (if events sent)

6. **Comfort Mode (Basic)**
   - Toggle that adjusts sensitivity/smoothing
   - No new gestures needed
   - Uses existing smoothing logic

### ⚠️ Requires Firmware Logic (No Hardware Changes)

1. **Safe Mode**

   - Add click blocking logic in firmware
   - Toggle via BLE
   - Simple boolean check

2. **Separate X/Y Sensitivity**

   - Modify cursor calculation to use separate multipliers
   - No hardware changes

3. **Enhanced Smoothing**
   - Adjustable smoothing level
   - Modify averaging algorithm

### ❌ Cannot Implement Now (Hardware/Infrastructure Required)

1. **Battery Monitoring**

   - Requires battery monitoring circuit
   - ADC reading on ESP32
   - Hardware addition needed

2. **LED Control**

   - Requires LED hardware
   - GPIO pins available, but no LEDs connected

3. **Vibration Motor Control**

   - Hardware exists but not controlled in firmware
   - Can be added with firmware update

4. **SOS/Alert System**

   - Requires backend service
   - SMS/email API integration
   - Infrastructure needed

5. **OS-Level Accessibility Features**

   - Requires Electron or browser extension
   - OS API access needed
   - Not possible in pure web app

6. **Scroll Gestures**

   - Requires gesture detection logic
   - Firmware implementation needed
   - No hardware changes

7. **OTA Firmware Updates**
   - Requires OTA library on ESP32
   - Web server for firmware hosting
   - Infrastructure needed

---

## 7. Practical Recommendations

### 7.1 Immediate Actions

1. **Start with BLE Communication**

   - This is the foundation for everything else
   - Can be done without changing existing mouse functionality
   - Test with simple parameter (e.g., sensitivity)

2. **Prioritize Core Settings**

   - Dwell time (most requested)
   - Sensitivity (most impactful)
   - Calibration (user-facing feature)

3. **Simplify UI Initially**
   - Hide/disable features that don't work yet
   - Add "Coming Soon" badges
   - Focus on what works

### 7.2 Architecture Decisions

1. **Use Web Bluetooth for MVP**

   - Fastest path to functionality
   - No server infrastructure needed
   - Can migrate to bridge later if needed

2. **Keep BLE HID Mouse Separate**

   - Don't break existing mouse functionality
   - Run config service in parallel
   - Two BLE services: HID + Config

3. **LocalStorage as Backup**
   - Store settings locally even when connected
   - Restore on reconnect
   - Offline mode support

### 7.3 User Experience Considerations

1. **Connection Flow**

   - Clear "Connect Device" button
   - Show connection status prominently
   - Auto-reconnect on page load (if previously connected)

2. **Settings Sync**

   - Load device settings on connect
   - Show "synced" indicator
   - Handle conflicts (device vs. local)

3. **Error Handling**

   - Graceful degradation if BLE unavailable
   - Clear error messages
   - Retry mechanisms

4. **Feedback**
   - Toast notifications for actions
   - Loading states during BLE operations
   - Visual confirmation of applied settings

### 7.4 Code Organization

```
src/
├── services/
│   ├── BleService.ts          # Web Bluetooth wrapper
│   └── DeviceConfig.ts         # Config serialization
├── context/
│   ├── SettingsContext.tsx    # Enhanced with BLE
│   └── DeviceContext.tsx      # Device connection state
├── hooks/
│   ├── useBluetooth.ts         # BLE connection hook
│   └── useDeviceStatus.ts      # Status polling hook
└── utils/
    ├── bleProtocol.ts          # Protocol definitions
    └── configMapper.ts         # UI settings ↔ Firmware params
```

---

## 8. Constraints & Limitations

### 8.1 Web Bluetooth Limitations

- **Browser Support:** Chrome/Edge only (desktop)
- **HTTPS Required:** Must use HTTPS (or localhost)
- **User Gesture Required:** Connection must be initiated by user action
- **iOS Not Supported:** Safari on iOS cannot use Web Bluetooth

### 8.2 ESP32 Limitations

- **BLE HID + Custom Service:** Can run both, but may impact performance
- **Memory Constraints:** Limited RAM for complex logic
- **Battery:** No monitoring without additional hardware
- **Processing Power:** Complex gesture detection may lag

### 8.3 Hardware Constraints

- **No Battery Monitoring:** Circuit not present
- **No LED Control:** LEDs not connected (if planned)
- **Limited GPIO:** Some pins may be in use
- **Power Management:** No sleep/wake logic currently

### 8.4 Web App Constraints

- **OS Integration:** Cannot modify OS settings from browser
- **Security:** Browser sandbox limits system access
- **Offline:** Limited functionality without device connection
- **Cross-Platform:** Web Bluetooth not universal

---

## 9. Success Metrics

### Phase 1 Success Criteria:

- ✅ Web app can connect to ESP32 via BLE
- ✅ Settings can be written to device
- ✅ Device applies settings in real-time
- ✅ Connection status is accurate

### Phase 2 Success Criteria:

- ✅ All core sliders affect device behavior
- ✅ Comfort Mode toggle works
- ✅ Calibration can be triggered remotely
- ✅ Dashboard shows real device data

### Phase 3 Success Criteria:

- ✅ All gesture toggles are functional
- ✅ Safe Mode prevents clicks
- ✅ No UI features that don't work

### Production Readiness:

- ✅ Error handling for all BLE operations
- ✅ Graceful degradation when BLE unavailable
- ✅ Settings persist across sessions
- ✅ Clear user feedback for all actions
- ✅ Documentation for users and developers

---

## 10. Conclusion

The Airis-SH web application has a **solid UI foundation** but currently operates in **isolation from the hardware**. The gap is primarily a **communication layer** that needs to be built.

**Key Takeaways:**

1. **The UI is well-designed** but makes assumptions about hardware capabilities that don't match reality.

2. **The hardware is functional** but lacks configurability and status reporting.

3. **The bridge is missing:** A BLE GATT service for configuration is the critical missing piece.

4. **Implementation is feasible:** Most core features can be implemented with firmware updates and Web Bluetooth integration.

5. **Some features need infrastructure:** Emergency alerts, OTA updates, and OS-level accessibility require additional services or native apps.

**Recommended Next Steps:**

1. Implement BLE configuration service in ESP32 firmware
2. Integrate Web Bluetooth API in React app
3. Start with core settings (sensitivity, dwell time)
4. Test end-to-end with real device
5. Iterate based on user feedback

**Timeline Estimate:**

- **MVP (Phase 1):** 2-3 weeks
- **Core Features (Phase 2):** 3-4 weeks
- **Full Feature Set (Phase 3-5):** 3-4 months

This analysis provides a clear roadmap for transforming the Airis-SH from a prototype with separate hardware and software into a fully integrated assistive technology system.

---

**Document Version:** 1.0  
**Date:** 2024  
**Author:** Software Architecture Analysis
