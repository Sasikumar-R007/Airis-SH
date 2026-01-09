import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bluetooth, Battery, Waves, Wifi, Activity, Zap, Shield, TrendingUp, Clock, Settings } from 'lucide-react'
import { AppState } from '../App'
import { useSettings } from '../context/SettingsContext'

interface DashboardProps {
  appState: AppState
}

const Dashboard = ({ appState }: DashboardProps) => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const batteryColor = appState.batteryLevel > 50 ? 'text-green-500' : appState.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
  const batteryGradient = appState.batteryLevel > 50 ? 'from-green-400 to-green-500' : appState.batteryLevel > 20 ? 'from-yellow-400 to-yellow-500' : 'from-red-400 to-red-500'

  const stats = [
    { label: 'Sessions Today', value: '12', icon: Clock, color: 'text-blue-500' },
    { label: 'Avg Usage', value: '2.5h', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Gestures', value: '1,247', icon: Activity, color: 'text-purple-500' },
    { label: 'Clicks', value: '3,891', icon: Zap, color: 'text-yellow-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's your device overview</p>
        </div>
        <motion.button
          onClick={() => navigate('/device-settings')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-400 to-teal-400 text-white cursor-pointer"
        >
          <Settings size={20} />
          <span className="font-medium">Quick Settings</span>
        </motion.button>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              appState.connectionStatus === 'connected' ? 'bg-green-100' :
              appState.connectionStatus === 'searching' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Bluetooth size={24} className={
                appState.connectionStatus === 'connected' ? 'text-green-600' :
                appState.connectionStatus === 'searching' ? 'text-yellow-600' :
                'text-red-600'
              } />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              appState.connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
              appState.connectionStatus === 'searching' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {appState.connectionStatus === 'connected' ? 'Active' :
               appState.connectionStatus === 'searching' ? 'Connecting' :
               'Offline'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Connection</h3>
          <p className="text-sm text-gray-600 mb-3">
            {appState.connectionStatus === 'connected' ? 'Bluetooth LE Connected' :
             appState.connectionStatus === 'searching' ? 'Searching for device...' :
             'Device not found'}
          </p>
          {appState.connectionStatus === 'searching' && (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}
          {appState.isWiredMode && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center gap-2">
              <Wifi size={16} className="text-blue-600" />
              <span className="text-blue-700 text-xs font-medium">Wired Mode</span>
            </div>
          )}
        </motion.div>

        {/* Battery Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${batteryGradient} bg-opacity-20`}>
              <Battery size={24} className={batteryColor} />
            </div>
            <span className={`text-2xl font-bold ${batteryColor}`}>
              {appState.batteryLevel}%
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Battery</h3>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${appState.batteryLevel}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full bg-gradient-to-r ${batteryGradient}`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {appState.batteryLevel > 80 ? 'Excellent' :
             appState.batteryLevel > 50 ? 'Good' :
             appState.batteryLevel > 20 ? 'Low' : 'Critical'}
          </p>
        </motion.div>

        {/* Current Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${
              appState.currentMode === 'Safe Mode' ? 'bg-red-100' :
              appState.currentMode === 'Comfort Mode' ? 'bg-purple-100' :
              'bg-blue-100'
            }`}>
              <Shield size={24} className={
                appState.currentMode === 'Safe Mode' ? 'text-red-600' :
                appState.currentMode === 'Comfort Mode' ? 'text-purple-600' :
                'text-blue-600'
              } />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Mode</h3>
          <div className={`mt-3 p-3 rounded-xl text-center ${
            appState.currentMode === 'Safe Mode' ? 'bg-gradient-to-br from-red-100 to-red-200' :
            appState.currentMode === 'Comfort Mode' ? 'bg-gradient-to-br from-purple-100 to-pink-200' :
            'bg-gradient-to-br from-blue-100 to-teal-200'
          }`}>
            <p className={`text-xl font-bold ${
              appState.currentMode === 'Safe Mode' ? 'text-red-700' :
              appState.currentMode === 'Comfort Mode' ? 'text-purple-700' :
              'text-blue-700'
            }`}>
              {appState.currentMode}
            </p>
          </div>
        </motion.div>

        {/* Gesture Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-100 to-teal-100">
              <Waves size={24} className="text-primary-600" />
            </div>
            <motion.div
              animate={{
                scale: appState.gestureActive ? [1, 1.2, 1] : 1,
                opacity: appState.gestureActive ? [1, 0.7, 1] : 0.5
              }}
              transition={{
                duration: 1.5,
                repeat: appState.gestureActive ? Infinity : 0,
                ease: "easeInOut"
              }}
              className={`w-3 h-3 rounded-full ${appState.gestureActive ? 'bg-green-500' : 'bg-gray-400'}`}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Gestures</h3>
          <p className="text-sm text-gray-600 mb-3">
            {appState.gestureActive ? 'Active Detection' : 'Standby'}
          </p>
          <div className="flex justify-center">
            <motion.div
              animate={{
                scale: appState.gestureActive ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`w-16 h-16 rounded-full ${
                appState.gestureActive 
                  ? 'bg-gradient-to-br from-primary-400 to-teal-400 shadow-lg' 
                  : 'bg-gray-200'
              }`}
            />
          </div>
        </motion.div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="glass-panel p-5 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Status Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-panel p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={24} className="text-primary-500" />
            Device Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Zap size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Sensitivity</p>
                  <p className="text-sm text-gray-600">X: {settings.xSensitivity}/10 • Y: {settings.ySensitivity}/10</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{((settings.xSensitivity + settings.ySensitivity) / 2).toFixed(1)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Clock size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Dwell Time</p>
                  <p className="text-sm text-gray-600">Left click activation delay</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">{settings.dwellTime}s</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Waves size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Smoothing</p>
                  <p className="text-sm text-gray-600">Cursor movement stabilization</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{settings.smoothingLevel}/10</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button
              onClick={() => navigate('/device-settings')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-primary-400 to-teal-400 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Calibrate Device
            </motion.button>
            <motion.button
              onClick={() => navigate('/gesture-settings')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all"
            >
              Test Gestures
            </motion.button>
            <motion.button
              onClick={() => navigate('/air-mouse')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all"
            >
              Air Mouse System
            </motion.button>
            <motion.button
              onClick={() => {
                const dataStr = JSON.stringify(settings, null, 2)
                const dataBlob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `airis-sh-settings-${new Date().toISOString().split('T')[0]}.json`
                link.click()
                URL.revokeObjectURL(url)
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all"
            >
              Export Data
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* LED Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Zap size={24} className="text-yellow-500" />
            LED Status Indicators
          </h3>
          <div className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
            Hardware Integration Required
          </div>
        </div>
        <div className="flex justify-center gap-8 mb-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 20px rgba(56, 189, 248, 0.3)',
                  '0 0 40px rgba(56, 189, 248, 0.6)',
                  '0 0 20px rgba(56, 189, 248, 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 shadow-xl"
            />
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-700 mb-2">
            <strong>LED Status Indicators Purpose:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1 ml-4">
            <li>• <strong>Connection Status:</strong> Visual feedback for BLE connection state</li>
            <li>• <strong>Gesture Detection:</strong> Indicates when gestures are being recognized</li>
            <li>• <strong>Mode Indicators:</strong> Shows current mode (Normal/Comfort/Safe)</li>
            <li>• <strong>Battery Status:</strong> Low battery warnings (when hardware added)</li>
            <li>• <strong>Calibration:</strong> Visual feedback during calibration process</li>
          </ul>
          <p className="text-xs text-gray-600 mt-3">
            <strong>Hardware Integration:</strong> Connect LEDs to ESP32 GPIO pins and control via BLE commands. 
            See SOFTWARE_ANALYSIS.md for implementation details.
          </p>
        </div>
        <p className="text-center text-gray-600 mt-4 text-sm">
          Device status lights • {appState.connectionStatus === 'connected' ? 'All systems operational' : 'Waiting for connection'}
        </p>
      </motion.div>
    </div>
  )
}

export default Dashboard
