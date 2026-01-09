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
import AirMouseSystem from './screens/AirMouseSystem'
import Toast from './components/Toast'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { bleEmergencyService } from './services/BleEmergencyService'
import { sendSOSAlert } from './services/EmergencyService'

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

  // Initialize Emergency Alert Monitoring
  useEffect(() => {
    // Set up emergency alert callback
    bleEmergencyService.setCallbacks({
      onEmergencyDetected: async () => {
        const contacts = settings.emergencyContacts
        const message = settings.messageTemplate || '🚨 Emergency alert from Airis-SH device! Please help immediately.'
        
        if (contacts.length === 0) {
          showToast('⚠️ Emergency detected but no contacts configured!', 'warning')
          return
        }

        // Validate contacts
        const validContacts = contacts.filter(c => 
          (c.phone && c.phone.trim() !== '') || (c.email && c.email.trim() !== '')
        )

        if (validContacts.length === 0) {
          showToast('⚠️ No valid emergency contacts found!', 'error')
          return
        }

        // Trigger emergency response
        showToast('🚨 Emergency alert triggered! Contacting emergency services...', 'error')
        
        try {
          const result = await sendSOSAlert(validContacts, message, {
            callFirst: true,  // Call first contact immediately
            sendSMS: true,    // Send SMS to all
            sendEmail: true   // Send email to all
          })
          
          if (result.success) {
            showToast(
              `✅ Emergency alert sent! Called: ${result.called}, SMS: ${result.sent - result.called}, Email: ${result.sent}`,
              'success'
            )
          } else {
            showToast('⚠️ Some alerts failed to send. Please check contacts.', 'warning')
          }
        } catch (error) {
          console.error('Emergency alert error:', error)
          showToast('❌ Failed to send emergency alert. Please try manually.', 'error')
        }
      }
    })

    // Attempt to connect to device for emergency monitoring
    const connectEmergencyService = async () => {
      try {
        const connected = await bleEmergencyService.connect()
        if (connected) {
          console.log('✅ Emergency monitoring active')
          showToast('Emergency monitoring connected', 'success')
        } else {
          console.log('⚠️ Emergency monitoring not available (device not found or Web Bluetooth not supported)')
        }
      } catch (error) {
        console.log('Emergency monitoring connection failed:', error)
        // Don't show error toast - this is expected if device is not nearby or browser doesn't support it
      }
    }

    // Try to connect (user may need to grant permission)
    // Note: Web Bluetooth requires user gesture, so we'll attempt on app load
    // For better UX, you might want to add a "Connect Device" button
    connectEmergencyService()

    // Cleanup on unmount
    return () => {
      bleEmergencyService.disconnect()
    }
  }, [settings.emergencyContacts, settings.messageTemplate])

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
          <Route path="/air-mouse" element={<AirMouseSystem />} />
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
