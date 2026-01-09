import { motion } from 'framer-motion'
import Slider from '../components/Slider'
import ToggleSwitch from '../components/ToggleSwitch'
import GestureSimulator from '../components/GestureSimulator'
import { RotateCcw, Hand, MousePointerClick, RotateCw, Volume2, Navigation, AlertCircle, Info } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

interface GestureSettingsProps {
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const GestureSettings = ({ showToast }: GestureSettingsProps) => {
  const { settings, updateSettings, resetSettings } = useSettings()

  const handleReset = () => {
    resetSettings()
    showToast('Settings reset to defaults', 'success')
  }

  const gesturePresets = [
    { name: 'Precise', dwellTime: 1.5, twistSensitivity: 3, smoothing: 8 },
    { name: 'Balanced', dwellTime: 2.0, twistSensitivity: 5, smoothing: 7 },
    { name: 'Comfort', dwellTime: 2.5, twistSensitivity: 7, smoothing: 6 }
  ]

  const applyPreset = (preset: typeof gesturePresets[0]) => {
    updateSettings({
      dwellTime: preset.dwellTime,
      twistSensitivity: preset.twistSensitivity,
      smoothingLevel: preset.smoothing
    })
    showToast(`${preset.name} preset applied`, 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gesture Settings</h1>
          <p className="text-gray-600 text-lg">Customize how you interact with Airis-SH</p>
        </div>
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw size={20} />
          Reset to Defaults
        </motion.button>
      </div>

      {/* Presets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info size={24} className="text-primary-500" />
          Quick Presets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gesturePresets.map((preset) => (
            <motion.button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-primary-400 transition-all text-left"
            >
              <h4 className="font-semibold text-gray-800 mb-2">{preset.name}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Dwell: {preset.dwellTime}s</p>
                <p>Twist: {preset.twistSensitivity}/10</p>
                <p>Smoothing: {preset.smoothing}/10</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Left Click Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MousePointerClick size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Left Click</h3>
                <p className="text-sm text-gray-600">Dwell time configuration</p>
              </div>
            </div>
            <Slider
              label="Dwell Time"
              min={1}
              max={3}
              value={settings.dwellTime}
              onChange={(val) => {
                updateSettings({ dwellTime: val })
                showToast(`Dwell time set to ${val}s`, 'info')
              }}
              unit="s"
              step={0.1}
            />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Hold cursor steady for <span className="font-bold">{settings.dwellTime}s</span> to trigger left click
              </p>
            </div>
          </motion.div>

          {/* Right Click Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RotateCw size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Right Click</h3>
                <p className="text-sm text-gray-600">Wrist twist sensitivity</p>
              </div>
            </div>
            <Slider
              label="Twist Sensitivity"
              min={1}
              max={10}
              value={settings.twistSensitivity}
              onChange={(val) => {
                updateSettings({ twistSensitivity: val })
                showToast(`Twist sensitivity set to ${val}`, 'info')
              }}
              unit=""
              step={1}
            />
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Higher values require less wrist movement to trigger right click
              </p>
            </div>
          </motion.div>

          {/* Advanced Gestures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Hand size={24} className="text-primary-500" />
              Advanced Gestures
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-600" />
                  <div>
                    <p className="font-semibold text-gray-800">SOS Gesture</p>
                    <p className="text-xs text-gray-600">Emergency alert trigger</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.sosEnabled}
                  onChange={(val) => {
                    updateSettings({ sosEnabled: val })
                    showToast(`SOS Gesture ${val ? 'enabled' : 'disabled'}`, val ? 'success' : 'warning')
                  }}
                  label=""
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Navigation size={20} className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Auto-Center</p>
                    <p className="text-xs text-gray-600">Automatic cursor centering</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.autoCenterEnabled}
                  onChange={(val) => {
                    updateSettings({ autoCenterEnabled: val })
                    showToast(`Auto-Center ${val ? 'enabled' : 'disabled'}`, 'info')
                  }}
                  label=""
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Volume2 size={20} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Volume Twist</p>
                    <p className="text-xs text-gray-600">Control system volume</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.volumeTwistEnabled}
                  onChange={(val) => {
                    updateSettings({ volumeTwistEnabled: val })
                    showToast(`Volume Twist ${val ? 'enabled' : 'disabled'}`, 'info')
                  }}
                  label=""
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real-Time Simulation Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 h-fit"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Info size={20} className="text-primary-500" />
            Real-Time Simulation
          </h3>
          <GestureSimulator
            dwellTime={settings.dwellTime}
            twistSensitivity={settings.twistSensitivity}
            smoothingLevel={settings.smoothingLevel}
            isConnected={false}
          />
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-gradient-to-r from-primary-50 to-teal-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-800 mb-2">Current Configuration</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Dwell Time: <span className="font-bold text-gray-800">{settings.dwellTime}s</span></p>
                <p>Twist Sensitivity: <span className="font-bold text-gray-800">{settings.twistSensitivity}/10</span></p>
                <p>Smoothing: <span className="font-bold text-gray-800">{settings.smoothingLevel}/10</span></p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-gray-600">
                💡 <strong>Note:</strong> This simulation shows how your settings affect cursor behavior. Connect your Airis-SH device for real-time tracking.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GestureSettings
