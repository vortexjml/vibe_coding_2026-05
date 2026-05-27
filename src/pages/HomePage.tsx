import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Button from '../components/Button'
import { Flame, Dumbbell, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const { routines, sessions, activeSession } = useWorkoutStore()
  const navigate = useNavigate()

  const streak = calcStreak(sessions.map(s => s.date))
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter(s => s.date === today)

  if (activeSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-5">
        <div className="w-16 h-16 rounded-card flex items-center justify-center bg-primary-subtle">
          <Dumbbell size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">{activeSession.routineName} 진행 중</h2>
        <Button fullWidth onClick={() => navigate('/session')}>세션으로 돌아가기</Button>
      </div>
    )
  }

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? '좋은 아침이에요 ☀️' : hour < 18 ? '안녕하세요 👋' : '오늘도 수고했어요 🌙'

  return (
    <div className="px-5 pt-8 pb-28 space-y-7">
      {/* 헤더 */}
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-text-primary">{greeting}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </div>

      {/* 스트릭 배너 */}
      {streak > 0 && (
        <div className="flex items-center gap-4 rounded-card p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Flame size={26} className="text-white" />
          </div>
          <div>
            <p className="text-xl font-bold">{streak}일 연속 운동 🔥</p>
            <p className="text-sm text-white/80 mt-0.5">이 기세를 유지해요!</p>
          </div>
        </div>
      )}

      {/* 오늘 완료한 운동 */}
      {todaySessions.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">오늘 완료한 운동</h2>
          {todaySessions.map(s => (
            <div key={s.id} className="bg-bg-surface rounded-card p-4 shadow-card border border-border mb-2">
              <p className="font-semibold text-text-primary">{s.routineName}</p>
              <p className="text-xs text-text-secondary mt-1">{s.sets.length}세트 완료</p>
            </div>
          ))}
        </div>
      )}

      {/* 루틴 선택 */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-3">루틴 선택</h2>
        {routines.length === 0 ? (
          <div className="bg-bg-surface rounded-card p-8 shadow-card border border-border text-center">
            <div className="w-14 h-14 rounded-xl bg-primary-subtle flex items-center justify-center mx-auto mb-4">
              <Dumbbell size={26} className="text-primary" />
            </div>
            <p className="text-text-secondary text-sm mb-4">아직 루틴이 없어요</p>
            <Button variant="secondary" onClick={() => navigate('/routines/new')}>
              루틴 만들기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {routines.map(r => (
              <button
                key={r.id}
                onClick={() => navigate(`/session?routineId=${r.id}`)}
                className="w-full flex items-center justify-between bg-bg-surface rounded-card p-5 shadow-card border border-border hover:border-primary hover:shadow-card-hover active:scale-[0.98] transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold text-text-primary tracking-tight">{r.name}</p>
                  <p className="text-xs text-text-secondary mt-1">{r.exercises.length}개 종목</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary-subtle flex items-center justify-center">
                  <ChevronRight size={18} className="text-primary" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function calcStreak(dates: string[]): number {
  const unique = [...new Set(dates)].sort().reverse()
  if (unique.length === 0) return 0
  const today = new Date().toISOString().slice(0, 10)
  if (unique[0] !== today) return 0
  let streak = 1
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1])
    const curr = new Date(unique[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}
