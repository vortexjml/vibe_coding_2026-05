import { create } from 'zustand'
import { db } from '../db'
import { defaultExercises } from '../data/exercises'
import type { Exercise, Routine, Session, SetRecord, MealLog, WaterLog } from '../types'

interface WorkoutStore {
  exercises: Exercise[]
  routines: Routine[]
  sessions: Session[]
  activeSession: Session | null
  mealLogs: MealLog[]
  waterLogs: WaterLog[]

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

  addMealLog: (data: Omit<MealLog, 'id' | 'createdAt'>) => Promise<void>
  deleteMealLog: (id: string) => Promise<void>
  addWaterLog: (ml: number) => Promise<void>
  removeLastWaterLog: () => Promise<void>
}

function uuid() {
  return crypto.randomUUID()
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  exercises: [],
  routines: [],
  sessions: [],
  activeSession: null,
  mealLogs: [],
  waterLogs: [],

  init: async () => {
    const count = await db.exercises.count()
    if (count === 0) {
      await db.exercises.bulkAdd(defaultExercises)
    }
    const exercises = await db.exercises.toArray()
    set({ exercises })
    await get().loadRoutines()
    await get().loadSessions()
    // Task 2.4 — 식단/수분 로드
    const today = new Date().toISOString().slice(0, 10)
    const mealLogs = await db.mealLogs.where('date').equals(today).toArray()
    const waterLogs = await db.waterLogs.where('date').equals(today).toArray()
    set({ mealLogs, waterLogs })
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

  // Task 2.2 — 식단 액션
  addMealLog: async (data) => {
    const log: MealLog = { ...data, id: uuid(), createdAt: Date.now() }
    await db.mealLogs.add(log)
    const mealLogs = await db.mealLogs.where('date').equals(data.date).toArray()
    set({ mealLogs })
  },

  deleteMealLog: async (id) => {
    const log = get().mealLogs.find(m => m.id === id)
    await db.mealLogs.delete(id)
    const date = log?.date ?? new Date().toISOString().slice(0, 10)
    const mealLogs = await db.mealLogs.where('date').equals(date).toArray()
    set({ mealLogs })
  },

  // Task 2.3 — 수분 액션
  addWaterLog: async (ml) => {
    const date = new Date().toISOString().slice(0, 10)
    const log: WaterLog = { id: uuid(), date, ml, createdAt: Date.now() }
    await db.waterLogs.add(log)
    const waterLogs = await db.waterLogs.where('date').equals(date).toArray()
    set({ waterLogs })
  },

  removeLastWaterLog: async () => {
    const { waterLogs } = get()
    if (waterLogs.length === 0) return
    const last = waterLogs.reduce((a, b) => a.createdAt > b.createdAt ? a : b)
    await db.waterLogs.delete(last.id)
    const date = last.date
    const updated = await db.waterLogs.where('date').equals(date).toArray()
    set({ waterLogs: updated })
  },
}))
