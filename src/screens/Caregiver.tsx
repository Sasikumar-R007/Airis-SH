import { motion } from 'framer-motion'
import { Plus, Trash2, AlertCircle, Send } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

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

  const testSOS = () => {
    showToast('SOS Alert Sent!', 'warning')
  }

  const updateContact = (id: number, field: keyof EmergencyContact, value: string) => {
    const updated = contacts.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    )
    updateSettings({ emergencyContacts: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Emergency & Caregiver</h1>
        <p className="text-gray-600 text-lg">Configure emergency contacts and SOS settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Emergency Contacts</h3>
              <button onClick={addContact} className="p-2 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors">
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 glass-panel-dark space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                      className="text-lg font-medium bg-transparent border-none outline-none text-gray-800"
                      placeholder="Contact Name"
                      aria-label="Contact name"
                    />
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200 outline-none focus:border-primary-400"
                    placeholder="Phone Number"
                    aria-label="Phone number"
                  />
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200 outline-none focus:border-primary-400"
                    placeholder="Email Address"
                    aria-label="Email address"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Message Template</h3>
            <textarea
              value={messageTemplate}
              onChange={(e) => updateSettings({ messageTemplate: e.target.value })}
              className="w-full h-32 px-4 py-3 rounded-xl bg-white/50 border border-gray-200 outline-none focus:border-primary-400 resize-none"
              placeholder="Emergency message template..."
              aria-label="Emergency message template"
            />
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`glass-panel p-8 text-center ${sosActive ? 'bg-gradient-to-br from-green-50 to-teal-50' : 'bg-gradient-to-br from-red-50 to-orange-50'}`}
          >
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${sosActive ? 'bg-green-200' : 'bg-red-200'}`}>
              <AlertCircle size={48} className={sosActive ? 'text-green-600' : 'text-red-600'} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">SOS Status</h3>
            <p className={`text-lg font-medium ${sosActive ? 'text-green-700' : 'text-red-700'}`}>
              {sosActive ? 'SOS Gesture Active' : 'SOS Gesture Inactive'}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={testSOS}
            className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send size={24} />
            Test SOS Alert
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 bg-gradient-to-br from-yellow-50 to-orange-50"
          >
            <h4 className="font-semibold text-gray-800 mb-3">How SOS Works</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">1.</span>
                <span>Perform the SOS gesture with your Airis-SH device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">2.</span>
                <span>All emergency contacts will be notified immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">3.</span>
                <span>Your custom message will be sent via SMS and email</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Caregiver
