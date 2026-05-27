## ADDED Requirements

### Requirement: 라이트 테마 컬러 시스템
앱은 흰색(#F8FAFC) 배경과 파란색(#2563EB) primary 컬러를 기반으로 한 라이트 테마를 SHALL 적용한다.

#### Scenario: 앱 배경색
- **WHEN** 사용자가 앱을 열면
- **THEN** 전체 배경은 #F8FAFC(연한 흰색)이어야 하고 카드 배경은 #FFFFFF이어야 한다

#### Scenario: Primary 색상
- **WHEN** CTA 버튼 또는 활성 탭이 표시될 때
- **THEN** #2563EB(파란색) 또는 파란색 그라디언트(#3B82F6 → #2563EB)가 적용되어야 한다

### Requirement: 카드 elevation 스타일
카드 컴포넌트는 테두리만 사용하는 대신 그림자(box-shadow)와 얇은 테두리를 함께 SHALL 사용한다.

#### Scenario: 기본 카드 그림자
- **WHEN** 카드가 화면에 렌더링되면
- **THEN** `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` 및 `border: 1px solid #E2E8F0`이 적용되어야 한다

#### Scenario: 카드 hover 그림자
- **WHEN** 사용자가 카드에 마우스를 올리면
- **THEN** `box-shadow: 0 4px 12px rgba(37,99,235,0.10)`으로 전환되어야 한다

### Requirement: 버튼 그라디언트
Primary 버튼은 단색 대신 파란색 그라디언트와 drop shadow를 SHALL 사용한다.

#### Scenario: Primary 버튼 스타일
- **WHEN** primary variant 버튼이 렌더링되면
- **THEN** 배경은 `linear-gradient(135deg, #3B82F6, #2563EB)`, 그림자는 `0 4px 14px rgba(37,99,235,0.30)`이어야 한다

### Requirement: 세트 완료 행 스타일
운동 세션에서 완료된 세트 행은 성공을 나타내는 연한 초록색 배경을 SHALL 사용한다.

#### Scenario: 완료 세트 행 배경
- **WHEN** 사용자가 세트 완료를 기록하면
- **THEN** 해당 행 배경은 #ECFDF5(연한 초록)로 변경되어야 한다

### Requirement: 바텀 네비게이션 활성 표시
바텀 네비게이션의 활성 탭은 아이콘+텍스트 색상 변경 외에 indicator dot을 SHALL 표시한다.

#### Scenario: 활성 탭 indicator
- **WHEN** 특정 탭이 활성화되면
- **THEN** 아이콘 아래 #2563EB 색상의 작은 점(dot)이 표시되어야 한다
