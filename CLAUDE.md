# CLAUDE.md — 운동 루틴 기록 앱

## Project Overview

개인 운동 루틴을 기록하고 추적하는 모바일 우선 웹 앱.
React + TypeScript + Tailwind CSS 기반, IndexedDB를 통한 오프라인 우선 저장.

## Directory Structure

```
src/
  components/       # 재사용 UI 컴포넌트
  pages/            # 라우트별 페이지 컴포넌트
  store/            # Zustand 스토어 (전역 상태)
  db/               # IndexedDB 접근 레이어 (Dexie.js)
  hooks/            # 커스텀 React 훅
  types/            # 공유 TypeScript 타입 정의
  utils/            # 순수 유틸 함수
  data/             # 기본 운동 종목 시드 데이터
```

## Commands

```bash
npm run dev          # 개발 서버 (Vite)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 로컬 프리뷰
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run test         # Vitest
```

## Key Conventions

- **컴포넌트**: 함수형 컴포넌트만 사용, default export
- **상태 관리**: 서버/원격 상태 없음 — Zustand 스토어 + Dexie(IndexedDB) 만으로 처리
- **스타일**: Tailwind 유틸리티 클래스 우선, 별도 CSS 파일 최소화
- **타입**: `any` 사용 금지, 모든 props에 명시적 타입 정의
- **파일명**: 컴포넌트는 PascalCase (`WorkoutCard.tsx`), 나머지는 camelCase

## Data Flow

```
UI 이벤트
  → Zustand action 호출
    → Dexie DB 쓰기/읽기
      → Zustand 상태 업데이트
        → 컴포넌트 리렌더링
```

## What NOT to Do

- 서버 API 호출 코드 추가 금지 (v1은 완전 로컬)
- `localStorage` 직접 사용 금지 — 반드시 Dexie 레이어를 통할 것
- 컴포넌트 내부에서 DB 직접 접근 금지 — 훅 또는 스토어를 통할 것
- 불필요한 `useEffect` 의존성 배열 누락 금지
