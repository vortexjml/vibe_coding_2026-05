import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Button from '../components/Button'
import { Dumbbell, Droplets, Flame, UtensilsCrossed, Play } from 'lucide-react'

export default function HomePage() {
  const { routines, sessions, activeSession, waterLogs, mealLogs } = useWorkoutStore()
  const navigate = useNavigate()

  const streak = calcStreak(sessions.map(s => s.date))
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter(s => s.date === today)

  const now = new Date()
  const hour = now.getHours()
  const dayIndex = now.getDay()

  const morningLines   = ['아침부터\n이기는 하루', '기상 완료\n이제 운동할 시간', '일어났으면\n반은 성공이에요', '오늘도\n강해지는 중', '새벽을 이긴 사람이\n하루를 이겨요', '몸은 거짓말 안 해요\n지금 시작해요', '오늘의 땀이\n내일의 근육이 돼요']
  const afternoonLines = ['지금 이 순간을\n놓치지 마세요', '한 세트가\n인생을 바꿉니다', '몸이 변하는 건\n오늘부터예요', '핑계 말고\n바벨 잡아요', '지금 움직이면\n저녁이 뿌듯해요', '누군가는 지금\n이 시간에 운동해요', '후회는 나중에\n운동은 지금']
  const eveningLines   = ['오늘 운동\n내일의 나를 위해', '하루의 마무리는\n땀으로', '자기 전 마지막\n챕터, 운동', '오늘 한 번 더 한 사람이\n내일 다르게 살아요', '밤에 운동하는\n사람은 진심인 거예요', '오늘도 강해졌나요?\n지금 확인해요', '피곤해도 10분만\n그게 습관이 돼요']
  const emojis = ['💪', '🔥', '⚡', '💥', '🌟', '🎯', '🏆']

  const greetingText =
    hour < 12 ? morningLines[dayIndex % morningLines.length]
    : hour < 18 ? afternoonLines[dayIndex % afternoonLines.length]
    : eveningLines[dayIndex % eveningLines.length]
  const emoji = emojis[dayIndex % emojis.length]

  // 오늘 요약 데이터
  const totalWater = waterLogs.reduce((s, w) => s + w.ml, 0)
  const totalCalories = mealLogs.filter(m => m.date === today).reduce((s, m) => s + m.calories, 0)

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

  return (
    <div className="pb-28">

      {/* ── 히어로 배너 ──────────────────────────── */}
      <div
        className="px-6 pt-16 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #1E3A8A 0%, #2563EB 55%, #7C3AED 100%)' }}
      >
        {/* 배경 장식 원 */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

        <p className="text-white/60 text-sm font-medium mb-3">
          {now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
        <div className="flex items-end justify-between">
          <h1 className="text-[26px] font-bold text-white leading-tight whitespace-pre-line">
            {greetingText}
          </h1>
          <span className="text-5xl ml-4 flex-shrink-0">{emoji}</span>
        </div>

        {/* 스트릭 인라인 배지 */}
        {streak > 0 && (
          <div className="mt-5 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
            <Flame size={15} className="text-amber-300" />
            <span className="text-white text-sm font-semibold">{streak}일 연속 운동 중!</span>
          </div>
        )}
      </div>

      <div className="px-5 pt-5 space-y-6">

        {/* ── 오늘 요약 ─────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-bg-surface rounded-2xl border border-border shadow-card p-3.5 text-center">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-2">
              <Flame size={16} className="text-amber-500" />
            </div>
            <p className="text-xl font-bold text-text-primary leading-none">{streak}</p>
            <p className="text-[11px] text-text-secondary mt-1">일 연속</p>
          </div>
          <button
            onClick={() => navigate('/tracking')}
            className="bg-bg-surface rounded-2xl border border-border shadow-card p-3.5 text-center hover:border-primary hover:shadow-card-hover transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <Droplets size={16} className="text-primary" />
            </div>
            <p className="text-xl font-bold text-text-primary leading-none">
              {totalWater >= 1000 ? `${(totalWater / 1000).toFixed(1)}L` : `${totalWater}ml`}
            </p>
            <p className="text-[11px] text-text-secondary mt-1">물 섭취</p>
          </button>
          <button
            onClick={() => navigate('/tracking')}
            className="bg-bg-surface rounded-2xl border border-border shadow-card p-3.5 text-center hover:border-primary hover:shadow-card-hover transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
              <UtensilsCrossed size={16} className="text-success" />
            </div>
            <p className="text-xl font-bold text-text-primary leading-none">{totalCalories}</p>
            <p className="text-[11px] text-text-secondary mt-1">kcal</p>
          </button>
        </div>

        {/* ── 오늘 완료한 운동 ──────────────────── */}
        {todaySessions.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">오늘 완료</h2>
            {todaySessions.map(s => (
              <div key={s.id} className="flex items-center gap-3 bg-success-subtle rounded-2xl border border-green-100 p-4 mb-2">
                <div className="w-9 h-9 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={16} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text-primary truncate">{s.routineName}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{s.sets.length}세트 완료 ✓</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── 루틴 선택 ─────────────────────────── */}
        <div>
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wide mb-3">루틴 선택</h2>
          {routines.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-4">
                <Dumbbell size={24} className="text-primary" />
              </div>
              <p className="text-text-secondary text-sm mb-4">아직 루틴이 없어요<br/>첫 루틴을 만들어볼까요?</p>
              <Button variant="secondary" onClick={() => navigate('/routines/new')}>
                루틴 만들기
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {routines.map((r, idx) => {
                const gradients = [
                  'from-blue-500 to-indigo-600',
                  'from-violet-500 to-purple-600',
                  'from-emerald-500 to-teal-600',
                  'from-orange-500 to-red-500',
                ]
                const grad = gradients[idx % gradients.length]
                return (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/session?routineId=${r.id}`)}
                    className="w-full flex items-center gap-4 bg-bg-surface rounded-2xl p-4 shadow-card border border-border hover:border-primary hover:shadow-card-hover active:scale-[0.98] transition-all"
                  >
                    {/* 컬러 아이콘 */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Dumbbell size={20} className="text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-bold text-text-primary tracking-tight truncate">{r.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{r.exercises.length}개 종목</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-button-primary">
                        <Play size={14} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

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
