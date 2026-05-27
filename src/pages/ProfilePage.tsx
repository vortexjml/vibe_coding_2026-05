import { useWorkoutStore } from '../store/workoutStore'
import { Flame, Dumbbell, BarChart2, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'

export default function ProfilePage() {
  const { sessions } = useWorkoutStore()

  const totalSessions = sessions.length
  const totalSets = sessions.reduce((sum, s) => sum + s.sets.length, 0)
  const totalVolume = sessions.reduce((sum, s) => sum + s.sets.reduce((v, set) => v + set.weight * set.reps, 0), 0)
  const streak = calcStreak(sessions.map(s => s.date))

  return (
    <div className="px-5 pt-8 pb-28">
      <h1 className="text-[28px] font-bold tracking-tight text-text-primary mb-7">프로필</h1>

      {/* streak 카드 (강조) */}
      {streak > 0 && (
        <div
          className="rounded-card p-5 mb-5 text-white"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Flame size={28} className="text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold">{streak}일</p>
              <p className="text-sm text-white/80 mt-0.5">연속 운동 중 🔥</p>
            </div>
          </div>
        </div>
      )}

      {/* 통계 그리드 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={<Dumbbell size={20} className="text-primary" />}
          label="총 운동 횟수"
          value={`${totalSessions}회`}
          bg="bg-primary-subtle"
        />
        <StatCard
          icon={<BarChart2 size={20} className="text-success" />}
          label="총 세트 수"
          value={`${totalSets}세트`}
          bg="bg-success-subtle"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-primary" />}
          label="총 볼륨"
          value={`${(totalVolume / 1000).toFixed(1)}t`}
          bg="bg-primary-subtle"
        />
        <StatCard
          icon={<Flame size={20} className="text-warning" />}
          label="연속 운동일"
          value={`${streak}일`}
          bg="bg-orange-50"
        />
      </div>

      {totalSessions === 0 && (
        <div className="text-center py-14">
          <div className="w-16 h-16 rounded-card bg-primary-subtle flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={28} className="text-primary" />
          </div>
          <p className="text-text-secondary text-sm">아직 운동 기록이 없어요</p>
          <p className="text-text-secondary text-sm mt-1">첫 운동을 시작해보세요!</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, bg }: { icon: ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className="bg-bg-surface rounded-card border border-border shadow-card p-4">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-text-secondary font-medium">{label}</p>
      <p className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{value}</p>
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
    const diff = (new Date(unique[i - 1]).getTime() - new Date(unique[i]).getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}
