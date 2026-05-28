import { useState, useMemo, useEffect } from 'react'
import { useWorkoutStore } from '../store/workoutStore'
import { ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react'
import type { Session } from '../types'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function HistoryPage() {
  const { sessions, exercises } = useWorkoutStore()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('')

  // Task 1.1 — 기록이 있는 종목만 추출
  const exercisesWithRecords = useMemo(() => {
    const ids = new Set<string>()
    sessions.forEach(s => s.sets.forEach(set => ids.add(set.exerciseId)))
    return [...ids].map(id => ({
      id,
      name: exercises.find(e => e.id === id)?.name ?? id,
    }))
  }, [sessions, exercises])

  useEffect(() => {
    if (!selectedExerciseId && exercisesWithRecords.length > 0) {
      setSelectedExerciseId(exercisesWithRecords[0].id)
    }
  }, [exercisesWithRecords, selectedExerciseId])

  // Task 1.2 — 날짜별 최고무게
  const maxWeightData = useMemo(() => {
    if (!selectedExerciseId) return []
    const byDate: Record<string, number> = {}
    sessions.forEach(s => {
      const sets = s.sets.filter(set => set.exerciseId === selectedExerciseId)
      if (sets.length === 0) return
      const max = Math.max(...sets.map(set => set.weight))
      byDate[s.date] = Math.max(byDate[s.date] ?? 0, max)
    })
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-20)
      .map(([date, maxWeight]) => ({ date: date.slice(5), maxWeight }))
  }, [sessions, selectedExerciseId])

  // Task 1.3 — 날짜별 총볼륨
  const volumeData = useMemo(() => {
    if (!selectedExerciseId) return []
    const byDate: Record<string, number> = {}
    sessions.forEach(s => {
      const sets = s.sets.filter(set => set.exerciseId === selectedExerciseId)
      if (sets.length === 0) return
      const vol = sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
      byDate[s.date] = (byDate[s.date] ?? 0) + vol
    })
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-20)
      .map(([date, totalVolume]) => ({ date: date.slice(5), totalVolume }))
  }, [sessions, selectedExerciseId])

  const sessionDates = new Set(sessions.map(s => s.date))
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null
    const d = i - firstDay + 1
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  })

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
  }

  const dayLabels = ['일', '월', '화', '수', '목', '금', '토']
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const selectedSessions = selected ? sessions.filter(s => s.date === selected) : []

  return (
    <div className="px-5 pt-8 pb-28">
      <h1 className="text-[28px] font-bold tracking-tight text-text-primary mb-6">히스토리</h1>

      {/* 캘린더 */}
      <div className="bg-bg-surface rounded-card border border-border shadow-card p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:bg-slate-200 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-text-primary">{year}년 {monthNames[month]}</span>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary hover:bg-slate-200 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map(d => (
            <div key={d} className="text-center text-xs font-medium text-text-secondary py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />
            const day = parseInt(date.slice(8))
            const hasSession = sessionDates.has(date)
            const isSelected = selected === date
            const isToday = date === new Date().toISOString().slice(0, 10)
            return (
              <button
                key={date}
                onClick={() => setSelected(isSelected ? null : date)}
                className={`aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all relative ${
                  isSelected ? 'bg-primary text-white shadow-sm'
                  : isToday ? 'bg-primary-subtle text-primary font-bold'
                  : hasSession ? 'text-text-primary hover:bg-bg-elevated'
                  : 'text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                {day}
                {hasSession && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Task 2.1~2.4 — 진행 차트 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={18} className="text-primary" />
          <h2 className="text-base font-bold text-text-primary">종목별 진행 추이</h2>
        </div>

        {exercisesWithRecords.length === 0 ? (
          // Task 2.4 — 빈 상태
          <div className="bg-bg-surface rounded-card border border-border shadow-card p-8 text-center">
            <p className="text-text-secondary text-sm">아직 운동 기록이 없어요</p>
            <p className="text-text-secondary text-xs mt-1">운동을 완료하면 여기서 추이를 확인할 수 있어요</p>
          </div>
        ) : (
          <div className="bg-bg-surface rounded-card border border-border shadow-card p-5 space-y-6">
            {/* Task 2.1 — 종목 선택 드롭다운 */}
            <select
              value={selectedExerciseId}
              onChange={e => setSelectedExerciseId(e.target.value)}
              className="w-full h-11 bg-bg-elevated rounded-xl px-3 text-sm font-medium text-text-primary border border-border focus:border-border-focus focus:outline-none"
            >
              {exercisesWithRecords.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>

            {/* Task 2.2 — 최고무게 LineChart */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">최고 무게 (kg)</p>
              {maxWeightData.length === 0 ? (
                <p className="text-xs text-text-secondary text-center py-4">데이터가 없습니다</p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={maxWeightData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => [`${v}kg`, '최고무게']}
                    />
                    <Line
                      type="monotone"
                      dataKey="maxWeight"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      dot={{ fill: '#2563EB', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Task 2.3 — 총볼륨 BarChart */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">총 볼륨 (kg)</p>
              {volumeData.length === 0 ? (
                <p className="text-xs text-text-secondary text-center py-4">데이터가 없습니다</p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={volumeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => [`${v.toLocaleString()}kg`, '총볼륨']}
                    />
                    <Bar dataKey="totalVolume" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 날짜별 세션 */}
      {selected && selectedSessions.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">{selected} 운동 기록</h2>
          {selectedSessions.map(s => <SessionDetail key={s.id} session={s} />)}
        </div>
      )}
      {selected && selectedSessions.length === 0 && (
        <p className="text-center text-text-secondary text-sm py-10">이 날은 운동 기록이 없어요</p>
      )}
      {!selected && (
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">최근 운동</h2>
          {sessions.slice(0, 10).map(s => <SessionDetail key={s.id} session={s} />)}
          {sessions.length === 0 && (
            <p className="text-center text-text-secondary text-sm py-10">아직 운동 기록이 없어요</p>
          )}
        </div>
      )}
    </div>
  )
}

function SessionDetail({ session }: { session: Session }) {
  const { exercises } = useWorkoutStore()
  const duration = session.finishedAt
    ? Math.round((session.finishedAt - session.startedAt) / 60000)
    : null
  const totalVolume = session.sets.reduce((sum, s) => sum + s.weight * s.reps, 0)
  const exerciseIds = [...new Set(session.sets.map(s => s.exerciseId))]

  return (
    <div className="bg-bg-surface rounded-card border border-border shadow-card p-5 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-text-primary tracking-tight">{session.routineName}</p>
          <p className="text-xs text-text-secondary mt-0.5">{session.date}</p>
        </div>
        <div className="text-right">
          {duration !== null && (
            <span className="inline-block px-2.5 py-1 rounded-full bg-primary-subtle text-primary-text text-xs font-semibold">{duration}분</span>
          )}
          <p className="text-xs text-text-secondary mt-1">{totalVolume.toLocaleString()}kg 볼륨</p>
        </div>
      </div>
      <div className="space-y-1.5 border-t border-border pt-3">
        {exerciseIds.map(exId => {
          const exSets = session.sets.filter(s => s.exerciseId === exId)
          const maxWeight = Math.max(...exSets.map(s => s.weight))
          const name = exercises.find(e => e.id === exId)?.name ?? exId
          return (
            <div key={exId} className="flex justify-between text-sm">
              <span className="text-text-secondary">{name}</span>
              <span className="text-text-primary font-semibold">{exSets.length}세트 · 최대 {maxWeight}kg</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
