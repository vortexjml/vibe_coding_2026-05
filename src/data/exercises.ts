import type { Exercise } from '../types'

export const defaultExercises: Exercise[] = [
  // 가슴
  { id: 'bench-press', name: '벤치프레스', muscleGroup: 'chest', equipment: 'barbell', isCustom: false, createdAt: 0 },
  { id: 'incline-bench', name: '인클라인 벤치프레스', muscleGroup: 'chest', equipment: 'barbell', isCustom: false, createdAt: 0 },
  { id: 'dumbbell-fly', name: '덤벨 플라이', muscleGroup: 'chest', equipment: 'dumbbell', isCustom: false, createdAt: 0 },
  { id: 'cable-crossover', name: '케이블 크로스오버', muscleGroup: 'chest', equipment: 'cable', isCustom: false, createdAt: 0 },
  { id: 'push-up', name: '푸시업', muscleGroup: 'chest', equipment: 'bodyweight', isCustom: false, createdAt: 0 },
  // 등
  { id: 'deadlift', name: '데드리프트', muscleGroup: 'back', equipment: 'barbell', isCustom: false, createdAt: 0 },
  { id: 'pullup', name: '풀업', muscleGroup: 'back', equipment: 'bodyweight', isCustom: false, createdAt: 0 },
  { id: 'lat-pulldown', name: '랫풀다운', muscleGroup: 'back', equipment: 'cable', isCustom: false, createdAt: 0 },
  { id: 'barbell-row', name: '바벨 로우', muscleGroup: 'back', equipment: 'barbell', isCustom: false, createdAt: 0 },
  { id: 'cable-row', name: '케이블 로우', muscleGroup: 'back', equipment: 'cable', isCustom: false, createdAt: 0 },
  // 하체
  { id: 'squat', name: '스쿼트', muscleGroup: 'legs', equipment: 'barbell', isCustom: false, createdAt: 0 },
  { id: 'leg-press', name: '레그프레스', muscleGroup: 'legs', equipment: 'machine', isCustom: false, createdAt: 0 },
  { id: 'lunge', name: '런지', muscleGroup: 'legs', equipment: 'dumbbell', isCustom: false, createdAt: 0 },
  { id: 'leg-curl', name: '레그컬', muscleGroup: 'legs', equipment: 'machine', isCustom: false, createdAt: 0 },
  { id: 'calf-raise', name: '카프레이즈', muscleGroup: 'legs', equipment: 'machine', isCustom: false, createdAt: 0 },
  // 어깨
  { id: 'ohp', name: '오버헤드 프레스', muscleGroup: 'shoulders', equipment: 'barbell', isCustom: false, createdAt: 0 },
  { id: 'lateral-raise', name: '레터럴 레이즈', muscleGroup: 'shoulders', equipment: 'dumbbell', isCustom: false, createdAt: 0 },
  { id: 'front-raise', name: '프론트 레이즈', muscleGroup: 'shoulders', equipment: 'dumbbell', isCustom: false, createdAt: 0 },
  { id: 'face-pull', name: '페이스 풀', muscleGroup: 'shoulders', equipment: 'cable', isCustom: false, createdAt: 0 },
  // 팔
  { id: 'barbell-curl', name: '바벨 컬', muscleGroup: 'arms', equipment: 'barbell', isCustom: false, createdAt: 0 },
  { id: 'hammer-curl', name: '해머 컬', muscleGroup: 'arms', equipment: 'dumbbell', isCustom: false, createdAt: 0 },
  { id: 'tricep-pushdown', name: '트라이셉 푸시다운', muscleGroup: 'arms', equipment: 'cable', isCustom: false, createdAt: 0 },
  { id: 'skull-crusher', name: '스컬크러셔', muscleGroup: 'arms', equipment: 'barbell', isCustom: false, createdAt: 0 },
  // 코어
  { id: 'plank', name: '플랭크', muscleGroup: 'core', equipment: 'bodyweight', isCustom: false, createdAt: 0 },
  { id: 'crunch', name: '크런치', muscleGroup: 'core', equipment: 'bodyweight', isCustom: false, createdAt: 0 },
  { id: 'leg-raise', name: '레그레이즈', muscleGroup: 'core', equipment: 'bodyweight', isCustom: false, createdAt: 0 },
]

export const muscleGroupLabel: Record<string, string> = {
  chest: '가슴',
  back: '등',
  legs: '하체',
  shoulders: '어깨',
  arms: '팔',
  core: '코어',
}

export const equipmentLabel: Record<string, string> = {
  barbell: '바벨',
  dumbbell: '덤벨',
  machine: '머신',
  bodyweight: '맨몸',
  cable: '케이블',
}
