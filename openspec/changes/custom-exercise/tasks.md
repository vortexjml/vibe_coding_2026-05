## 1. 바텀시트 뷰 전환

- [x] 1.1 RoutineEditPage에 `pickerView: 'list' | 'create'` 상태 추가
- [x] 1.2 바텀시트 상단에 "직접 추가" 버튼 추가 (list 뷰일 때만 표시)
- [x] 1.3 "직접 추가" 클릭 시 create 뷰로 전환, 뒤로가기 버튼 제공

## 2. 커스텀 종목 입력 폼

- [x] 2.1 종목명 텍스트 인풋 구현 (라이트 테마 스타일)
- [x] 2.2 근육군 `<select>` 구현 (muscleGroupLabel 사용)
- [x] 2.3 장비 `<select>` 구현 (equipmentLabel 사용)
- [x] 2.4 저장 버튼 구현 — 종목명 미입력 시 경고, 입력 시 `addExercise()` 호출

## 3. 저장 후 처리

- [x] 3.1 `addExercise()` 완료 후 생성 종목을 루틴 selected 목록에 즉시 추가
- [x] 3.2 바텀시트 닫기 및 list 뷰로 초기화

## 4. 검증

- [x] 4.1 커스텀 종목 생성 후 루틴에 추가되는지 확인
- [x] 4.2 `npm run type-check` 통과
