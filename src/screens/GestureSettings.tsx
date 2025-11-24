import { useState } from 'react'
import { motion } from 'framer-motion'
import Slider from '../components/Slider'
import ToggleSwitch from '../components/ToggleSwitch'
import { RotateCcw } from 'lucide-react'

interface GestureSettingsProps {
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const GestureSettings = ({ showToast }: GestureSettingsProps) => {
  const [dwellTime, setDwellTime] = useState(2)
  const [twistSensitivity, setTwistSensitivity] = useState(5)
  const [sosEnabled, setSosEnabled] = useState(true)
  const [autoCenterEnabled, setAutoCenterEnabled] = useState(true)
  const [volumeTwistEnabled, setVolumeTwistEnabled] = useState(false)

  const handleReset = () => {
    setDwellTime(2)
    setTwistSensitivity(5)
    setSosEnabled(true)
    setAutoCenterEnabled(true)
    setVolumeTwistEnabled(false)
    showToast('Settings reset to defaults', 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Gesture Settings</h1>
        <p className="text-gray-600 text-lg">Customize how you interact with Airis-SH</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Slider
              label="Left Click Dwell Time"
              min={1}
              max={3}
              value={dwellTime}
              onChange={(val) => {
                setDwellTime(val)
                showToast(`Dwell time set to ${val}s`, 'info')
              }}
              unit="s"
              step={0.5}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Slider
              label="Right Click Twist Sensitivity"
              min={1}
              max={10}
              value={twistSensitivity}
              onChange={(val) => {
                setTwistSensitivity(val)
                showToast(`Twist sensitivity set to ${val}`, 'info')
              }}
              unit=""
              step={1}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ToggleSwitch
              enabled={sosEnabled}
              onChange={(val) => {
                setSosEnabled(val)
                showToast(`SOS Gesture ${val ? 'enabled' : 'disabled'}`, val ? 'success' : 'warning')
              }}
              label="Enable SOS Gesture"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ToggleSwitch
              enabled={autoCenterEnabled}
              onChange={(val) => {
                setAutoCenterEnabled(val)
                showToast(`Auto-Center ${val ? 'enabled' : 'disabled'}`, 'info')
              }}
              label="Enable Auto-Center Gesture"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ToggleSwitch
              enabled={volumeTwistEnabled}
              onChange={(val) => {
                setVolumeTwistEnabled(val)
                showToast(`Volume Twist ${val ? 'enabled' : 'disabled'}`, 'info')
              }}
              label="Enable Volume Twist Gesture"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleReset}
            className="btn-secondary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw size={20} />
            Reset to Defaults
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8 h-fit"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Live Preview</h3>
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-32 h-40 rounded-3xl bg-gradient-to-br from-primary-400 to-teal-400 shadow-2xl" />
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg"
              />
            </motion.div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Gesture detection active
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default GestureSettings
