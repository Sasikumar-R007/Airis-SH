import { useState } from 'react'
import { motion } from 'framer-motion'
import Slider from '../components/Slider'
import { Upload, AlertTriangle, Info, Settings, Cpu, Wifi, Battery, RotateCw, Download } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

interface DeviceSettingsProps {
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const DeviceSettings = ({ showToast }: DeviceSettingsProps) => {
  const { settings, updateSettings } = useSettings()
  const [xSensitivity, setXSensitivity] = useState(settings.xSensitivity)
  const [ySensitivity, setYSensitivity] = useState(settings.ySensitivity)
  const [calibrationStep, setCalibrationStep] = useState(0)
  const [isCalibrating, setIsCalibrating] = useState(false)

  const startCalibration = () => {
    setCalibrationStep(1)
    setIsCalibrating(true)
    showToast('Starting calibration wizard...', 'info')
  }

  const handleCalibrationNext = () => {
    if (calibrationStep < 3) {
      setCalibrationStep(calibrationStep + 1)
      if (calibrationStep === 2) {
        setTimeout(() => {
          setIsCalibrating(false)
          setCalibrationStep(0)
          showToast('Calibration complete!', 'success')
        }, 2000)
      }
    } else {
      setCalibrationStep(0)
    }
  }

  const handleFactoryReset = () => {
    if (confirm('Are you sure you want to reset all settings to factory defaults? This cannot be undone.')) {
      showToast('Factory reset initiated', 'warning')
      // Reset logic would go here
    }
  }

  const handleFirmwareUpload = () => {
    showToast('Firmware upload feature coming soon', 'info')
  }

  const deviceInfo = [
    { label: 'Device Name', value: 'Airis-SH', icon: Settings },
    { label: 'Firmware Version', value: 'v2.1.0', icon: Cpu },
    { label: 'Serial Number', value: 'ASH-2024-1234', icon: Info },
    { label: 'Hardware Rev', value: '2.0', icon: Cpu },
    { label: 'Bluetooth', value: 'BLE 5.0', icon: Wifi },
    { label: 'Battery Status', value: 'Charging', icon: Battery }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Device Settings</h1>
        <p className="text-gray-600 text-lg">Configure and maintain your Airis-SH device</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sensor Calibration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RotateCw size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Sensor Calibration</h3>
                <p className="text-sm text-gray-600">Calibrate MPU6050 for optimal accuracy</p>
              </div>
            </div>
            {calibrationStep === 0 ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Calibrate the MPU6050 sensor for optimal accuracy and responsiveness. 
                  This process takes about 10 seconds.
                </p>
                <motion.button
                  onClick={startCalibration}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <RotateCw size={20} />
                  Start Calibration Wizard
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${
                  calibrationStep === 1 ? 'bg-blue-50' :
                  calibrationStep === 2 ? 'bg-yellow-50' :
                  'bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-800">Step {calibrationStep} of 3</p>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-2 h-2 rounded-full ${
                            step <= calibrationStep ? 'bg-primary-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {calibrationStep === 1 && "Place device on a flat surface and keep it still"}
                    {calibrationStep === 2 && "Calibrating sensors... Please wait"}
                    {calibrationStep === 3 && "Calibration complete! Your device is ready"}
                  </p>
                  {calibrationStep === 2 && (
                    <div className="mt-3 flex justify-center">
                      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleCalibrationNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex-1"
                    disabled={isCalibrating && calibrationStep === 2}
                  >
                    {calibrationStep < 3 ? 'Next' : 'Done'}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setCalibrationStep(0)
                      setIsCalibrating(false)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sensitivity Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Axis Sensitivity</h3>
            <div className="space-y-4">
              <Slider
                label="X-Axis Sensitivity"
                min={1}
                max={10}
                value={xSensitivity}
                onChange={(val) => {
                  setXSensitivity(val)
                  updateSettings({ xSensitivity: val })
                  showToast(`X sensitivity set to ${val}`, 'info')
                }}
                unit=""
              />
              <Slider
                label="Y-Axis Sensitivity"
                min={1}
                max={10}
                value={ySensitivity}
                onChange={(val) => {
                  setYSensitivity(val)
                  updateSettings({ ySensitivity: val })
                  showToast(`Y sensitivity set to ${val}`, 'info')
                }}
                unit=""
              />
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Adjust horizontal (X) and vertical (Y) movement sensitivity independently
                </p>
              </div>
            </div>
          </motion.div>

          {/* Firmware Update */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Upload size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Firmware Update</h3>
                <p className="text-sm text-gray-600">Update device firmware</p>
              </div>
            </div>
            <div className="space-y-3">
              <motion.button
                onClick={handleFirmwareUpload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                Upload Firmware
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Check for Updates
              </motion.button>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-gray-700">
                ⚠️ Ensure device is connected and has sufficient battery before updating
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Device Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-blue-600" size={32} />
              <h3 className="text-xl font-semibold text-gray-800">Device Information</h3>
            </div>
            <div className="space-y-3">
              {deviceInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <info.icon size={16} className="text-gray-500" />
                    <span className="text-gray-600 text-sm">{info.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{info.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 bg-gradient-to-br from-red-50 to-orange-50"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Danger Zone</h3>
                <p className="text-gray-600 text-sm">
                  Resetting to factory defaults will erase all your custom settings and preferences.
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleFactoryReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-red-500 text-white rounded-2xl font-medium shadow-lg hover:bg-red-600 transition-colors"
            >
              Factory Reset
            </motion.button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all text-sm"
              >
                Export Settings
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all text-sm"
              >
                Import Settings
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-primary-400 transition-all text-sm"
              >
                View Logs
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DeviceSettings
