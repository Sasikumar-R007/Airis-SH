import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface GestureSimulatorProps {
  dwellTime: number
  twistSensitivity: number
  smoothingLevel: number
  isConnected?: boolean
}

const GestureSimulator = ({ dwellTime, twistSensitivity: _twistSensitivity, smoothingLevel, isConnected = false }: GestureSimulatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isDwelling, setIsDwelling] = useState(false)
  const [dwellProgress, setDwellProgress] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 400
    canvas.height = 300

    // Simulate cursor movement
    let targetX = canvas.width / 2
    let targetY = canvas.height / 2
    let currentX = targetX
    let currentY = targetY
    let time = 0

    const animate = () => {
      time += 0.02
      
      // Simulate smooth cursor movement
      targetX = canvas.width / 2 + Math.sin(time) * 80 + Math.cos(time * 0.7) * 60
      targetY = canvas.height / 2 + Math.cos(time) * 60 + Math.sin(time * 0.5) * 40

      // Apply smoothing based on smoothingLevel
      const smoothingFactor = smoothingLevel / 10
      currentX += (targetX - currentX) * (0.1 + smoothingFactor * 0.1)
      currentY += (targetY - currentY) * (0.1 + smoothingFactor * 0.1)

      setCursorPos({ x: currentX, y: currentY })

      // Check if cursor is stable (dwell detection)
      const dx = Math.abs(targetX - currentX)
      const dy = Math.abs(targetY - currentY)
      const isStable = dx < 2 && dy < 2

      if (isStable) {
        setIsDwelling(true)
        setDwellProgress(prev => Math.min(prev + (100 / (dwellTime * 60)), 100))
      } else {
        setIsDwelling(false)
        setDwellProgress(0)
      }

      // Clear and redraw
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw cursor trail
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(currentX, currentY, 15, 0, Math.PI * 2)
      ctx.stroke()

      // Draw cursor
      ctx.fillStyle = isDwelling ? '#ef4444' : '#38bdf8'
      ctx.beginPath()
      ctx.arc(currentX, currentY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw dwell indicator
      if (isDwelling) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(currentX, currentY, 20 + (dwellProgress / 100) * 15, 0, Math.PI * 2)
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dwellTime, smoothingLevel, isDwelling, dwellProgress])

  return (
    <div className="relative">
      <div className="glass-panel-dark p-4 rounded-xl">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Cursor Position:</span>
          <span className="font-mono text-gray-800">
            ({Math.round(cursorPos.x)}, {Math.round(cursorPos.y)})
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Dwell Status:</span>
          <span className={`font-medium ${isDwelling ? 'text-red-600' : 'text-gray-400'}`}>
            {isDwelling ? `Active (${Math.round(dwellProgress)}%)` : 'Inactive'}
          </span>
        </div>
        {isDwelling && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dwellProgress}%` }}
              className="bg-red-500 h-2 rounded-full"
            />
          </div>
        )}
        {!isConnected && (
          <div className="mt-2 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-700">
            ⚠️ Simulation mode - Connect device for real-time data
          </div>
        )}
      </div>
    </div>
  )
}

export default GestureSimulator

