import { motion } from 'framer-motion'
import { CheckCircle, Info, AlertCircle, XCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const Toast = ({ message, type }: ToastProps) => {
  const icons = {
    info: <Info size={20} />,
    success: <CheckCircle size={20} />,
    warning: <AlertCircle size={20} />,
    error: <XCircle size={20} />
  }

  const colors = {
    info: 'from-blue-400 to-blue-500',
    success: 'from-green-400 to-green-500',
    warning: 'from-yellow-400 to-yellow-500',
    error: 'from-red-400 to-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`glass-panel flex items-center gap-3 px-6 py-4 min-w-[300px] bg-gradient-to-r ${colors[type]} text-white`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
    </motion.div>
  )
}

export default Toast
