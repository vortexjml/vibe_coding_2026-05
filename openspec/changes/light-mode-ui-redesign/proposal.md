## Why

현재 앱은 다크 모드(검정+인디고) 기반이지만, 사용자 피드백에 따라 라이트 모드(흰색+파란색)가 더 세련되고 직관적으로 느껴진다. Nike Training Club, Strava, Apple Fitness+ 수준의 프리미엄 UI로 개편하여 앱 완성도와 사용자 경험을 높인다.

## What Changes

- 전체 컬러 팔레트를 다크(#0F0F0F 배경, #6366F1 primary) → 라이트(#F8FAFC 배경, #2563EB primary)로 교체
- 카드/시트 배경을 어두운 회색 → 흰색으로 전환, 테두리 단독 대신 그림자(elevation) 병용
- Primary 버튼에 파란색 그라디언트 + drop shadow 적용
- border-radius 전반적으로 확대 (카드 16px→20px, 버튼 12px→14px)
- 타이포그래피 letter-spacing 및 font-weight 정교화
- Streak 배너를 오렌지→레드 그라디언트 카드로 교체
- 바텀 네비게이션 배경 흰색으로 변경, 활성 탭 indicator dot 추가
- 인풋 필드 포커스 스타일 개선 (파란색 테두리 + 흰 배경)
- 세트 완료 행 배경을 성공 색상(#ECFDF5 그린)으로 적용

## Capabilities

### New Capabilities

- `light-theme`: 흰색+파란색 기반 라이트 테마 컬러 시스템 및 전체 컴포넌트 스타일

### Modified Capabilities

(없음 — 기능 요구사항 변경 없이 순수 시각 디자인 변경)

## Impact

- `tailwind.config.js` — 컬러 토큰 전면 교체
- `src/index.css` — 베이스 스타일, 배경색
- `src/components/` — Button, BottomNav, RestTimer 스타일
- `src/pages/` — 모든 페이지의 Tailwind 클래스 교체
- 기능 로직·데이터 모델 변경 없음
