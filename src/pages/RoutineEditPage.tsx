import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import { muscleGroupLabel, equipmentLabel } from '../data/exercises'
import Button from '../components/Button'
import { Plus, Trash2, ChevronLeft, Search, X } from 'lucide-react'
import type { RoutineExercise, MuscleGroup } from '../types'

export default function RoutineEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { routines, exercises, createRoutine, updateRoutine } = useWorkoutStore()

  const existing = routines.find(r => r.id === id)
  const [name, setName] = useState(existing?.name ?? '')
  const [selected, setSelected] = useState<RoutineExercise[]>(existing?.exercises ?? [])
  const [showPicker, setShowPicker] = useState(false)
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState<MuscleGroup | 'all'>('all')

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setSelected(existing.exercises)
    }
  }, [existing?.id])

  const filtered = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchGroup = filterGroup === 'all' || e.muscleGroup === filterGroup
    return matchSearch && matchGroup
  })

  const addExercise = (exerciseId: string) => {
    if (selected.some(s => s.exerciseId === exerciseId)) return
    setSelected(prev => [...prev, { exerciseId, targetSets: 3, targetReps: 10, order: prev.length }])
  }

  const removeExercise = (exerciseId: string) => {
    setSelected(prev => prev.filter(s => s.exerciseId !== exerciseId).map((s, i) => ({ ...s, order: i })))
  }

  const updateTarget = (exerciseId: string, field: 'targetSets' | 'targetReps', value: number) => {
    setSelected(prev => prev.map(s => s.exerciseId === exerciseId ? { ...s, [field]: value } : s))
  }

  const handleSave = async () => {
    if (!name.trim()) { alert('루틴 이름을 입력해주세요'); return }
    if (selected.length === 0) { alert('종목을 하나 이상 추가해주세요'); return }
    if (existing) {
      await updateRoutine(existing.id, { name, exercises: selected })
    } else {
      await createRoutine({ name, exercises: selected })
    }
    navigate('/routines')
  }

  const muscleGroups: Array<{ value: MuscleGroup | 'all'; label: string }> = [
    { value: 'all', label: '전체' },
    { value: 'chest', label: '가슴' },
    { value: 'back', label: '등' },
    { value: 'legs', label: '하체' },
    { value: 'shoulders', label: '어깨' },
    { value: 'arms', label: '팔' },
    { value: 'core', label: '코어' },
  ]

  return (
    <div className="flex flex-col h-full bg-bg-base">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3 bg-bg-surface border-b border-border">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-text-primary flex-1">
          {existing ? '루틴 편집' : '새 루틴'}
        </h1>
        <Button onClick={handleSave}>저장</Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 space-y-4">
        {/* 루틴 이름 */}
        <input
          type="text"
          placeholder="루틴 이름"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full h-[54px] bg-bg-surface rounded-xl px-4 text-text-primary placeholder:text-text-disabled border border-border focus:border-2 focus:border-border-focus focus:outline-none shadow-card font-semibold"
        />

        {/* 선택된 종목 */}
        <div className="space-y-3">
          {selected.map(s => {
            const ex = exercises.find(e => e.id === s.exerciseId)
            return (
              <div key={s.exerciseId} className="bg-bg-surface rounded-card border border-border shadow-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-text-primary">{ex?.name}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary-subtle text-primary-text text-xs font-medium">
                      {ex ? muscleGroupLabel[ex.muscleGroup] : ''}
                    </span>
                  </div>
                  <button onClick={() => removeExercise(s.exerciseId)} className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-disabled hover:text-danger transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-text-secondary font-medium">목표 세트</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={s.targetSets}
                      onChange={e => updateTarget(s.exerciseId, 'targetSets', parseInt(e.target.value) || 1)}
                      className="w-full h-11 bg-bg-elevated rounded-xl text-center text-text-primary font-semibold border border-border focus:border-border-focus focus:outline-none mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-text-secondary font-medium">목표 횟수</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={s.targetReps}
                      onChange={e => updateTarget(s.exerciseId, 'targetReps', parseInt(e.target.value) || 1)}
                      className="w-full h-11 bg-bg-elevated rounded-xl text-center text-text-primary font-semibold border border-border focus:border-border-focus focus:outline-none mt-1"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 종목 추가 버튼 */}
        <button
          onClick={() => setShowPicker(true)}
          className="w-full h-[54px] border-2 border-dashed border-border rounded-card flex items-center justify-center gap-2 text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-subtle transition-all"
        >
          <Plus size={18} />
          <span className="font-medium text-sm">종목 추가</span>
        </button>
      </div>

      {/* 종목 선택 바텀시트 */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowPicker(false)}>
          <div
            className="w-full max-w-[430px] mx-auto bg-bg-surface rounded-t-[28px] max-h-[82vh] flex flex-col shadow-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-text-primary text-lg">종목 선택</h2>
                <button
                  onClick={() => setShowPicker(false)}
                  className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="종목 검색"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-11 bg-bg-elevated rounded-xl pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary border border-border focus:border-border-focus focus:outline-none"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {muscleGroups.map(g => (
                  <button
                    key={g.value}
                    onClick={() => setFilterGroup(g.value)}
                    className={`flex-shrink-0 px-3.5 h-8 rounded-full text-xs font-semibold transition-colors ${
                      filterGroup === g.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-bg-elevated text-text-secondary hover:bg-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.map(e => {
                const isAdded = selected.some(s => s.exerciseId === e.id)
                return (
                  <button
                    key={e.id}
                    onClick={() => { addExercise(e.id); setShowPicker(false) }}
                    disabled={isAdded}
                    className="w-full flex items-center justify-between px-5 py-3.5 border-b border-border last:border-0 hover:bg-bg-elevated disabled:opacity-40 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-semibold text-text-primary">{e.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{muscleGroupLabel[e.muscleGroup]} · {equipmentLabel[e.equipment]}</p>
                    </div>
                    {isAdded
                      ? <span className="text-xs font-semibold text-success bg-success-subtle px-2.5 py-1 rounded-full">추가됨</span>
                      : <Plus size={16} className="text-text-secondary" />
                    }
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
