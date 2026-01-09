import { motion } from 'framer-motion'
import Slider from '../components/Slider'
import ToggleSwitch from '../components/ToggleSwitch'
import { Heart, Info, Sparkles, Shield, Zap, Moon, Sun } from 'lucide-react'
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
    updateSettings({ comfortMode: enabled })
    showToast(`Comfort Mode ${enabled ? 'activated' : 'deactivated'}`, enabled ? 'success' : 'info')
  }

  const comfortFeatures = [
    {
      title: 'Reduced Sensitivity',
      description: 'Lower cursor movement speed for easier control',
      icon: Zap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Enhanced Smoothing',
      description: 'Advanced filtering to minimize shake and jitter',
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Calming Animations',
      description: 'Gentle LED patterns to reduce sensory overload',
      icon: Moon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Safe Interactions',
      description: 'Prevents accidental clicks and rapid movements',
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Heart className="text-pink-500" size={40} />
            Comfort Mode
          </h1>
          <p className="text-gray-600 text-lg">Calming settings designed for autistic users and sensory sensitivity</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-2xl cursor-pointer transition-all ${
            comfortModeEnabled
              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => handleToggleComfortMode(!comfortModeEnabled)}
        >
          <div className="flex items-center gap-2">
            {comfortModeEnabled ? <Sun size={24} /> : <Moon size={24} />}
            <span className="font-semibold text-lg">
              {comfortModeEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${comfortModeEnabled ? 'bg-pink-100' : 'bg-gray-100'}`}>
              <Heart size={32} className={comfortModeEnabled ? 'text-pink-600' : 'text-gray-400'} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Comfort Mode</h3>
              <p className="text-gray-600">
                {comfortModeEnabled 
                  ? 'Currently active - All comfort features are enabled'
                  : 'Enable to activate all comfort features'}
              </p>
            </div>
          </div>
          <ToggleSwitch
            enabled={comfortModeEnabled}
            onChange={handleToggleComfortMode}
            label=""
          />
        </div>
      </motion.div>

      {comfortModeEnabled && (
        <>
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comfortFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`glass-panel p-5 ${feature.bgColor}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl">
                    <feature.icon size={24} className={feature.color} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Settings Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Anti-Shake</h3>
                    <p className="text-sm text-gray-600">Movement stabilization</p>
                  </div>
                </div>
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
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Higher values provide more stabilization but may feel less responsive
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Cursor Smoothing</h3>
                    <p className="text-sm text-gray-600">Movement fluidity</p>
                  </div>
                </div>
                <Slider
                  label="Smoothing Level"
                  min={1}
                  max={10}
                  value={settings.smoothingLevel}
                  onChange={(val) => {
                    updateSettings({ smoothingLevel: val })
                    showToast(`Smoothing level set to ${val}`, 'info')
                  }}
                  unit=""
                />
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Smoothes cursor movement for more natural feel
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-panel p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="text-purple-600 flex-shrink-0 mt-1" size={32} />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">About Comfort Mode</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Comfort Mode is specially designed for autistic users and individuals with sensory sensitivities. 
                      It reduces cursor shake, smooths movements, and provides calming LED animations to create a more 
                      comfortable and less overwhelming experience.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Reduced visual stimulation</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Gentle movement patterns</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Prevents accidental actions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LED Animation Preview */}
              <div className="glass-panel p-8">
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
              </div>

              {/* Current Settings Summary */}
              <div className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50">
                <h4 className="font-semibold text-gray-800 mb-3">Current Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Anti-Shake:</span>
                    <span className="font-bold text-gray-800">{settings.antiShakeStrength}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Smoothing:</span>
                    <span className="font-bold text-gray-800">{settings.smoothingLevel}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-bold text-purple-700">Comfort Active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {!comfortModeEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-12 text-center"
        >
          <Heart size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Comfort Mode is Inactive</h3>
          <p className="text-gray-600 mb-6">
            Enable Comfort Mode to access all calming features and settings
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggleComfortMode(true)}
            className="btn-primary px-8 py-3"
          >
            Activate Comfort Mode
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default ComfortMode
