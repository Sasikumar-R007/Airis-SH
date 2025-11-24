import { useState } from 'react'
import { motion } from 'framer-motion'
import ToggleSwitch from '../components/ToggleSwitch'
import { Eye, Keyboard, MousePointer, Shield } from 'lucide-react'

interface AccessibilityToolsProps {
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const AccessibilityTools = ({ showToast }: AccessibilityToolsProps) => {
  const [autoKeyboard, setAutoKeyboard] = useState(false)
  const [cursorGlow, setCursorGlow] = useState(true)
  const [slowMode, setSlowMode] = useState(false)
  const [largePointer, setLargePointer] = useState(false)
  const [safeMode, setSafeMode] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Accessibility Tools</h1>
        <p className="text-gray-600 text-lg">Enhanced features for easier interaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ToggleSwitch
              enabled={autoKeyboard}
              onChange={(val) => {
                setAutoKeyboard(val)
                showToast(`Auto On-Screen Keyboard ${val ? 'enabled' : 'disabled'}`, 'info')
              }}
              label="Auto Open On-Screen Keyboard"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ToggleSwitch
              enabled={cursorGlow}
              onChange={(val) => {
                setCursorGlow(val)
                showToast(`Cursor glow ${val ? 'enabled' : 'disabled'}`, 'info')
              }}
              label="Highlight Cursor with Glow Ring"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ToggleSwitch
              enabled={slowMode}
              onChange={(val) => {
                setSlowMode(val)
                showToast(`Slow Mode ${val ? 'enabled' : 'disabled'}`, val ? 'success' : 'info')
              }}
              label="Slow Mode for Unsteady Hands"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ToggleSwitch
              enabled={largePointer}
              onChange={(val) => {
                setLargePointer(val)
                showToast(`Large pointer mode ${val ? 'enabled' : 'disabled'}`, 'info')
              }}
              label="Large Pointer Mode"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ToggleSwitch
              enabled={safeMode}
              onChange={(val) => {
                setSafeMode(val)
                showToast(`Safe Mode ${val ? 'activated - clicks disabled' : 'deactivated'}`, val ? 'warning' : 'info')
              }}
              label="Safe Mode (Disable Clicks)"
            />
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
          >
            <div className="flex items-start gap-3">
              <Keyboard className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">On-Screen Keyboard</h4>
                <p className="text-gray-600 text-sm">
                  Automatically opens the on-screen keyboard when text input is needed.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <div className="flex items-start gap-3">
              <Eye className="text-purple-600 flex-shrink-0" size={32} />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Cursor Visibility</h4>
                <p className="text-gray-600 text-sm">
                  Adds a glowing ring around your cursor for better visibility.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 bg-gradient-to-br from-green-50 to-teal-50"
          >
            <div className="flex items-start gap-3">
              <MousePointer className="text-green-600 flex-shrink-0" size={32} />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Slow Mode</h4>
                <p className="text-gray-600 text-sm">
                  Reduces cursor speed and adds stabilization for users with unsteady hands.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 bg-gradient-to-br from-orange-50 to-red-50"
          >
            <div className="flex items-start gap-3">
              <Shield className="text-red-600 flex-shrink-0" size={32} />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Safe Mode</h4>
                <p className="text-gray-600 text-sm">
                  Temporarily disables all clicks to prevent accidental actions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityTools
