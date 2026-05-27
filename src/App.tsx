import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useWorkoutStore } from './store/workoutStore'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import SessionPage from './pages/SessionPage'
import RoutinesPage from './pages/RoutinesPage'
import RoutineEditPage from './pages/RoutineEditPage'
import HistoryPage from './pages/HistoryPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const init = useWorkoutStore(s => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="flex flex-col h-full max-w-[430px] mx-auto relative">
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/new" element={<RoutineEditPage />} />
          <Route path="/routines/:id/edit" element={<RoutineEditPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
