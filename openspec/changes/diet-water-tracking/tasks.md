## 1. 타입 및 DB 스키마

- [x] 1.1 `src/types/index.ts`에 MealLog, WaterLog 타입 추가
- [x] 1.2 `src/db/index.ts`에 mealLogs, waterLogs 테이블 추가 (Dexie 버전 업)

## 2. 스토어 확장

- [x] 2.1 workoutStore에 mealLogs, waterLogs 상태 추가
- [x] 2.2 addMealLog, deleteMealLog 액션 구현
- [x] 2.3 addWaterLog, removeLastWaterLog 액션 구현
- [x] 2.4 init() 에서 mealLogs, waterLogs 로드 추가

## 3. TrackingPage UI

- [x] 3.1 `src/pages/TrackingPage.tsx` 파일 생성 (식단 + 물 섭취 통합 페이지)
- [x] 3.2 물 섭취 섹션 — 진행률 원형 표시 + 총 섭취량(ml) 텍스트
- [x] 3.3 물 섭취 섹션 — 250ml / 500ml / 1000ml 버튼 + 되돌리기 버튼
- [x] 3.4 식단 섹션 — 오늘 합계 카드 (총 칼로리, 단백질, 탄수화물, 지방)
- [x] 3.5 식단 섹션 — 기록 목록 + 항목별 삭제 버튼
- [x] 3.6 식단 섹션 — 인라인 추가 폼 (음식명 필수, 칼로리/단백질/탄수화물/지방 입력)
- [x] 3.7 빈 상태 처리 (식단 없음, 물 0ml 상태)

## 4. 라우팅 및 탭바

- [x] 4.1 `src/App.tsx`에 /tracking 라우트 추가
- [x] 4.2 `src/components/BottomNav.tsx`에 "기록" 탭 추가 (아이콘: UtensilsCrossed)

## 5. 검증

- [x] 5.1 물 버튼 탭 → 섭취량 증가 / 되돌리기 → 감소 확인
- [x] 5.2 식단 추가 → 합계 반영 / 삭제 → 합계 감소 확인
- [x] 5.3 `npm run type-check` 통과
