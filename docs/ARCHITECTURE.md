# Architecture — 운동 루틴 기록 앱

## Overview

완전 클라이언트 사이드 앱. 서버 없음, 모든 데이터는 브라우저 IndexedDB에 저장.
네트워크 없이도 완전히 동작하는 오프라인 우선(offline-first) 아키텍처.

```
┌─────────────────────────────────────────┐
│              Browser                    │
│                                         │
│  ┌──────────┐    ┌────────────────────┐ │
│  │  React   │◄──►│  Zustand Store     │ │
│  │  UI      │    │  (in-memory state) │ │
│  └──────────┘    └────────┬───────────┘ │
│                           │             │
│                  ┌────────▼───────────┐ │
│                  │   Dexie.js Layer   │ │
│                  │  (IndexedDB ORM)   │ │
│                  └────────┬───────────┘ │
│                           │             │
│                  ┌────────▼───────────┐ │
│                  │    IndexedDB       │ │
│                  │  (persistent)      │ │
│                  └────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Tech Stack

| 영역 | 라이브러리 | 선택 이유 |
|------|-----------|---------|
| UI | React 18 + TypeScript | 컴포넌트 재사용성, 타입 안전성 |
| 빌드 | Vite | 빠른 HMR, 경량 번들 |
| 스타일 | Tailwind CSS v3 | 유틸리티 우선, 번들 크기 최소화 |
| 라우팅 | React Router v6 | SPA 페이지 전환 |
| 상태 관리 | Zustand | 보일러플레이트 없는 간단한 전역 상태 |
| DB | Dexie.js (IndexedDB) | 타입 안전 IndexedDB ORM, 마이그레이션 지원 |
| 차트 | Recharts | React 친화적, 커스터마이징 용이 |
| 테스트 | Vitest + React Testing Library | Vite 통합, 빠른 실행 |
| 배포 | Vercel | 무료 티어, 자동 배포 |

---

## Data Model

### `exercises` — 운동 종목

```ts
interface Exercise {
  id: string           // uuid
  name: string
  muscleGroup: MuscleGroup   // 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'
  equipment: Equipment       // 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable'
  isCustom: boolean
  createdAt: number    // timestamp
}
```

### `routines` — 루틴

```ts
interface Routine {
  id: string
  name: string
  exerciseIds: string[]        // 순서 보존
  targetSets: Record<string, number>   // exerciseId → 목표 세트 수
  targetReps: Record<string, number>   // exerciseId → 목표 횟수
  createdAt: number
  updatedAt: number
}
```

### `sessions` — 운동 세션

```ts
interface Session {
  id: string
  routineId: string
  date: string         // 'YYYY-MM-DD'
  startedAt: number
  finishedAt: number | null
  sets: SetRecord[]
}

interface SetRecord {
  exerciseId: string
  setIndex: number
  weight: number       // kg
  reps: number
  completedAt: number
}
```

---

## Zustand Store Structure

```ts
// store/workoutStore.ts
interface WorkoutStore {
  // 현재 진행 중인 세션
  activeSession: Session | null
  startSession: (routineId: string) => void
  finishSession: () => void
  logSet: (exerciseId: string, weight: number, reps: number) => void
  removeSet: (exerciseId: string, setIndex: number) => void

  // 루틴
  routines: Routine[]
  loadRoutines: () => Promise<void>
  createRoutine: (data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateRoutine: (id: string, patch: Partial<Routine>) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>

  // 히스토리
  sessions: Session[]
  loadSessions: (limit?: number) => Promise<void>
}
```

---

## Dexie Schema & Migrations

```ts
// db/index.ts
class AppDB extends Dexie {
  exercises!: Table<Exercise>
  routines!: Table<Routine>
  sessions!: Table<Session>

  constructor() {
    super('workout-app')
    this.version(1).stores({
      exercises: 'id, muscleGroup, isCustom',
      routines:  'id, updatedAt',
      sessions:  'id, routineId, date',
    })
  }
}
```

마이그레이션은 `this.version(n).upgrade()` 콜백으로 처리. 스키마 변경 시 버전 번호 증가 필수.

---

## Routing

```
/                     → 홈 (오늘 운동 / 세션 진행 중 여부 분기)
/session/:routineId   → 운동 세션 화면
/routines             → 루틴 목록
/routines/new         → 루틴 생성
/routines/:id/edit    → 루틴 편집
/history              → 히스토리 캘린더
/history/:date        → 날짜 상세
/profile              → 프로필 / 설정
```

---

## Performance Considerations

- **초기 로드**: Vite 코드 스플리팅으로 페이지별 청크 분리, 히스토리/차트 페이지는 lazy import
- **DB 쿼리**: 히스토리 목록은 최근 50건만 로드, 더 보기 시 추가 로드
- **리렌더링**: Zustand selector로 구독 범위 최소화 (`useWorkoutStore(s => s.activeSession)`)
- **이미지**: 없음 (아이콘은 SVG 인라인 또는 `lucide-react`)

---

## PWA Support

- `vite-plugin-pwa`로 Service Worker 자동 생성
- 오프라인 캐싱: app shell + 정적 에셋 전체
- `manifest.json`: 홈 화면 추가, standalone 모드, 테마 컬러 `#0F0F0F`
- iOS safe area: `viewport-fit=cover` + `env(safe-area-inset-*)` CSS 변수 대응

---

## Testing Strategy

| 레이어 | 도구 | 범위 |
|--------|------|------|
| 유틸 함수 | Vitest | 볼륨 계산, 날짜 포맷 등 순수 함수 |
| DB 레이어 | Vitest + fake-indexeddb | Dexie CRUD 검증 |
| 컴포넌트 | React Testing Library | 세트 입력 → 완료 흐름 등 핵심 인터랙션 |
| E2E | (v2에서 Playwright 도입 예정) | — |
