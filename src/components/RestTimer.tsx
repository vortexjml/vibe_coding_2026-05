import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const PRESETS = [60, 90, 120, 180]

export default function RestTimer() {
  const [target, setTarget] = useState(90)
  const [remaining, setRemaining] = useState(90)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      setRunning(false)
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100])
      return
    }
    const id = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(id)
  }, [running, remaining])

  const reset = useCallback(() => {
    setRunning(false)
    setRemaining(target)
  }, [target])

  const selectPreset = (s: number) => {
    setTarget(s)
    setRemaining(s)
    setRunning(false)
  }

  const pct = Math.max(0, remaining / target)
  const color = remaining <= 10 ? '#EF4444' : remaining <= 30 ? '#F59E0B' : '#2563EB'

  return (
    <div className="bg-bg-surface border-t border-border px-4 py-3 shadow-modal">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#F1F5F9" strokeWidth="4" />
            <circle
              cx="24" cy="24" r="20" fill="none"
              stroke={color} strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">
            {remaining}
          </span>
        </div>

        <div className="flex gap-2 flex-1">
          {PRESETS.map(s => (
            <button
              key={s}
              onClick={() => selectPreset(s)}
              className={`flex-1 h-8 rounded-full text-xs font-medium transition-colors ${
                target === s
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-bg-elevated text-text-secondary hover:bg-slate-200'
              }`}
            >
              {s}s
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:bg-slate-200"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => setRunning(r => !r)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white shadow-button-primary"
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
