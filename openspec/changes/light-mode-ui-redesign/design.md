## Context

현재 앱은 Tailwind CSS의 커스텀 컬러 토큰을 사용하는 다크 테마 기반이다. `tailwind.config.js`에 토큰이 중앙 정의되어 있고, 각 컴포넌트/페이지가 `bg-bg-surface`, `text-text-primary`, `border-border` 등의 클래스를 직접 사용한다. 컬러 시스템 교체는 config 수준과 CSS 클래스 수준 두 곳 모두 작업이 필요하다.

## Goals / Non-Goals

**Goals:**
- 라이트 모드 기반의 흰색+파란색 컬러 시스템으로 전환
- 카드 shadow elevation, 버튼 그라디언트, 넓은 border-radius 등 세련도 향상
- 모든 페이지/컴포넌트에 일관된 새 디자인 적용

**Non-Goals:**
- 다크/라이트 모드 토글 기능 추가 (v2 예정)
- 기능 로직, 데이터 모델, 라우팅 변경
- 애니메이션 라이브러리 도입

## Decisions

**1. Tailwind config 토큰 전면 교체 (기존 다크 토큰 → 라이트 토큰)**
- `bg-base`: `#0F0F0F` → `#F8FAFC`
- `bg-surface`: `#1C1C1E` → `#FFFFFF`
- `bg-elevated`: `#2C2C2E` → `#F1F5F9`
- `primary`: `#6366F1` → `#2563EB`
- `primary-dark`: `#4F46E5` → `#1D4ED8`
- `text-primary`: `#F5F5F5` → `#0F172A`
- `text-secondary`: `#A1A1AA` → `#64748B`
- `border`: `#3F3F46` → `#E2E8F0`
- 신규 토큰 추가: `primary-subtle` (`#EFF6FF`), `success-subtle` (`#ECFDF5`)

**2. 그림자(shadow) 유틸리티 클래스 활용**
- Tailwind의 `shadow-sm`, `shadow-md`를 활용하되 카드에 커스텀 shadow 추가
- `tailwind.config.js`의 `extend.boxShadow`에 `card`, `card-hover`, `button-primary` 등록

**3. 버튼 그라디언트는 CSS class로 처리**
- Tailwind의 `bg-gradient-to-br from-blue-500 to-blue-600` 활용
- `Button.tsx`의 primary variant에 적용

**4. border-radius 확대**
- 카드: `rounded-2xl`(16px) → `rounded-[20px]`
- 버튼: `rounded-xl`(12px) → `rounded-[14px]`
- 인풋: 유지 (`rounded-xl`)

## Risks / Trade-offs

- [Risk] 모든 페이지의 Tailwind 클래스를 수동 교체해야 해서 누락 발생 가능
  → Mitigation: 파일별로 순차 작업 후 스크린샷으로 검증

- [Risk] 라이트 모드에서 텍스트 대비(contrast) 기준 미충족 가능
  → Mitigation: `text-primary(#0F172A)` / `bg-base(#F8FAFC)` 조합은 WCAG AA 기준 충족 확인됨

- [Trade-off] 토큰 이름(`bg-surface`, `text-primary` 등)은 유지하여 코드 변경 최소화
  → 다크 모드 재도입 시 토큰 값만 바꾸면 되므로 유연성 유지

## Migration Plan

1. `tailwind.config.js` 컬러 토큰 교체
2. `src/index.css` 베이스 스타일 업데이트
3. 공통 컴포넌트 순서대로 수정: `Button` → `BottomNav` → `RestTimer`
4. 페이지 순서대로 수정: `HomePage` → `SessionPage` → `RoutinesPage` → `RoutineEditPage` → `HistoryPage` → `ProfilePage`
5. 개발 서버에서 각 화면 시각 검증
6. 빌드 확인 (`npm run build`)

롤백: git revert로 즉시 복구 가능 (기능 변경 없음)
