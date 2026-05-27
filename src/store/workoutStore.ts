import { create } from 'zustand'
import { db } from '../db'
import { defaultExercises } from '../data/exercises'
import type { Exercise, Routine, Session, SetRecord } from '../types'

interface WorkoutStore {
  exercises: Exercise[]
  routines: Routine[]
  sessions: Session[]
  activeSession: Session | null

  init: () => Promise<void>
  loadRoutines: () => Promise<void>
  loadSessions: () => Promise<void>

  createRoutine: (data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateRoutine: (id: string, patch: Partial<Omit<Routine, 'id' | 'createdAt'>>) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>

  addExercise: (data: Omit<Exercise, 'id' | 'createdAt'>) => Promise<void>

  startSession: (routine: Routine) => void
  logSet: (exerciseId: string, weight: number, reps: number) => void
  removeSet: (exerciseId: string, setIndex: number) => void
  finishSession: () => Promise<void>
  cancelSession: () => void
}

function uuid() {
  return crypto.randomUUID()
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  exercises: [],
  routines: [],
  sessions: [],
  activeSession: null,

  init: async () => {
    const count = await db.exercises.count()
    if (count === 0) {
      await db.exercises.bulkAdd(defaultExercises)
    }
    const exercises = await db.exercises.toArray()
    set({ exercises })
    await get().loadRoutines()
    await get().loadSessions()
  },

  loadRoutines: async () => {
    const routines = await db.routines.orderBy('updatedAt').reverse().toArray()
    set({ routines })
  },

  loadSessions: async () => {
    const sessions = await db.sessions.orderBy('date').reverse().limit(50).toArray()
    set({ sessions })
  },

  createRoutine: async (data) => {
    const now = Date.now()
    const routine: Routine = { ...data, id: uuid(), createdAt: now, updatedAt: now }
    await db.routines.add(routine)
    await get().loadRoutines()
  },

  updateRoutine: async (id, patch) => {
    await db.routines.update(id, { ...patch, updatedAt: Date.now() })
    await get().loadRoutines()
  },

  deleteRoutine: async (id) => {
    await db.routines.delete(id)
    await get().loadRoutines()
  },

  addExercise: async (data) => {
    const exercise: Exercise = { ...data, id: uuid(), isCustom: true, createdAt: Date.now() }
    await db.exercises.add(exercise)
    const exercises = await db.exercises.toArray()
    set({ exercises })
  },

  startSession: (routine) => {
    const session: Session = {
      id: uuid(),
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString().slice(0, 10),
      startedAt: Date.now(),
      finishedAt: null,
      sets: [],
    }
    set({ activeSession: session })
  },

  logSet: (exerciseId, weight, reps) => {
    const { activeSession } = get()
    if (!activeSession) return
    const existingSets = activeSession.sets.filter(s => s.exerciseId === exerciseId)
    const record: SetRecord = {
      exerciseId,
      setIndex: existingSets.length,
      weight,
      reps,
      completedAt: Date.now(),
    }
    set({ activeSession: { ...activeSession, sets: [...activeSession.sets, record] } })
  },

  removeSet: (exerciseId, setIndex) => {
    const { activeSession } = get()
    if (!activeSession) return
    const filtered = activeSession.sets.filter(
      s => !(s.exerciseId === exerciseId && s.setIndex === setIndex)
    )
    const reindexed = filtered.map(s => {
      if (s.exerciseId === exerciseId && s.setIndex > setIndex) {
        return { ...s, setIndex: s.setIndex - 1 }
      }
      return s
    })
    set({ activeSession: { ...activeSession, sets: reindexed } })
  },

  finishSession: async () => {
    const { activeSession } = get()
    if (!activeSession) return
    const finished = { ...activeSession, finishedAt: Date.now() }
    await db.sessions.add(finished)
    set({ activeSession: null })
    await get().loadSessions()
  },

  cancelSession: () => {
    set({ activeSession: null })
  },
}))
