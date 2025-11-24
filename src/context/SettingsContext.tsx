import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface EmergencyContact {
  id: number
  name: string
  phone: string
  email: string
}

interface Settings {
  dwellTime: number
  twistSensitivity: number
  sosEnabled: boolean
  autoCenterEnabled: boolean
  volumeTwistEnabled: boolean
  antiShakeStrength: number
  smoothingLevel: number
  autoKeyboard: boolean
  cursorGlow: boolean
  slowMode: boolean
  largePointer: boolean
  safeMode: boolean
  xSensitivity: number
  ySensitivity: number
  emergencyContacts: EmergencyContact[]
  messageTemplate: string
}

const defaultSettings: Settings = {
  dwellTime: 2,
  twistSensitivity: 5,
  sosEnabled: true,
  autoCenterEnabled: true,
  volumeTwistEnabled: false,
  antiShakeStrength: 5,
  smoothingLevel: 7,
  autoKeyboard: false,
  cursorGlow: true,
  slowMode: false,
  largePointer: false,
  safeMode: false,
  xSensitivity: 5,
  ySensitivity: 5,
  emergencyContacts: [
    { id: 1, name: 'Emergency Contact', phone: '(555) 123-4567', email: 'contact@example.com' }
  ],
  messageTemplate: 'Emergency! I need assistance. Please contact me immediately.'
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('airis-sh-settings')
    return saved ? JSON.parse(saved) : defaultSettings
  })

  useEffect(() => {
    localStorage.setItem('airis-sh-settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
