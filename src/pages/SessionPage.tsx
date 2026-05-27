import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Button from '../components/Button'
import RestTimer from '../components/RestTimer'
import { Check, Plus, Trash2, X } from 'lucide-react'
import type { RoutineExercise } from '../types'

export default function SessionPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { routines, exercises, activeSession, startSession, logSet, removeSet, finishSession, cancelSession } = useWorkoutStore()

  useEffect(() => {
    const routineId = params.get('routineId')
    if (routineId && !activeSession) {
      const routine = routines.find(r => r.id === routineId)
      if (routine) startSession(routine)
    }
  }, [])

  if (!activeSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-5">
        <p className="text-text-secondary">진행 중인 세션이 없습니다</p>
        <Button variant="secondary" onClick={() => navigate('/')}>홈으로</Button>
      </div>
    )
  }

  const routine = routines.find(r => r.id === activeSession.routineId)
  const totalSets = routine?.exercises.reduce((s, e) => s + e.targetSets, 0) ?? 0
  const doneSets = activeSession.sets.length
  const progress = totalSets > 0 ? Math.min(doneSets / totalSets, 1) : 0

  const handleFinish = async () => {
    if (activeSession.sets.length === 0) {
      if (!confirm('기록된 세트가 없습니다. 운동을 완료하시겠습니까?')) return
    }
    await finishSession()
    navigate('/')
  }

  const handleCancel = () => {
    if (!confirm('운동을 취소하시겠습니까? 기록이 저장되지 않습니다.')) return
    cancelSession()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full bg-bg-base">
      {/* 진행률 바 */}
      <div className="h-1 bg-bg-elevated">
        <div
          className="h-full bg-gradient-to-r from-primary-light to-primary transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-bg-surface border-b border-border">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">{activeSession.routineName}</h1>
          <p className="text-xs text-text-secondary mt-0.5">{doneSets}세트 기록됨</p>
        </div>
        <button onClick={handleCancel} className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary">
          <X size={18} />
        </button>
      </div>

      {/* 종목 목록 */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {routine?.exercises.map(re => (
          <ExerciseCard
            key={re.exerciseId}
            routineExercise={re}
            exerciseName={exercises.find(e => e.id === re.exerciseId)?.name ?? re.exerciseId}
            sets={activeSession.sets.filter(s => s.exerciseId === re.exerciseId)}
            onLog={(w, r) => logSet(re.exerciseId, w, r)}
            onRemove={(idx) => removeSet(re.exerciseId, idx)}
          />
        ))}
      </div>

      <RestTimer />

      <div className="px-5 py-4 bg-bg-surface border-t border-border">
        <Button fullWidth onClick={handleFinish}>운동 완료</Button>
      </div>
    </div>
  )
}

interface ExerciseCardProps {
  routineExercise: RoutineExercise
  exerciseName: string
  sets: { setIndex: number; weight: number; reps: number }[]
  onLog: (weight: number, reps: number) => void
  onRemove: (idx: number) => void
}

function ExerciseCard({ routineExercise, exerciseName, sets, onLog, onRemove }: ExerciseCardProps) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  const handleAdd = () => {
    const w = parseFloat(weight)
    const r = parseInt(reps)
    if (isNaN(w) || isNaN(r) || w < 0 || r <= 0) return
    onLog(w, r)
    setWeight('')
    setReps('')
  }

  return (
    <div className="bg-bg-surface rounded-card border border-border shadow-card overflow-hidden">
      {/* 종목 헤더 */}
      <div className="px-5 pt-4 pb-3">
        <h3 className="font-bold text-text-primary tracking-tight">{exerciseName}</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          목표: {routineExercise.targetSets}세트 × {routineExercise.targetReps}회
        </p>
      </div>

      {/* 완료된 세트 */}
      {sets.length > 0 && (
        <div className="border-t border-border">
          {sets.map(s => (
            <div key={s.setIndex} className="flex items-center px-5 py-3 bg-success-subtle border-b border-border/50 last:border-0">
              <div className="w-7 h-7 rounded-full bg-success/20 flex items-center justify-center mr-3 flex-shrink-0">
                <Check size={14} className="text-success" />
              </div>
              <span className="text-sm text-text-secondary">세트 {s.setIndex + 1}</span>
              <span className="text-sm font-bold text-text-primary ml-auto">
                {s.weight}kg × {s.reps}회
              </span>
              <button onClick={() => onRemove(s.setIndex)} className="ml-3 p-1 text-text-disabled hover:text-danger transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 입력 */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-border bg-bg-elevated/50">
        <input
          type="number"
          inputMode="decimal"
          placeholder={sets.length > 0 ? String(sets[sets.length - 1].weight) : '무게 kg'}
          value={weight}
          onChange={e => setWeight(e.target.value)}
          className="flex-1 h-[58px] bg-bg-surface rounded-xl text-center text-text-primary placeholder:text-text-disabled text-[17px] font-semibold border border-border focus:border-2 focus:border-border-focus focus:outline-none transition-colors"
        />
        <span className="text-text-secondary text-sm font-medium">×</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder={sets.length > 0 ? String(sets[sets.length - 1].reps) : '횟수'}
          value={reps}
          onChange={e => setReps(e.target.value)}
          className="flex-1 h-[58px] bg-bg-surface rounded-xl text-center text-text-primary placeholder:text-text-disabled text-[17px] font-semibold border border-border focus:border-2 focus:border-border-focus focus:outline-none transition-colors"
        />
        <button
          onClick={handleAdd}
          className="w-[58px] h-[58px] bg-gradient-to-br from-primary-light to-primary rounded-xl flex items-center justify-center text-white shadow-button-primary flex-shrink-0 active:scale-95 transition-transform"
        >
          <Plus size={22} />
        </button>
      </div>
    </div>
  )
}
