## Context

현재 앱은 운동 기록(Session, Set)만 관리한다. 식단과 수분 기록을 추가하려면 새로운 데이터 모델, Dexie 테이블, Zustand 슬라이스, 라우트, UI 페이지가 필요하다. 완전 로컬(서버 없음) 원칙은 유지한다.

## Goals / Non-Goals

**Goals:**
- MealLog(음식명, 칼로리, 단백질, 탄수화물, 지방, 날짜) IndexedDB 저장
- WaterLog(ml, 날짜) IndexedDB 저장
- 날짜별 식단 합계(총 칼로리 등) 계산 및 표시
- 물 250ml 탭 버튼으로 누적, 2000ml 목표 대비 진행률 링 표시
- 하단 탭바에 "기록" 탭 추가

**Non-Goals:**
- 음식 데이터베이스 / 바코드 스캔
- 칼로리 목표 설정 UI (목표는 2000ml 물 고정, 칼로리는 합계만 표시)
- 히스토리 페이지 차트와 식단/수분 통합
- 사진 첨부

## Decisions

**1. 별도 TrackingPage 신규 생성**
- 운동(HistoryPage)과 분리해 복잡도 억제
- 탭 내부에서 식단/물 섹션을 세로로 배치

**2. Zustand 슬라이스 확장 (별도 스토어 X)**
- 기존 workoutStore에 mealLogs, waterLogs 슬라이스 추가
- 하나의 스토어 유지로 init 로직 단순화

**3. 물 250ml 단위 버튼**
- 탭 3개(250 / 500 / 1000ml)로 빠르게 입력
- 취소는 마지막 기록 1개 삭제(-250ml 버튼)

**4. 식단 입력: 인라인 폼 (모달 X)**
- 바텀시트 모달 없이 페이지 내 인라인 카드 폼으로 처리
- 폼 토글(+ 추가 버튼 → 폼 오픈 → 저장/취소)

## Risks / Trade-offs

- [Trade-off] workoutStore가 더 커짐 → 추후 분리 리팩토링 가능, MVP에서는 단순화 우선
- [Risk] Dexie 스키마 버전 충돌 → version 번호를 올려 마이그레이션 추가
