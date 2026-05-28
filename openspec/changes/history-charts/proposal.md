## Why

히스토리 페이지에 기록 목록만 있고 시각적 추이를 확인할 수 없다. 사용자가 특정 종목의 성장(최고무게, 총볼륨)을 날짜 흐름에 따라 한눈에 파악할 수 있어야 MVP 핵심 가치인 "진행 상황 가시화"가 완성된다.

## What Changes

- 히스토리 페이지 하단에 차트 섹션 추가
- 운동한 종목 중 하나를 선택할 수 있는 드롭다운 추가
- 선택 종목의 날짜별 최고무게 LineChart (Recharts) 표시
- 선택 종목의 날짜별 총볼륨 BarChart (Recharts) 표시
- 데이터 없을 시 빈 상태 안내 UI

## Capabilities

### New Capabilities
- `exercise-progress-chart`: 종목별 최고무게/볼륨 추이를 날짜축으로 시각화하는 차트

### Modified Capabilities
(없음)

## Impact

- `src/pages/HistoryPage.tsx` — 차트 섹션 추가
- `recharts` 패키지 (이미 설치됨)
- 날짜 범위 선택, 다중 종목 비교, 내보내기 기능은 제외
