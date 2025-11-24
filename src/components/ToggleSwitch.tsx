import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
}

const ToggleSwitch = ({ enabled, onChange, label }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between p-4 glass-panel-dark">
      <span className="text-lg font-medium text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`toggle-switch ${enabled ? 'bg-gradient-to-r from-primary-400 to-teal-400' : 'bg-gray-300'}`}
      >
        <motion.div
          className="w-6 h-6 bg-white rounded-full shadow-md absolute top-1"
          animate={{ left: enabled ? '28px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

export default ToggleSwitch
