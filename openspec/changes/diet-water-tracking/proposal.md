## Why

운동 기록 앱에서 식단과 수분 섭취를 함께 관리할 수 없어 건강 관리가 분산된다. 운동·식단·수분을 한 앱에서 추적해 일상 건강 루틴 전반을 커버한다.

## What Changes

- 하단 탭바에 "기록" 탭 신규 추가 (총 5탭)
- 식단 기록 기능: 음식명 + 칼로리/단백질/탄수화물/지방 입력, 날짜별 합계 표시
- 물 섭취 기록 기능: 250ml 단위 버튼 탭으로 누적, 일일 목표(2000ml) 대비 진행률 표시
- IndexedDB(Dexie)에 mealLogs, waterLogs 테이블 추가
- Zustand 스토어에 식단/수분 액션 추가

## Capabilities

### New Capabilities
- `meal-logging`: 날짜별 식단(음식명, 칼로리, 단백질, 탄수화물, 지방) 기록 및 합계 조회
- `water-tracking`: 날짜별 물 섭취량 250ml 단위 탭 기록 및 일일 목표 진행률 표시

### Modified Capabilities

## Impact

- `src/pages/TrackingPage.tsx` — 신규 페이지 (식단 + 물 섭취 UI)
- `src/components/BottomNav.tsx` — 탭 1개 추가 (홈/루틴/기록/히스토리/프로필)
- `src/db/index.ts` — mealLogs, waterLogs 테이블 추가
- `src/store/workoutStore.ts` — 식단/수분 상태 및 액션 추가
- `src/types/index.ts` — MealLog, WaterLog 타입 추가
- `src/App.tsx` — /tracking 라우트 추가
