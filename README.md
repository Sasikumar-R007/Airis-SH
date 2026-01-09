# Airis-SH Control Center

A modern React-based desktop control center application built with TypeScript, Vite, and Tailwind CSS. This application serves as a companion software for the Airis-SH device, providing an intuitive interface for device management, gesture settings, comfort modes, and accessibility tools.

## Project Overview

**Tech Stack:**

- **Frontend Framework:** React 18.2.0
- **Language:** TypeScript 5.3.3
- **Build Tool:** Vite 5.0.8
- **Styling:** Tailwind CSS 3.3.6
- **Routing:** React Router DOM 6.20.0
- **Animations:** Framer Motion 10.16.16
- **Icons:** Lucide React 0.294.0

**Project Structure:**

```
Airis-SH/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Slider.tsx
│   │   ├── Toast.tsx
│   │   └── ToggleSwitch.tsx
│   ├── context/           # React Context providers
│   │   └── SettingsContext.tsx
│   ├── screens/           # Main application screens
│   │   ├── Dashboard.tsx
│   │   ├── GestureSettings.tsx
│   │   ├── ComfortMode.tsx
│   │   ├── AccessibilityTools.tsx
│   │   ├── Caregiver.tsx
│   │   ├── DeviceSettings.tsx
│   │   └── About.tsx
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (version 16.0 or higher recommended)

   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify installation: `npm --version` or `yarn --version`

## Installation & Setup

### Step 1: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project directory:

```bash
cd "C:\Users\sasir\OneDrive\Documents\Sasikumar R\Airis-SH\Airis-SH Software\Airis-SH"
```

### Step 2: Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

**Alternative with yarn:**

```bash
yarn install
```

This will install all dependencies listed in `package.json`, including:

- React and React DOM
- React Router DOM
- Framer Motion
- Lucide React
- TypeScript
- Vite
- Tailwind CSS
- And other development dependencies

### Step 3: Verify Installation

After installation completes, verify that `node_modules` folder has been created in the project root.

## Running the Project

### Development Mode

To start the development server:

```bash
npm run dev
```

**What happens:**

- Vite will start a development server
- The application will be available at `http://localhost:5000`
- The server is configured to listen on `0.0.0.0:5000` (accessible from network)
- Hot Module Replacement (HMR) is enabled for instant updates

**Access the application:**

- Local: `http://localhost:5000`
- Network: `http://[your-ip]:5000`

### Build for Production

To create a production build:

```bash
npm run build
```

**What happens:**

- TypeScript compilation check (`tsc`)
- Vite builds optimized production files
- Output will be in the `dist/` folder

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Starts development server on port 5000 |
| `npm run build`   | Creates optimized production build     |
| `npm run preview` | Previews the production build locally  |

## Application Features

The Airis-SH Control Center includes the following screens:

1. **Dashboard** - Main overview with device status and quick controls
2. **Gesture Settings** - Configure gesture recognition and controls
3. **Comfort Mode** - Adjust comfort and safety settings
4. **Accessibility Tools** - Accessibility features and options
5. **Caregiver** - Caregiver-specific settings and monitoring
6. **Device Settings** - General device configuration
7. **About** - Application information

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, you can modify the port in `vite.config.ts`:

```typescript
server: {
  port: 5001, // Change to any available port
}
```

### Node Modules Issues

If you encounter dependency issues:

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

**Windows PowerShell:**

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### TypeScript Errors

If you see TypeScript compilation errors:

```bash
# Check TypeScript version
npx tsc --version

# Run type checking
npx tsc --noEmit
```

### Build Errors

If the build fails:

1. Ensure all dependencies are installed: `npm install`
2. Clear Vite cache: Delete `.vite` folder if it exists
3. Check for TypeScript errors: `npx tsc --noEmit`

## Development Notes

- **Hot Reload:** Changes to source files will automatically reload in the browser
- **TypeScript:** Strict mode is enabled for better type safety
- **Styling:** Tailwind CSS is used for all styling with custom theme colors
- **Routing:** React Router is configured for client-side routing
- **State Management:** React Context API is used for settings management

## Browser Support

The application should work in all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Project Version:** 1.0.0  
**Last Updated:** 2024

