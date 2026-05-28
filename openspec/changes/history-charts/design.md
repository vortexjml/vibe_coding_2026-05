## Context

Recharts는 이미 설치돼 있다. HistoryPage는 현재 캘린더 + 세션 목록만 있고 차트가 없다. 세션 데이터는 `useWorkoutStore(s => s.sessions)`로 접근 가능하다.

## Goals / Non-Goals

**Goals:**
- HistoryPage 하단에 종목 드롭다운 + LineChart + BarChart 렌더링
- 라이트 테마 색상 시스템(#2563EB, #10B981 등) 차트에 적용

**Non-Goals:**
- 날짜 범위 필터, 다중 종목 비교, 차트 내보내기

## Decisions

**1. 데이터 가공은 컴포넌트 내 useMemo로 처리**
- sessions 배열에서 선택 종목의 날짜별 maxWeight, totalVolume을 계산
- 별도 훅 파일 없이 HistoryPage 내부에서 처리 (단순하므로)

**2. Recharts 컴포넌트 선택**
- 최고무게: `LineChart` + `Line` (dot 표시, primary 색상)
- 총볼륨: `BarChart` + `Bar` (success 색상)
- 공통: `ResponsiveContainer`, `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`

**3. 드롭다운은 native `<select>` 사용**
- 커스텀 드롭다운 대신 스타일링된 native select 사용 (구현 단순화)

## Risks / Trade-offs

- [Risk] 기록이 많을 경우 차트가 복잡해질 수 있음 → 최근 20개 데이터 포인트로 제한
- [Trade-off] native select는 디자인 일관성이 약하지만 구현이 빠름
