# Airis-SH Control Center

A modern, accessible web-based control center for the Airis-SH gesture-based air mouse designed for autistic and physically-disabled individuals.

## Overview

This is a complete desktop-style application built with React, TypeScript, and Tailwind CSS. It features a beautiful, calming UI with soft gradients, glass-morphism effects, smooth animations, and full accessibility support.

## Recent Changes (November 24, 2025)

- Initial project setup with React + Vite + TypeScript
- Implemented all 7 screens with full functionality
- Created reusable components (Layout, Toast notifications, Toggle switches, Sliders)
- Added smooth animations and transitions throughout the app
- Configured Tailwind CSS with custom animations (glow, breathe, float, pulse-soft)
- Set up workflow to run development server on port 5000

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with sidebar navigation
│   │   ├── Toast.tsx           # Toast notification system
│   │   ├── ToggleSwitch.tsx    # Accessible toggle component
│   │   └── Slider.tsx          # Range slider component
│   ├── screens/
│   │   ├── Dashboard.tsx       # Connection status, battery, mode, gestures
│   │   ├── GestureSettings.tsx # Gesture customization
│   │   ├── ComfortMode.tsx     # Calming settings for autistic users
│   │   ├── AccessibilityTools.tsx # Accessibility features
│   │   ├── Caregiver.tsx       # Emergency contacts and SOS
│   │   ├── DeviceSettings.tsx  # Sensor calibration and firmware
│   │   └── About.tsx           # Product story and credits
│   ├── App.tsx                 # Main app with routing and state
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles and animations
```

## Key Features

### Dashboard Screen
- Real-time Bluetooth/Wired connection status with animated searching indicator
- Circular animated battery gauge (75% default)
- Current mode display (Normal, Comfort Mode, Safe Mode)
- Live gesture detection indicator with pulsing animation
- 3 LED status indicators with breathing effect

### Gesture Settings Screen
- Adjustable left click dwell time (1-3 seconds slider)
- Right click twist sensitivity (1-10 slider)
- Toggles for SOS gesture, auto-center, and volume twist
- Live animated preview of gesture detection
- Reset to defaults button

### Comfort Mode Screen
- Toggle switch to enable/disable Comfort Mode
- Anti-shake strength slider (1-10)
- Cursor smoothing level slider (1-10)
- Calming LED animation preview with breathing effect
- Information card explaining the feature for autistic users

### Accessibility Tools Screen
- Auto open on-screen keyboard toggle
- Cursor glow ring highlight toggle
- Slow mode for unsteady hands
- Large pointer mode toggle
- Safe mode to disable clicks temporarily
- Informational cards for each feature

### Caregiver/Emergency Screen
- Add/edit/delete emergency contacts (name, phone, email)
- Customizable emergency message template
- Test SOS button
- SOS status indicator (Active/Inactive)
- How SOS works information panel

### Device Settings Screen
- 3-step sensor calibration wizard for MPU6050
- X-axis and Y-axis sensitivity sliders
- Firmware update upload button
- Device information display (name, version, serial, hardware rev)
- Factory reset with confirmation (danger zone)

### About Screen
- Animated Airis-SH logo
- Mission statement
- Designed for autistic & disabled users information
- Key features grid (6 feature cards)
- Credits and version information

## Technical Details

### Design System
- **Colors**: Sky blue (#38bdf8), soft teal (#2dd4bf), pastels, white
- **Effects**: Glass-morphism, soft shadows, smooth gradients
- **Animations**: Glow, breathe, float, pulse-soft
- **Accessibility**: Large fonts, high contrast, rounded edges, simple icons

### Animations
- Searching spinner for Bluetooth connection
- Battery gauge circular progress
- Gesture detection pulsing orb
- LED breathing effects in Comfort Mode
- Smooth page transitions with Framer Motion
- Toast notifications slide in from right

### State Management
- React hooks (useState, useEffect)
- Global app state for connection, battery, mode, gestures
- Toast notification queue system
- Auto-refresh connection status every 3 seconds

### Navigation
- React Router for client-side routing
- 7 main routes matching the screen requirements
- Persistent sidebar with active state highlighting
- Smooth hover and active state transitions

## Running the App

The app runs on port 5000 and is accessible via the Replit webview.

```bash
npm run dev
```

## Dependencies

- React 18.2
- React Router DOM 6.20
- Framer Motion (animations)
- Lucide React (icons)
- Tailwind CSS (styling)
- TypeScript (type safety)

## Design Philosophy

The entire application is designed to be:
1. **Calming** - Soft colors, gentle animations, non-threatening UI
2. **Accessible** - Large touch targets, high contrast, simple language
3. **Supportive** - Helpful tooltips, clear feedback, emotional warmth
4. **Premium** - Modern design, smooth interactions, attention to detail
5. **Empowering** - Features that promote independence for disabled users

## Future Enhancements

- Real device Bluetooth/USB integration
- Persistent settings storage
- Multi-language support
- Voice control integration
- Activity logging and analytics
- Caregiver remote monitoring dashboard
