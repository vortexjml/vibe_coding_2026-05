## 1. 컬러 토큰 & 글로벌 스타일

- [x] 1.1 `tailwind.config.js` 컬러 토큰 전면 교체 (bg-base, bg-surface, bg-elevated, primary, text-primary, text-secondary, border)
- [x] 1.2 `tailwind.config.js`에 신규 토큰 추가 (primary-subtle, success-subtle, primary-light)
- [x] 1.3 `tailwind.config.js` extend.boxShadow에 card, card-hover, button-primary shadow 등록
- [x] 1.4 `src/index.css` 베이스 배경색 및 텍스트 색상 라이트 모드로 업데이트

## 2. 공통 컴포넌트

- [x] 2.1 `Button.tsx` — primary variant를 그라디언트(#3B82F6→#2563EB) + drop shadow로 교체, border-radius 14px
- [x] 2.2 `Button.tsx` — secondary/ghost/danger variant 라이트 배경으로 업데이트
- [x] 2.3 `BottomNav.tsx` — 배경 흰색, 상단 테두리 #E2E8F0, 활성 탭 indicator dot 추가
- [x] 2.4 `RestTimer.tsx` — 배경/텍스트/버튼 색상 라이트 테마로 업데이트

## 3. 페이지 — 홈 & 세션

- [x] 3.1 `HomePage.tsx` — 전체 배경, 카드(bg-surface+shadow), 스트릭 배너 그라디언트 적용
- [x] 3.2 `HomePage.tsx` — 루틴 카드 hover 스타일(파란 테두리+shadow) 추가
- [x] 3.3 `SessionPage.tsx` — 헤더, 운동 카드 배경/shadow 라이트 테마 적용
- [x] 3.4 `SessionPage.tsx` — 완료 세트 행 배경 #ECFDF5(success-subtle) 적용
- [x] 3.5 `SessionPage.tsx` — 인풋 포커스 스타일 (파란 테두리 + 흰 배경) 업데이트

## 4. 페이지 — 루틴 & 히스토리 & 프로필

- [x] 4.1 `RoutinesPage.tsx` — 카드 배경/shadow/border-radius 업데이트
- [x] 4.2 `RoutineEditPage.tsx` — 카드, 인풋, 바텀시트, 필터 칩 라이트 테마 적용
- [x] 4.3 `HistoryPage.tsx` — 캘린더 배경, 선택일 강조, 세션 카드 업데이트
- [x] 4.4 `ProfilePage.tsx` — 통계 카드 배경/shadow/아이콘 컬러 업데이트

## 5. 검증

- [x] 5.1 개발 서버에서 홈/세션/루틴/히스토리/프로필 전 화면 시각 확인
- [x] 5.2 `npm run type-check` 통과 확인
- [x] 5.3 `npm run build` 빌드 성공 확인
