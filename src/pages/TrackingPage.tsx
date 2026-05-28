import { useState, useMemo } from 'react'
import { useWorkoutStore } from '../store/workoutStore'
import { Trash2, Plus, Undo2, Droplets, UtensilsCrossed } from 'lucide-react'

const WATER_GOAL = 2000 // ml

export default function TrackingPage() {
  const { mealLogs, waterLogs, addMealLog, deleteMealLog, addWaterLog, removeLastWaterLog } = useWorkoutStore()
  const today = new Date().toISOString().slice(0, 10)

  // ── 물 섭취 ──────────────────────────────────────────
  const totalWater = waterLogs.reduce((sum, w) => sum + w.ml, 0)
  const waterProgress = Math.min(totalWater / WATER_GOAL, 1)
  const circumference = 2 * Math.PI * 44 // r=44

  // ── 식단 ─────────────────────────────────────────────
  const todayMeals = useMemo(
    () => mealLogs.filter(m => m.date === today).sort((a, b) => a.createdAt - b.createdAt),
    [mealLogs, today]
  )
  const totals = useMemo(() => todayMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ), [todayMeals])

  // ── 식단 폼 ───────────────────────────────────────────
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formCalories, setFormCalories] = useState('')
  const [formProtein, setFormProtein] = useState('')
  const [formCarbs, setFormCarbs] = useState('')
  const [formFat, setFormFat] = useState('')
  const [nameError, setNameError] = useState(false)

  const resetForm = () => {
    setFormName(''); setFormCalories(''); setFormProtein('')
    setFormCarbs(''); setFormFat(''); setNameError(false); setShowForm(false)
  }

  const handleAddMeal = async () => {
    if (!formName.trim()) { setNameError(true); return }
    await addMealLog({
      date: today,
      name: formName.trim(),
      calories: Number(formCalories) || 0,
      protein: Number(formProtein) || 0,
      carbs: Number(formCarbs) || 0,
      fat: Number(formFat) || 0,
    })
    resetForm()
  }

  return (
    <div className="px-5 pt-8 pb-28 space-y-6">
      <h1 className="text-[28px] font-bold tracking-tight text-text-primary">기록</h1>

      {/* ── 물 섭취 섹션 ─────────────────────────────── */}
      <div className="bg-bg-surface rounded-card border border-border shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={18} className="text-primary" />
          <h2 className="text-base font-bold text-text-primary">물 섭취</h2>
        </div>

        {/* Task 3.2 — 진행률 원형 + 텍스트 */}
        <div className="flex items-center gap-6 mb-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={totalWater >= WATER_GOAL ? '#10B981' : '#2563EB'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - waterProgress)}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold text-text-primary leading-none">
                {(totalWater / 1000).toFixed(1)}L
              </span>
              <span className="text-[10px] text-text-secondary mt-0.5">
                / {WATER_GOAL / 1000}L
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-text-primary">{totalWater}ml</p>
            <p className="text-sm text-text-secondary mt-0.5">
              {totalWater >= WATER_GOAL
                ? '🎉 오늘 목표 달성!'
                : `${WATER_GOAL - totalWater}ml 더 마시면 목표!`}
            </p>
            <div className="mt-2 h-2 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${waterProgress * 100}%`,
                  backgroundColor: totalWater >= WATER_GOAL ? '#10B981' : '#2563EB',
                }}
              />
            </div>
          </div>
        </div>

        {/* Task 3.3 — 버튼들 */}
        <div className="flex gap-2">
          {[250, 500, 1000].map(ml => (
            <button
              key={ml}
              onClick={() => addWaterLog(ml)}
              className="flex-1 h-11 bg-primary-subtle text-primary-text text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-colors active:scale-95"
            >
              +{ml}ml
            </button>
          ))}
          <button
            onClick={removeLastWaterLog}
            disabled={waterLogs.length === 0}
            className="w-11 h-11 bg-bg-elevated rounded-xl flex items-center justify-center text-text-secondary hover:bg-slate-200 disabled:opacity-40 transition-colors active:scale-95"
            title="되돌리기"
          >
            <Undo2 size={16} />
          </button>
        </div>
      </div>

      {/* ── 식단 섹션 ─────────────────────────────────── */}
      <div className="bg-bg-surface rounded-card border border-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">식단</h2>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-3 h-8 bg-primary-subtle text-primary-text text-xs font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <Plus size={13} /> 추가
            </button>
          )}
        </div>

        {/* Task 3.4 — 합계 카드 */}
        {todayMeals.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: '칼로리', value: totals.calories, unit: 'kcal', color: 'text-primary' },
              { label: '단백질', value: totals.protein, unit: 'g', color: 'text-success' },
              { label: '탄수화물', value: totals.carbs, unit: 'g', color: 'text-amber-500' },
              { label: '지방', value: totals.fat, unit: 'g', color: 'text-red-400' },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="bg-bg-elevated rounded-xl p-2.5 text-center">
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">{unit}</p>
                <p className="text-[10px] text-text-secondary">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Task 3.6 — 인라인 추가 폼 */}
        {showForm && (
          <div className="bg-bg-elevated rounded-xl p-4 mb-4 space-y-3">
            <div>
              <input
                type="text"
                placeholder="음식명 *"
                value={formName}
                onChange={e => { setFormName(e.target.value); setNameError(false) }}
                autoFocus
                className={`w-full h-10 bg-bg-surface rounded-xl px-3 text-sm text-text-primary placeholder:text-text-secondary border focus:outline-none transition-colors ${
                  nameError ? 'border-danger' : 'border-border focus:border-border-focus'
                }`}
              />
              {nameError && <p className="text-xs text-danger mt-1">음식명을 입력해주세요</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { placeholder: '칼로리 (kcal)', value: formCalories, set: setFormCalories },
                { placeholder: '단백질 (g)', value: formProtein, set: setFormProtein },
                { placeholder: '탄수화물 (g)', value: formCarbs, set: setFormCarbs },
                { placeholder: '지방 (g)', value: formFat, set: setFormFat },
              ].map(({ placeholder, value, set }) => (
                <input
                  key={placeholder}
                  type="number"
                  inputMode="decimal"
                  placeholder={placeholder}
                  value={value}
                  onChange={e => set(e.target.value)}
                  className="w-full h-10 bg-bg-surface rounded-xl px-3 text-sm text-text-primary placeholder:text-text-secondary border border-border focus:border-border-focus focus:outline-none"
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMeal}
                className="flex-1 h-10 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity active:scale-95"
              >
                저장
              </button>
              <button
                onClick={resetForm}
                className="flex-1 h-10 bg-bg-surface border border-border text-text-secondary text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Task 3.5 — 기록 목록 */}
        {todayMeals.length > 0 ? (
          <div className="space-y-2">
            {todayMeals.map(meal => (
              <div key={meal.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{meal.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {meal.calories}kcal
                    {meal.protein > 0 && ` · P ${meal.protein}g`}
                    {meal.carbs > 0 && ` · C ${meal.carbs}g`}
                    {meal.fat > 0 && ` · F ${meal.fat}g`}
                  </p>
                </div>
                <button
                  onClick={() => deleteMealLog(meal.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-text-disabled hover:text-danger hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Task 3.7 — 빈 상태 */
          !showForm && (
            <p className="text-sm text-text-secondary text-center py-6">아직 식단 기록이 없어요</p>
          )
        )}
      </div>
    </div>
  )
}
