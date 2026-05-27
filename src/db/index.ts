import Dexie, { type Table } from 'dexie'
import type { Exercise, Routine, Session } from '../types'

class AppDB extends Dexie {
  exercises!: Table<Exercise>
  routines!: Table<Routine>
  sessions!: Table<Session>

  constructor() {
    super('workout-app')
    this.version(1).stores({
      exercises: 'id, muscleGroup, isCustom',
      routines: 'id, updatedAt',
      sessions: 'id, routineId, date',
    })
  }
}

export const db = new AppDB()
