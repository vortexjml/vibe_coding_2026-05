# Design Guide — 운동 루틴 기록 앱

## Design Principles

1. **속도 우선** — 헬스장에서 한 손으로 빠르게 입력 가능해야 함
2. **최소 인지 부하** — 현재 세션에 집중, 불필요한 UI 제거
3. **진행 상황 가시화** — 완료된 세트와 남은 세트를 즉시 파악 가능

---

## Color Palette

| Token | Hex | 용도 |
|-------|-----|------|
| `primary` | `#6366F1` | CTA 버튼, 활성 상태, 포커스 링 |
| `primary-dark` | `#4F46E5` | 버튼 hover / pressed |
| `success` | `#22C55E` | 세트 완료 체크, streak 뱃지 |
| `warning` | `#F59E0B` | 휴식 타이머 경고 |
| `danger` | `#EF4444` | 삭제 액션 |
| `bg-base` | `#0F0F0F` | 앱 배경 (다크 모드 기본) |
| `bg-surface` | `#1C1C1E` | 카드 / 시트 배경 |
| `bg-elevated` | `#2C2C2E` | 입력 필드, 선택된 행 |
| `text-primary` | `#F5F5F5` | 본문 |
| `text-secondary` | `#A1A1AA` | 보조 레이블, 플레이스홀더 |
| `border` | `#3F3F46` | 구분선, 카드 테두리 |

> 라이트 모드는 v2에서 지원. v1은 다크 모드 단일.

---

## Typography

| 역할 | 크기 | 굵기 | 사용처 |
|------|------|------|--------|
| Display | 28px | 700 | 페이지 제목 |
| Heading | 20px | 600 | 섹션 헤더, 루틴 이름 |
| Body | 16px | 400 | 일반 텍스트 |
| Label | 14px | 500 | 입력 레이블, 버튼 |
| Caption | 12px | 400 | 보조 정보, 타임스탬프 |

폰트: `Inter` (시스템 폰트 스택 fallback 포함)

---

## Spacing & Layout

- 기본 단위: `4px` (Tailwind `space-1`)
- 모바일 기준 최대 너비: `430px`, 중앙 정렬
- 화면 좌우 패딩: `16px`
- 카드 내부 패딩: `16px`
- 섹션 간 간격: `24px`

---

## Components

### Button

| Variant | 배경 | 텍스트 | 용도 |
|---------|------|--------|------|
| `primary` | `primary` | 흰색 | 주요 CTA |
| `secondary` | `bg-elevated` | `text-primary` | 보조 액션 |
| `ghost` | 투명 | `primary` | 취소, 닫기 |
| `danger` | `danger` | 흰색 | 삭제 확인 |

높이: `48px` (터치 타겟 최소 보장), 모서리: `rounded-xl`

### Input (무게 / 횟수)

- 높이: `56px`, 텍스트 중앙 정렬, 숫자 키패드 자동 호출 (`inputmode="decimal"`)
- 포커스 시 `primary` 색상 테두리 `2px`
- 이전 기록 값은 플레이스홀더로 표시 (회색)

### Set Row

```
[ 세트 번호 ]  [ 무게 kg ]  [ × ]  [ 횟수 ]  [ ✓ 완료 ]
```

완료된 행은 배경색 `bg-elevated` + 텍스트 `text-secondary` + 체크 아이콘 `success`

### Bottom Navigation

탭 4개: 홈(오늘 운동) / 루틴 / 히스토리 / 프로필  
높이: `64px` + safe-area-inset-bottom 대응

---

## Screen Map

```
홈
 ├─ 운동 없음 상태 → [루틴 선택하기] CTA
 └─ 운동 중 상태 → 세션 화면

세션 화면
 ├─ 종목 카드 목록 (스크롤)
 │   └─ 세트 행 + [세트 추가] 버튼
 ├─ 휴식 타이머 (하단 고정)
 └─ [운동 완료] 버튼

루틴
 ├─ 루틴 목록
 └─ 루틴 편집
     └─ 종목 추가 (검색 + 커스텀 생성)

히스토리
 ├─ 캘린더 뷰
 └─ 날짜 상세 → 종목별 볼륨 차트

프로필
 └─ streak, 총 운동 횟수, 데이터 내보내기
```

---

## Interaction & Motion

- 세트 완료 체크: 행 배경색 즉시 전환 + `scale(0.95)` → `scale(1)` 100ms
- 카드 삭제: 스와이프 좌 → 빨간 삭제 버튼 노출
- 페이지 전환: slide 방향 전환 (push/pop 패턴), 200ms ease-out
- 타이머 진동: 완료 시 `navigator.vibrate([100, 50, 100])`
