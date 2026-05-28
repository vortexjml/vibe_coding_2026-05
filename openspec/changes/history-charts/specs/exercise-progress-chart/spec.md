## ADDED Requirements

### Requirement: 종목 선택 드롭다운
히스토리 페이지 차트 섹션은 사용자가 기록이 있는 종목 중 하나를 선택할 수 있는 드롭다운 SHALL 제공한다.

#### Scenario: 드롭다운 목록
- **WHEN** 사용자가 히스토리 페이지의 차트 섹션을 보면
- **THEN** 세션 기록이 존재하는 종목 목록만 드롭다운에 표시되어야 한다

#### Scenario: 기록 없음
- **WHEN** 운동 기록이 하나도 없으면
- **THEN** "아직 운동 기록이 없어요" 빈 상태 메시지를 표시해야 한다

### Requirement: 최고무게 LineChart
선택된 종목에 대해 날짜별 최고무게 추이를 LineChart로 SHALL 표시한다.

#### Scenario: 차트 데이터
- **WHEN** 사용자가 종목을 선택하면
- **THEN** 해당 종목의 각 운동일 최고무게(kg)를 날짜 X축, 무게 Y축의 LineChart로 표시해야 한다

#### Scenario: 단일 데이터
- **WHEN** 선택 종목의 기록이 1개뿐이면
- **THEN** 점(dot) 하나로 표시하고 차트는 정상 렌더링되어야 한다

### Requirement: 총볼륨 BarChart
선택된 종목에 대해 날짜별 총볼륨(무게×횟수 합계) 추이를 BarChart로 SHALL 표시한다.

#### Scenario: 볼륨 계산
- **WHEN** 사용자가 종목을 선택하면
- **THEN** 해당 운동일의 모든 세트(무게×횟수)를 합산한 총볼륨을 BarChart로 표시해야 한다
