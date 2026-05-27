export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  isCustom: boolean
  createdAt: number
}

export interface RoutineExercise {
  exerciseId: string
  targetSets: number
  targetReps: number
  order: number
}

export interface Routine {
  id: string
  name: string
  exercises: RoutineExercise[]
  createdAt: number
  updatedAt: number
}

export interface SetRecord {
  exerciseId: string
  setIndex: number
  weight: number
  reps: number
  completedAt: number
}

export interface Session {
  id: string
  routineId: string
  routineName: string
  date: string
  startedAt: number
  finishedAt: number | null
  sets: SetRecord[]
}
