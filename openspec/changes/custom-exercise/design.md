## Context

`workoutStore.addExercise()`는 이미 구현돼 있다. RoutineEditPage의 종목 선택 바텀시트(showPicker)에 "직접 추가" 뷰를 추가하면 된다. 바텀시트 내부에서 뷰 전환(목록 ↔ 폼)으로 처리한다.

## Goals / Non-Goals

**Goals:**
- 바텀시트 내 "직접 추가" 버튼 → 폼 뷰 전환
- 종목명(text) / 근육군(select) / 장비(select) 입력 후 저장
- 저장 즉시 루틴에 추가 및 바텀시트 닫힘

**Non-Goals:**
- 커스텀 종목 수정/삭제 UI
- 종목 설명, 이미지, 가이드
- 커스텀/기본 종목 분리 필터

## Decisions

**1. 바텀시트 내 뷰 전환으로 처리**
- `pickerView: 'list' | 'create'` 상태로 관리
- 별도 모달 없이 기존 바텀시트 안에서 전환 (UX 단순화)

**2. 근육군/장비는 native `<select>`**
- 기존 타입(`MuscleGroup`, `Equipment`)과 동일한 값 사용
- `muscleGroupLabel`, `equipmentLabel`로 한국어 표시

**3. 저장 후 바로 루틴에 추가**
- `addExercise()` 완료 후 생성된 종목을 `setSelected()`에 즉시 반영
- 바텀시트 닫기

## Risks / Trade-offs

- [Trade-off] 바텀시트 내 폼 전환이 약간 복잡해지지만 별도 모달보다 UX가 자연스러움
