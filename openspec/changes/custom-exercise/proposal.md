## Why

현재 26개 기본 종목만 제공되어 사용자가 원하는 종목(예: 특정 머신, 맨몸 운동 변형)을 추가할 수 없다. PRD의 "커스텀 종목 추가" 요구사항을 구현해 루틴 구성의 자유도를 높인다.

## What Changes

- 루틴 편집 종목 선택 바텀시트에 "직접 추가" 버튼 추가
- 종목명 / 근육군 / 장비를 입력하는 폼 UI 구현
- 저장 시 `workoutStore.addExercise()` 호출 → IndexedDB 저장
- 저장 직후 종목 목록에 즉시 반영

## Capabilities

### New Capabilities
- `custom-exercise-creation`: 바텀시트 내에서 커스텀 종목을 생성해 즉시 루틴에 추가하는 기능

### Modified Capabilities
(없음)

## Impact

- `src/pages/RoutineEditPage.tsx` — 바텀시트에 커스텀 종목 추가 폼 연결
- `src/store/workoutStore.ts` — `addExercise()` 이미 구현됨, UI만 연결
- 커스텀 종목 수정/삭제, 종목 설명/이미지, 공유 기능은 제외
