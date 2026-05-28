import Dexie, { type Table } from 'dexie'
import type { Exercise, Routine, Session, MealLog, WaterLog } from '../types'

class AppDB extends Dexie {
  exercises!: Table<Exercise>
  routines!: Table<Routine>
  sessions!: Table<Session>
  mealLogs!: Table<MealLog>
  waterLogs!: Table<WaterLog>

  constructor() {
    super('workout-app')
    this.version(1).stores({
      exercises: 'id, muscleGroup, isCustom',
      routines: 'id, updatedAt',
      sessions: 'id, routineId, date',
    })
    this.version(2).stores({
      exercises: 'id, muscleGroup, isCustom',
      routines: 'id, updatedAt',
      sessions: 'id, routineId, date',
      mealLogs: 'id, date',
      waterLogs: 'id, date',
    })
  }
}

export const db = new AppDB()
