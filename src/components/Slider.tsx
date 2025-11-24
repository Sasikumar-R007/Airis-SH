import { useState } from 'react'

interface SliderProps {
  label: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  unit?: string
  step?: number
}

const Slider = ({ label, min, max, value, onChange, unit = '', step = 1 }: SliderProps) => {
  return (
    <div className="p-4 glass-panel-dark space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-gray-700">{label}</span>
        <span className="text-xl font-bold text-primary-500">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #38bdf8 0%, #2dd4bf ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

export default Slider
