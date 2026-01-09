import { useState } from 'react'
import { motion } from 'framer-motion'
import ToggleSwitch from '../components/ToggleSwitch'
import { Eye, Keyboard, MousePointer, Shield, ZoomIn, Maximize2, Volume2, Bell } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

interface AccessibilityToolsProps {
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const AccessibilityTools = ({ showToast }: AccessibilityToolsProps) => {
  const { settings, updateSettings } = useSettings()
  const [autoKeyboard, setAutoKeyboard] = useState(settings.autoKeyboard)
  const [cursorGlow, setCursorGlow] = useState(settings.cursorGlow)
  const [slowMode, setSlowMode] = useState(settings.slowMode)
  const [largePointer, setLargePointer] = useState(settings.largePointer)
  const [safeMode, setSafeMode] = useState(settings.safeMode)

  const accessibilityFeatures = [
    {
      title: 'Auto On-Screen Keyboard',
      description: 'Automatically opens the on-screen keyboard when text input is needed',
      icon: Keyboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      enabled: autoKeyboard,
      onChange: (val: boolean) => {
        setAutoKeyboard(val)
        updateSettings({ autoKeyboard: val })
        showToast(`Auto On-Screen Keyboard ${val ? 'enabled' : 'disabled'}`, 'info')
      }
    },
    {
      title: 'Cursor Glow Ring',
      description: 'Adds a glowing ring around your cursor for better visibility',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      enabled: cursorGlow,
      onChange: (val: boolean) => {
        setCursorGlow(val)
        updateSettings({ cursorGlow: val })
        showToast(`Cursor glow ${val ? 'enabled' : 'disabled'}`, 'info')
      }
    },
    {
      title: 'Slow Mode',
      description: 'Reduces cursor speed and adds stabilization for users with unsteady hands',
      icon: MousePointer,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      enabled: slowMode,
      onChange: (val: boolean) => {
        setSlowMode(val)
        updateSettings({ slowMode: val })
        showToast(`Slow Mode ${val ? 'enabled' : 'disabled'}`, val ? 'success' : 'info')
      }
    },
    {
      title: 'Large Pointer Mode',
      description: 'Increases cursor size for easier tracking and visibility',
      icon: ZoomIn,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      enabled: largePointer,
      onChange: (val: boolean) => {
        setLargePointer(val)
        updateSettings({ largePointer: val })
        showToast(`Large pointer mode ${val ? 'enabled' : 'disabled'}`, 'info')
      }
    },
    {
      title: 'Safe Mode',
      description: 'Temporarily disables all clicks to prevent accidental actions',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      enabled: safeMode,
      onChange: (val: boolean) => {
        setSafeMode(val)
        updateSettings({ safeMode: val })
        showToast(`Safe Mode ${val ? 'activated - clicks disabled' : 'deactivated'}`, val ? 'warning' : 'info')
      }
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Accessibility Tools</h1>
        <p className="text-gray-600 text-lg">Enhanced features for easier interaction and better usability</p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accessibilityFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-panel p-6 ${feature.bgColor}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-white rounded-xl">
                  <feature.icon size={24} className={feature.color} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={feature.enabled}
                onChange={feature.onChange}
                label=""
              />
            </div>
            {feature.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 bg-white/50 rounded-lg"
              >
                <p className="text-xs text-gray-700">
                  ✓ {feature.title} is currently active
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Additional Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Maximize2 size={24} className="text-primary-500" />
            Visual Enhancements
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Volume2 size={20} className="text-blue-600" />
                <span className="font-semibold text-gray-800">High Contrast Mode</span>
              </div>
              <p className="text-sm text-gray-600">Enhance visual contrast for better visibility</p>
              <ToggleSwitch
                enabled={false}
                onChange={() => {}}
                label="Enable High Contrast"
              />
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Bell size={20} className="text-purple-600" />
                <span className="font-semibold text-gray-800">Audio Feedback</span>
              </div>
              <p className="text-sm text-gray-600">Play sounds for clicks and actions</p>
              <ToggleSwitch
                enabled={false}
                onChange={() => {}}
                label="Enable Audio Feedback"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield size={24} className="text-green-500" />
            Safety Features
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-2">Safe Mode Status</h4>
              <div className={`p-3 rounded-lg ${safeMode ? 'bg-red-100' : 'bg-green-100'}`}>
                <p className={`text-sm font-medium ${safeMode ? 'text-red-700' : 'text-green-700'}`}>
                  {safeMode 
                    ? '⚠️ Safe Mode Active - All clicks are disabled'
                    : '✓ Safe Mode Inactive - Normal operation'}
                </p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all text-sm"
                >
                  Test All Features
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all text-sm"
                >
                  Reset to Defaults
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Accessibility Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Active Features</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {accessibilityFeatures.filter(f => f.enabled).map(feature => (
                <li key={feature.title} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {feature.title}
                </li>
              ))}
              {accessibilityFeatures.filter(f => f.enabled).length === 0 && (
                <li className="text-gray-500">No features currently active</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Tips</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Combine multiple features for best experience</li>
              <li>• Safe Mode is useful during setup or learning</li>
              <li>• Large Pointer works well with Cursor Glow</li>
              <li>• Slow Mode helps with precision tasks</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AccessibilityTools
