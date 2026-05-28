## 1. 데이터 가공

- [x] 1.1 sessions에서 종목별 고유 exerciseId 목록 추출 (기록 있는 종목만)
- [x] 1.2 선택 종목의 날짜별 maxWeight 계산 로직 구현 (useMemo)
- [x] 1.3 선택 종목의 날짜별 totalVolume 계산 로직 구현 (useMemo)

## 2. UI 구현

- [x] 2.1 HistoryPage에 종목 선택 `<select>` 드롭다운 추가 (라이트 테마 스타일)
- [x] 2.2 최고무게 LineChart 컴포넌트 구현 (ResponsiveContainer, primary 색상)
- [x] 2.3 총볼륨 BarChart 컴포넌트 구현 (ResponsiveContainer, success 색상)
- [x] 2.4 기록 없음 빈 상태 UI 처리

## 3. 검증

- [x] 3.1 운동 기록이 있는 종목 선택 시 차트 정상 렌더링 확인
- [x] 3.2 `npm run type-check` 통과
