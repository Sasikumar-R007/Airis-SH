import { motion } from 'framer-motion'
import Slider from '../components/Slider'
import ToggleSwitch from '../components/ToggleSwitch'
import { Heart, Info } from 'lucide-react'
import { AppState } from '../App'
import { useSettings } from '../context/SettingsContext'

interface ComfortModeProps {
  appState: AppState
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const ComfortMode = ({ appState, setAppState, showToast }: ComfortModeProps) => {
  const { settings, updateSettings } = useSettings()
  const comfortModeEnabled = appState.currentMode === 'Comfort Mode'

  const handleToggleComfortMode = (enabled: boolean) => {
    setAppState(prev => ({
      ...prev,
      currentMode: enabled ? 'Comfort Mode' : 'Normal'
    }))
    showToast(`Comfort Mode ${enabled ? 'activated' : 'deactivated'}`, enabled ? 'success' : 'info')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Heart className="text-pink-500" size={40} />
          Comfort Mode
        </h1>
        <p className="text-gray-600 text-lg">Calming settings designed for autistic users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ToggleSwitch
              enabled={comfortModeEnabled}
              onChange={handleToggleComfortMode}
              label="Comfort Mode"
            />
          </motion.div>

          {comfortModeEnabled && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Slider
                  label="Anti-Shake Strength"
                  min={1}
                  max={10}
                  value={settings.antiShakeStrength}
                  onChange={(val) => {
                    updateSettings({ antiShakeStrength: val })
                    showToast(`Anti-shake strength set to ${val}`, 'info')
                  }}
                  unit=""
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Slider
                  label="Cursor Smoothing Level"
                  min={1}
                  max={10}
                  value={settings.smoothingLevel}
                  onChange={(val) => {
                    updateSettings({ smoothingLevel: val })
                    showToast(`Smoothing level set to ${val}`, 'info')
                  }}
                  unit=""
                />
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <div className="flex items-start gap-3">
              <Info className="text-purple-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">About Comfort Mode</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Comfort Mode is specially designed for autistic users. It reduces cursor shake, 
                  smooths movements, and provides calming LED animations to create a more 
                  comfortable and less overwhelming experience.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">LED Calming Animation</h3>
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: comfortModeEnabled ? [1, 1.3, 1] : 1,
                    opacity: comfortModeEnabled ? [0.3, 0.8, 0.3] : 0.3
                  }}
                  transition={{
                    duration: 4,
                    repeat: comfortModeEnabled ? Infinity : 0,
                    delay: index * 1.3,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
                  style={{
                    width: `${80 + index * 40}px`,
                    height: `${80 + index * 40}px`
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            {comfortModeEnabled ? 'Calming breathing effect active' : 'Comfort Mode inactive'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ComfortMode
