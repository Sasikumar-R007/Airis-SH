import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Plus, Trash2, AlertCircle, Send, Phone, Mail, Shield, Clock, Activity, CheckCircle, Bluetooth } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { sendSOSAlert, validateContact } from '../services/EmergencyService'
import { bleEmergencyService } from '../services/BleEmergencyService'

interface EmergencyContact {
  id: number
  name: string
  phone: string
  email: string
}

interface CaregiverProps {
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const Caregiver = ({ showToast }: CaregiverProps) => {
  const { settings, updateSettings } = useSettings()
  const contacts = settings.emergencyContacts
  const messageTemplate = settings.messageTemplate
  const sosActive = settings.sosEnabled
  const [isEmergencyMonitoringActive, setIsEmergencyMonitoringActive] = useState(false)

  // Check emergency monitoring status
  useEffect(() => {
    const checkStatus = () => {
      setIsEmergencyMonitoringActive(bleEmergencyService.getConnected())
    }
    
    checkStatus()
    const interval = setInterval(checkStatus, 2000) // Check every 2 seconds
    
    return () => clearInterval(interval)
  }, [])

  const handleConnectEmergencyMonitoring = async () => {
    try {
      const connected = await bleEmergencyService.connect()
      if (connected) {
        setIsEmergencyMonitoringActive(true)
        showToast('Emergency monitoring connected', 'success')
      } else {
        showToast('Failed to connect. Make sure device is nearby and Bluetooth is enabled.', 'warning')
      }
    } catch (error) {
      console.error('Connection error:', error)
      showToast('Connection failed. Check browser console for details.', 'error')
    }
  }

  const addContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now(),
      name: 'New Contact',
      phone: '',
      email: ''
    }
    updateSettings({ emergencyContacts: [...contacts, newContact] })
    showToast('New contact added', 'success')
  }

  const deleteContact = (id: number) => {
    updateSettings({ emergencyContacts: contacts.filter(c => c.id !== id) })
    showToast('Contact removed', 'info')
  }

  const [isSending, setIsSending] = useState(false)
  const [lastAlertResult, setLastAlertResult] = useState<{ sent: number; failed: number } | null>(null)

  const testSOS = async () => {
    if (contacts.length === 0) {
      showToast('Please add at least one emergency contact', 'error')
      return
    }

    // Validate all contacts
    const invalidContacts = contacts.filter(c => !validateContact(c).valid)
    if (invalidContacts.length > 0) {
      showToast(`Please fix ${invalidContacts.length} invalid contact(s)`, 'error')
      return
    }

    if (!messageTemplate || messageTemplate.trim() === '') {
      showToast('Please set a message template', 'error')
      return
    }

    setIsSending(true)
    try {
      const result = await sendSOSAlert(contacts, messageTemplate)
      setLastAlertResult(result)
      
      if (result.success) {
        showToast(`SOS Alert sent to ${result.sent} contact(s)`, 'success')
      } else {
        showToast('Failed to send some alerts', 'warning')
      }
    } catch (error) {
      showToast('Failed to send SOS alert', 'error')
      console.error('SOS alert error:', error)
    } finally {
      setIsSending(false)
    }
  }

  const updateContact = (id: number, field: keyof EmergencyContact, value: string) => {
    const updated = contacts.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    )
    updateSettings({ emergencyContacts: updated })
    
    // Validate contact on change
    const contact = updated.find(c => c.id === id)
    if (contact) {
      const validation = validateContact(contact)
      if (!validation.valid && value.trim() !== '') {
        // Show validation error in console (could add visual indicators)
        console.warn(`Contact validation: ${validation.errors.join(', ')}`)
      }
    }
  }

  const recentAlerts = [
    { time: '2 hours ago', type: 'Test', status: 'Sent' },
    { time: 'Yesterday', type: 'SOS', status: 'Sent' },
    { time: '3 days ago', type: 'Test', status: 'Sent' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Emergency & Caregiver</h1>
        <p className="text-gray-600 text-lg">Configure emergency contacts and SOS settings for safety</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* SOS Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel p-8 text-center ${
              sosActive 
                ? 'bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200' 
                : 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200'
            }`}
          >
            <motion.div
              animate={{
                scale: sosActive ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: sosActive ? Infinity : 0,
                ease: "easeInOut"
              }}
              className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                sosActive ? 'bg-green-200' : 'bg-red-200'
              }`}
            >
              <AlertCircle size={48} className={sosActive ? 'text-green-600' : 'text-red-600'} />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">SOS Status</h3>
            <p className={`text-lg font-medium mb-2 ${
              sosActive ? 'text-green-700' : 'text-red-700'
            }`}>
              {sosActive ? 'SOS Gesture Active' : 'SOS Gesture Inactive'}
            </p>
            
            {/* Emergency Monitoring Status */}
            <div className={`mb-4 p-3 rounded-lg flex items-center justify-center gap-2 ${
              isEmergencyMonitoringActive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              <Bluetooth size={18} className={isEmergencyMonitoringActive ? 'text-green-600' : 'text-yellow-600'} />
              <span className="text-sm font-medium">
                {isEmergencyMonitoringActive 
                  ? 'Device Connected - Monitoring Active' 
                  : 'Device Not Connected - Click to Connect'}
              </span>
            </div>
            
            {!isEmergencyMonitoringActive && (
              <motion.button
                onClick={handleConnectEmergencyMonitoring}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center justify-center gap-2 mx-auto mb-4"
              >
                <Bluetooth size={18} />
                Connect Device for Emergency Monitoring
              </motion.button>
            )}
            <motion.button
              onClick={testSOS}
              disabled={isSending || contacts.length === 0}
              whileHover={{ scale: isSending ? 1 : 1.05 }}
              whileTap={{ scale: isSending ? 1 : 0.95 }}
              className={`btn-primary flex items-center justify-center gap-3 mx-auto ${
                isSending || contacts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Test SOS Alert
                </>
              )}
            </motion.button>
            {lastAlertResult && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  {lastAlertResult.sent > 0 && (
                    <CheckCircle size={16} className="text-green-600" />
                  )}
                  <span>
                    Sent: {lastAlertResult.sent} | Failed: {lastAlertResult.failed}
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Phone size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Emergency Contacts</h3>
                  <p className="text-sm text-gray-600">{contacts.length} contact(s) configured</p>
                </div>
              </div>
              <motion.button
                onClick={addContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
              >
                <Plus size={24} />
              </motion.button>
            </div>

            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-panel-dark p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                      className="text-lg font-medium bg-transparent border-none outline-none text-gray-800 flex-1"
                      placeholder="Contact Name"
                      aria-label="Contact name"
                    />
                    <motion.button
                      onClick={() => deleteContact(contact.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                      <Phone size={16} className="text-gray-500" />
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm"
                        placeholder="Phone Number"
                        aria-label="Phone number"
                      />
                    </div>
                    <div className="flex-1 flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                      <Mail size={16} className="text-gray-500" />
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-gray-700 text-sm"
                        placeholder="Email Address"
                        aria-label="Email address"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              {contacts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Phone size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No emergency contacts configured</p>
                  <p className="text-sm">Add a contact to enable SOS alerts</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Message Template */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Message Template</h3>
                <p className="text-sm text-gray-600">Customize the emergency message</p>
              </div>
            </div>
            <textarea
              value={messageTemplate}
              onChange={(e) => updateSettings({ messageTemplate: e.target.value })}
              className="w-full h-32 px-4 py-3 rounded-xl bg-white/50 border border-gray-200 outline-none focus:border-primary-400 resize-none"
              placeholder="Emergency message template..."
              aria-label="Emergency message template"
            />
            <p className="text-xs text-gray-500 mt-2">
              This message will be sent to all emergency contacts when SOS is triggered
            </p>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* How SOS Works */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 bg-gradient-to-br from-yellow-50 to-orange-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} className="text-yellow-600" />
              <h4 className="font-semibold text-gray-800">How SOS Works</h4>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold mt-0.5">1.</span>
                <span>Perform the SOS gesture with your Airis-SH device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold mt-0.5">2.</span>
                <span>All emergency contacts will be notified immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold mt-0.5">3.</span>
                <span>Your custom message will be sent via SMS and email</span>
              </li>
            </ul>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity size={24} className="text-primary-500" />
              <h4 className="font-semibold text-gray-800">Recent Alerts</h4>
            </div>
            <div className="space-y-2">
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.type === 'SOS' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm text-gray-700">{alert.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
          >
            <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contacts</span>
                <span className="font-bold text-gray-800">{contacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SOS Status</span>
                <span className={`font-bold ${sosActive ? 'text-green-600' : 'text-red-600'}`}>
                  {sosActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alerts Sent</span>
                <span className="font-bold text-gray-800">{recentAlerts.length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Caregiver
