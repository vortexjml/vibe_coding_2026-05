import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

type Mode = 'stopwatch' | 'countdown'

const COUNTDOWN_PRESETS = [30, 60, 90, 120, 180, 300]

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function WorkoutTimer() {
  const [mode, setMode] = useState<Mode>('stopwatch')

  // ── 스톱워치 ─────────────────────────────────────
  const [swElapsed, setSwElapsed] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (swRunning) {
      swRef.current = setInterval(() => setSwElapsed(e => e + 1), 1000)
    } else {
      if (swRef.current) clearInterval(swRef.current)
    }
    return () => { if (swRef.current) clearInterval(swRef.current) }
  }, [swRunning])

  const resetStopwatch = useCallback(() => {
    setSwRunning(false)
    setSwElapsed(0)
  }, [])

  // ── 카운트다운 ────────────────────────────────────
  const [cdTarget, setCdTarget] = useState(60)
  const [cdRemaining, setCdRemaining] = useState(60)
  const [cdRunning, setCdRunning] = useState(false)
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (cdRunning) {
      cdRef.current = setInterval(() => {
        setCdRemaining(r => {
          if (r <= 1) {
            setCdRunning(false)
            if ('vibrate' in navigator) navigator.vibrate([150, 80, 150, 80, 150])
            return 0
          }
          return r - 1
        })
      }, 1000)
    } else {
      if (cdRef.current) clearInterval(cdRef.current)
    }
    return () => { if (cdRef.current) clearInterval(cdRef.current) }
  }, [cdRunning])

  const selectPreset = (s: number) => {
    setCdTarget(s)
    setCdRemaining(s)
    setCdRunning(false)
  }

  const resetCountdown = useCallback(() => {
    setCdRunning(false)
    setCdRemaining(cdTarget)
  }, [cdTarget])

  // 카운트다운 링 계산
  const r = 52
  const circumference = 2 * Math.PI * r
  const cdPct = cdTarget > 0 ? cdRemaining / cdTarget : 0
  const cdDone = cdRemaining === 0
  const cdColor = cdDone ? '#10B981' : cdRemaining <= 10 ? '#EF4444' : cdRemaining <= 30 ? '#F59E0B' : '#2563EB'

  const switchMode = (m: Mode) => {
    // 모드 전환 시 타이머 멈춤
    setSwRunning(false)
    setCdRunning(false)
    setMode(m)
  }

  return (
    <div className="bg-bg-surface rounded-card border border-border shadow-card overflow-hidden">
      {/* 모드 탭 */}
      <div className="flex border-b border-border">
        {([['stopwatch', '⏱ 스톱워치'], ['countdown', '⏰ 타이머']] as [Mode, string][]).map(([m, label]) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === m
                ? 'text-primary border-b-2 border-primary bg-primary-subtle/50'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {mode === 'stopwatch' ? (
          /* ── 스톱워치 뷰 ── */
          <div className="flex flex-col items-center gap-5">
            {/* 대형 디지털 표시 */}
            <div className="relative flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                <circle
                  cx="80" cy="80" r="70"
                  fill="none"
                  stroke={swRunning ? '#2563EB' : swElapsed > 0 ? '#10B981' : '#E2E8F0'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={2 * Math.PI * 70 * (1 - Math.min(swElapsed / 3600, 1))}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-text-primary tabular-nums tracking-tight">
                  {formatTime(swElapsed)}
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  {swRunning ? '측정 중...' : swElapsed > 0 ? '일시정지' : '시작 대기'}
                </span>
              </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex items-center gap-4">
              <button
                onClick={resetStopwatch}
                disabled={swElapsed === 0 && !swRunning}
                className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:bg-slate-200 disabled:opacity-30 transition-all"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => setSwRunning(r => !r)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-button-primary transition-all active:scale-95 ${
                  swRunning
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : 'bg-gradient-to-br from-primary-light to-primary'
                }`}
              >
                {swRunning ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
              </button>
              <div className="w-12" /> {/* 균형 맞추기 */}
            </div>
          </div>
        ) : (
          /* ── 카운트다운 뷰 ── */
          <div className="flex flex-col items-center gap-4">
            {/* 프리셋 버튼 */}
            <div className="flex gap-2 w-full">
              {COUNTDOWN_PRESETS.map(s => (
                <button
                  key={s}
                  onClick={() => selectPreset(s)}
                  className={`flex-1 h-8 rounded-full text-xs font-semibold transition-colors ${
                    cdTarget === s && !cdDone
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-bg-elevated text-text-secondary hover:bg-slate-200'
                  }`}
                >
                  {s >= 60 ? `${s / 60}m` : `${s}s`}
                </button>
              ))}
            </div>

            {/* 원형 링 + 숫자 */}
            <div className="relative flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                <circle cx="80" cy="80" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
                <circle
                  cx="80" cy="80" r={r}
                  fill="none"
                  stroke={cdColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - cdPct)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {cdDone ? (
                  <span className="text-4xl">✅</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tabular-nums tracking-tight" style={{ color: cdColor }}>
                      {formatTime(cdRemaining)}
                    </span>
                    <span className="text-xs text-text-secondary mt-1">
                      {cdRunning ? '쉬는 중...' : '대기'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex items-center gap-4">
              <button
                onClick={resetCountdown}
                className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:bg-slate-200 transition-all"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={() => setCdRunning(r => !r)}
                disabled={cdDone}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-button-primary transition-all active:scale-95 disabled:opacity-40 ${
                  cdRunning
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : 'bg-gradient-to-br from-primary-light to-primary'
                }`}
              >
                {cdRunning ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
              </button>
              <div className="w-12" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
