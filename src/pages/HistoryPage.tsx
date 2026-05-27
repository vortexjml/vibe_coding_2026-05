import { useState } from 'react'
import { useWorkoutStore } from '../store/workoutStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Session } from '../types'

export default function HistoryPage() {
  const { sessions } = useWorkoutStore()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [selected, setSelected] = useState<string | null>(null)

  const sessionDates = new Set(sessions.map(s => s.date))

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null
    const d = i - firstDay + 1
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  })

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
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
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : isToday
                    ? 'bg-primary-subtle text-primary font-bold'
                    : hasSession
                    ? 'text-text-primary hover:bg-bg-elevated'
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

      {/* 선택된 날짜 세션 */}
      {selected && selectedSessions.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">{selected} 운동 기록</h2>
          {selectedSessions.map(s => <SessionDetail key={s.id} session={s} />)}
        </div>
      )}
      {selected && selectedSessions.length === 0 && (
        <p className="text-center text-text-secondary text-sm py-10">이 날은 운동 기록이 없어요</p>
      )}

      {/* 최근 운동 */}
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
          return (
            <div key={exId} className="flex justify-between text-sm">
              <span className="text-text-secondary">{exId}</span>
              <span className="text-text-primary font-semibold">{exSets.length}세트 · 최대 {maxWeight}kg</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
