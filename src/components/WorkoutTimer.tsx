import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

type Mode = 'stopwatch' | 'countdown'

const COUNTDOWN_PRESETS = [30, 60, 90, 120, 180, 300]

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// 얇은 원형 진행 링 (텍스트와 분리)
function ProgressRing({
  pct, color, size = 80, stroke = 6,
}: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        className="transition-all duration-1000"
      />
    </svg>
  )
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

  const resetStopwatch = useCallback(() => { setSwRunning(false); setSwElapsed(0) }, [])

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

  const selectPreset = (s: number) => { setCdTarget(s); setCdRemaining(s); setCdRunning(false) }
  const resetCountdown = useCallback(() => { setCdRunning(false); setCdRemaining(cdTarget) }, [cdTarget])

  const cdPct = cdTarget > 0 ? cdRemaining / cdTarget : 0
  const cdDone = cdRemaining === 0
  const cdColor = cdDone ? '#10B981' : cdRemaining <= 10 ? '#EF4444' : cdRemaining <= 30 ? '#F59E0B' : '#2563EB'
  const swColor = swRunning ? '#2563EB' : swElapsed > 0 ? '#10B981' : '#CBD5E1'
  const swPct = Math.min(swElapsed / 3600, 1) // 1시간 기준

  const switchMode = (m: Mode) => { setSwRunning(false); setCdRunning(false); setMode(m) }

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
          <div className="flex items-center gap-5">
            {/* 왼쪽: 링 */}
            <ProgressRing pct={swPct} color={swColor} size={88} stroke={7} />

            {/* 오른쪽: 시간 + 상태 + 버튼 */}
            <div className="flex-1">
              <p className="text-[42px] font-bold text-text-primary tabular-nums tracking-tight leading-none">
                {formatTime(swElapsed)}
              </p>
              <p className="text-xs text-text-secondary mt-1.5">
                {swRunning ? '⏱ 측정 중...' : swElapsed > 0 ? '⏸ 일시정지' : '시작 버튼을 눌러주세요'}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={resetStopwatch}
                  disabled={swElapsed === 0 && !swRunning}
                  className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:bg-slate-200 disabled:opacity-30 transition-all"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setSwRunning(r => !r)}
                  className={`flex-1 h-10 rounded-full flex items-center justify-center gap-2 text-white text-sm font-bold shadow-button-primary transition-all active:scale-95 ${
                    swRunning
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-primary-light to-primary'
                  }`}
                >
                  {swRunning ? <><Pause size={15} /> 일시정지</> : <><Play size={15} className="ml-0.5" /> 시작</>}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── 카운트다운 뷰 ── */
          <div className="flex items-center gap-5">
            {/* 왼쪽: 링 */}
            <div className="relative flex-shrink-0">
              <ProgressRing pct={cdPct} color={cdColor} size={88} stroke={7} />
              {/* 링 안에 작은 퍼센트 표시 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold" style={{ color: cdColor }}>
                  {cdDone ? '✓' : `${Math.round(cdPct * 100)}%`}
                </span>
              </div>
            </div>

            {/* 오른쪽: 시간 + 프리셋 + 버튼 */}
            <div className="flex-1 min-w-0">
              {cdDone ? (
                <p className="text-[42px] leading-none">✅</p>
              ) : (
                <p className="text-[42px] font-bold tabular-nums tracking-tight leading-none" style={{ color: cdColor }}>
                  {formatTime(cdRemaining)}
                </p>
              )}
              {/* 프리셋 */}
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                {COUNTDOWN_PRESETS.map(s => (
                  <button
                    key={s}
                    onClick={() => selectPreset(s)}
                    className={`px-2.5 h-7 rounded-full text-xs font-semibold transition-colors ${
                      cdTarget === s && !cdDone
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-bg-elevated text-text-secondary hover:bg-slate-200'
                    }`}
                  >
                    {s >= 60 ? `${s / 60}m` : `${s}s`}
                  </button>
                ))}
              </div>
              {/* 컨트롤 */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={resetCountdown}
                  className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:bg-slate-200 transition-all"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setCdRunning(r => !r)}
                  disabled={cdDone}
                  className={`flex-1 h-10 rounded-full flex items-center justify-center gap-2 text-white text-sm font-bold shadow-button-primary transition-all active:scale-95 disabled:opacity-40 ${
                    cdRunning
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-primary-light to-primary'
                  }`}
                >
                  {cdRunning ? <><Pause size={15} /> 일시정지</> : <><Play size={15} className="ml-0.5" /> 시작</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
