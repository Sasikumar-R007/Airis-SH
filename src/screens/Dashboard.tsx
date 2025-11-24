import { motion } from 'framer-motion'
import { Bluetooth, Battery, Waves, Wifi } from 'lucide-react'
import { AppState } from '../App'

interface DashboardProps {
  appState: AppState
}

const Dashboard = ({ appState }: DashboardProps) => {
  const batteryColor = appState.batteryLevel > 50 ? 'text-green-500' : appState.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
  const batteryGradient = appState.batteryLevel > 50 ? 'from-green-400 to-green-500' : appState.batteryLevel > 20 ? 'from-yellow-400 to-yellow-500' : 'from-red-400 to-red-500'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome to your Airis-SH Control Center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl ${
              appState.connectionStatus === 'connected' ? 'bg-green-100' :
              appState.connectionStatus === 'searching' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Bluetooth size={32} className={
                appState.connectionStatus === 'connected' ? 'text-green-600' :
                appState.connectionStatus === 'searching' ? 'text-yellow-600' :
                'text-red-600'
              } />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Connection Status</h3>
              <p className="text-gray-600">
                {appState.connectionStatus === 'connected' ? 'Connected via Bluetooth' :
                 appState.connectionStatus === 'searching' ? 'Searching for device...' :
                 'Not Connected'}
              </p>
            </div>
          </div>
          {appState.connectionStatus === 'searching' && (
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}
          {appState.isWiredMode && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center gap-2">
              <Wifi size={20} className="text-blue-600" />
              <span className="text-blue-700 font-medium">Wired Mode Active</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${batteryGradient} bg-opacity-20`}>
              <Battery size={32} className={batteryColor} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Battery Level</h3>
              <p className="text-gray-600">Device power status</p>
            </div>
          </div>
          <div className="relative w-48 h-48 mx-auto">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - appState.batteryLevel / 100)}`}
                className={batteryColor}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-5xl font-bold ${batteryColor}`}>{appState.batteryLevel}%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Mode</h3>
          <div className={`p-6 rounded-2xl text-center ${
            appState.currentMode === 'Safe Mode' ? 'bg-gradient-to-br from-red-100 to-red-200' :
            appState.currentMode === 'Comfort Mode' ? 'bg-gradient-to-br from-purple-100 to-pink-200' :
            'bg-gradient-to-br from-blue-100 to-teal-200'
          }`}>
            <p className={`text-3xl font-bold ${
              appState.currentMode === 'Safe Mode' ? 'text-red-700' :
              appState.currentMode === 'Comfort Mode' ? 'text-purple-700' :
              'text-blue-700'
            }`}>
              {appState.currentMode}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100">
              <Waves size={32} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Gesture Status</h3>
              <p className="text-gray-600">Live gesture detection</p>
            </div>
          </div>
          <div className="flex justify-center items-center h-32">
            <motion.div
              animate={{
                scale: appState.gestureActive ? [1, 1.2, 1] : 1,
                opacity: appState.gestureActive ? [1, 0.7, 1] : 0.3
              }}
              transition={{
                duration: 1.5,
                repeat: appState.gestureActive ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 shadow-2xl"
            />
          </div>
          <p className="text-center text-gray-600 mt-4">
            {appState.gestureActive ? 'Gesture Detected' : 'No Active Gesture'}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-8"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-6">LED Status Indicators</h3>
        <div className="flex justify-center gap-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 shadow-lg"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
