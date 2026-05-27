import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import Button from '../components/Button'
import { ChevronRight, Plus, Trash2, ListChecks } from 'lucide-react'

export default function RoutinesPage() {
  const { routines, deleteRoutine } = useWorkoutStore()
  const navigate = useNavigate()

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 루틴을 삭제하시겠습니까?`)) return
    await deleteRoutine(id)
  }

  return (
    <div className="px-5 pt-8 pb-28">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-[28px] font-bold tracking-tight text-text-primary">루틴</h1>
        <button
          onClick={() => navigate('/routines/new')}
          className="w-11 h-11 bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center shadow-button-primary active:scale-95 transition-transform"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-card bg-primary-subtle flex items-center justify-center">
            <ListChecks size={28} className="text-primary" />
          </div>
          <p className="text-text-secondary text-sm">아직 루틴이 없어요</p>
          <Button onClick={() => navigate('/routines/new')}>첫 루틴 만들기</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {routines.map(r => (
            <div key={r.id} className="flex items-center bg-bg-surface rounded-card border border-border shadow-card overflow-hidden hover:shadow-card-hover hover:border-primary transition-all">
              <button
                onClick={() => navigate(`/routines/${r.id}/edit`)}
                className="flex-1 flex items-center justify-between p-5 active:bg-bg-elevated transition-colors"
              >
                <div className="text-left">
                  <p className="font-bold text-text-primary tracking-tight">{r.name}</p>
                  <p className="text-xs text-text-secondary mt-1">{r.exercises.length}개 종목</p>
                </div>
                <ChevronRight size={18} className="text-text-secondary" />
              </button>
              <button
                onClick={() => handleDelete(r.id, r.name)}
                className="px-4 self-stretch flex items-center text-text-disabled hover:text-danger border-l border-border transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
