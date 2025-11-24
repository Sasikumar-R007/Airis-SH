import { useState } from 'react'
import { motion } from 'framer-motion'
import Slider from '../components/Slider'
import { Upload, AlertTriangle, Info } from 'lucide-react'

interface DeviceSettingsProps {
  showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
}

const DeviceSettings = ({ showToast }: DeviceSettingsProps) => {
  const [xSensitivity, setXSensitivity] = useState(5)
  const [ySensitivity, setYSensitivity] = useState(5)
  const [calibrationStep, setCalibrationStep] = useState(0)

  const startCalibration = () => {
    setCalibrationStep(1)
    showToast('Starting calibration wizard...', 'info')
  }

  const handleFactoryReset = () => {
    if (confirm('Are you sure you want to reset all settings to factory defaults? This cannot be undone.')) {
      showToast('Factory reset initiated', 'warning')
    }
  }

  const handleFirmwareUpload = () => {
    showToast('Firmware upload feature coming soon', 'info')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Device Settings</h1>
        <p className="text-gray-600 text-lg">Configure and maintain your Airis-SH device</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sensor Calibration</h3>
            {calibrationStep === 0 ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Calibrate the MPU6050 sensor for optimal accuracy and responsiveness.
                </p>
                <button onClick={startCalibration} className="btn-primary w-full">
                  Start Calibration Wizard
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-800 font-medium">Step {calibrationStep} of 3</p>
                  <p className="text-blue-600 text-sm mt-1">
                    {calibrationStep === 1 && "Place device on a flat surface"}
                    {calibrationStep === 2 && "Keep device steady for 5 seconds"}
                    {calibrationStep === 3 && "Calibration complete!"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (calibrationStep < 3) {
                        setCalibrationStep(calibrationStep + 1)
                        if (calibrationStep === 2) {
                          showToast('Calibration complete!', 'success')
                        }
                      } else {
                        setCalibrationStep(0)
                      }
                    }}
                    className="btn-primary flex-1"
                  >
                    {calibrationStep < 3 ? 'Next' : 'Done'}
                  </button>
                  <button
                    onClick={() => setCalibrationStep(0)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Slider
              label="X-Axis Sensitivity"
              min={1}
              max={10}
              value={xSensitivity}
              onChange={(val) => {
                setXSensitivity(val)
                showToast(`X sensitivity set to ${val}`, 'info')
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
              label="Y-Axis Sensitivity"
              min={1}
              max={10}
              value={ySensitivity}
              onChange={(val) => {
                setYSensitivity(val)
                showToast(`Y sensitivity set to ${val}`, 'info')
              }}
              unit=""
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Firmware Update</h3>
            <button onClick={handleFirmwareUpload} className="btn-secondary w-full flex items-center justify-center gap-2">
              <Upload size={20} />
              Upload Firmware
            </button>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
          >
            <div className="flex items-start gap-3 mb-4">
              <Info className="text-blue-600 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Device Information</h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Device Name</span>
                <span className="font-semibold text-gray-800">Airis-SH</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Firmware Version</span>
                <span className="font-semibold text-gray-800">v2.1.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Serial Number</span>
                <span className="font-semibold text-gray-800">ASH-2024-1234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                <span className="text-gray-600">Hardware Rev</span>
                <span className="font-semibold text-gray-800">2.0</span>
              </div>
            </div>
          </motion.div>

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
            <button onClick={handleFactoryReset} className="w-full px-6 py-3 bg-red-500 text-white rounded-2xl font-medium shadow-lg hover:bg-red-600 transition-colors">
              Factory Reset
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DeviceSettings
