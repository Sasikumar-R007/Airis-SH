import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './screens/Dashboard'
import GestureSettings from './screens/GestureSettings'
import ComfortMode from './screens/ComfortMode'
import AccessibilityTools from './screens/AccessibilityTools'
import Caregiver from './screens/Caregiver'
import DeviceSettings from './screens/DeviceSettings'
import About from './screens/About'
import Toast from './components/Toast'
import { SettingsProvider, useSettings } from './context/SettingsContext'

export interface AppState {
  connectionStatus: 'connected' | 'searching' | 'disconnected'
  isWiredMode: boolean
  batteryLevel: number
  currentMode: 'Normal' | 'Comfort Mode' | 'Safe Mode'
  gestureActive: boolean
}

function AppContent() {
  const { settings } = useSettings()
  const [appState, setAppState] = useState<AppState>({
    connectionStatus: 'searching',
    isWiredMode: false,
    batteryLevel: 75,
    currentMode: settings.safeMode ? 'Safe Mode' : 'Normal',
    gestureActive: false
  })

  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'info' | 'success' | 'warning' | 'error' }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setAppState(prev => ({
        ...prev,
        connectionStatus: prev.connectionStatus === 'searching' ? 'connected' : prev.connectionStatus,
        gestureActive: Math.random() > 0.7
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  return (
    <Router>
      <Layout appState={appState}>
        <Routes>
          <Route path="/" element={<Dashboard appState={appState} />} />
          <Route path="/gesture-settings" element={<GestureSettings showToast={showToast} />} />
          <Route path="/comfort-mode" element={<ComfortMode appState={appState} setAppState={setAppState} showToast={showToast} />} />
          <Route path="/accessibility" element={<AccessibilityTools showToast={showToast} />} />
          <Route path="/caregiver" element={<Caregiver showToast={showToast} />} />
          <Route path="/device-settings" element={<DeviceSettings showToast={showToast} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
      <div className="fixed bottom-4 right-4 z-50 space-y-2" role="status" aria-live="polite">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </Router>
  )
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}

export default App
