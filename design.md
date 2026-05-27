# Design Guide — 운동 루틴 기록 앱 v2

## Design Principles

1. **속도 우선** — 헬스장에서 한 손으로 빠르게 입력 가능해야 함
2. **최소 인지 부하** — 현재 세션에 집중, 불필요한 UI 제거
3. **진행 상황 가시화** — 완료된 세트와 남은 세트를 즉시 파악 가능
4. **세련된 라이트 모드** — 화이트 + 블루 기반, 깨끗하고 프리미엄한 느낌

---

## Color Palette

### Primary (Blue)

| Token | Hex | 용도 |
|-------|-----|------|
| `primary` | `#2563EB` | CTA 버튼, 활성 탭, 포커스 링 |
| `primary-light` | `#3B82F6` | hover 상태, 보조 강조 |
| `primary-dark` | `#1D4ED8` | pressed 상태 |
| `primary-subtle` | `#EFF6FF` | 선택된 항목 배경, 뱃지 배경 |
| `primary-text` | `#1E40AF` | primary-subtle 위 텍스트 |

### Semantic

| Token | Hex | 용도 |
|-------|-----|------|
| `success` | `#10B981` | 세트 완료 체크, streak 뱃지 |
| `success-subtle` | `#ECFDF5` | 완료 행 배경 |
| `warning` | `#F59E0B` | 휴식 타이머 경고 |
| `danger` | `#EF4444` | 삭제 액션 |

### Backgrounds & Surfaces

| Token | Hex | 용도 |
|-------|-----|------|
| `bg-base` | `#F8FAFC` | 앱 전체 배경 (slate-50) |
| `bg-surface` | `#FFFFFF` | 카드, 시트, 모달 |
| `bg-elevated` | `#F1F5F9` | 입력 필드, hover, 비활성 영역 |
| `bg-overlay` | `rgba(15,23,42,0.4)` | 모달 오버레이 |

### Text & Border

| Token | Hex | 용도 |
|-------|-----|------|
| `text-primary` | `#0F172A` | 본문, 제목 (slate-900) |
| `text-secondary` | `#64748B` | 보조 레이블, 플레이스홀더 (slate-500) |
| `text-disabled` | `#CBD5E1` | 비활성 텍스트 |
| `border` | `#E2E8F0` | 구분선, 카드 테두리 (slate-200) |
| `border-focus` | `#2563EB` | 포커스 상태 인풋 테두리 |

---

## Gradient

버튼 및 히어로 영역에 그라디언트 적용으로 프리미엄감 부여.

```css
/* Primary Button Gradient */
background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);

/* Streak Badge */
background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);

/* Hero / 오늘 운동 카드 */
background: linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%);
```

---

## Typography

폰트: `Inter` (Variable font, wght 400–700)

| 역할 | 크기 | 굵기 | letter-spacing | 사용처 |
|------|------|------|----------------|--------|
| Display | 28px | 700 | -0.5px | 페이지 제목 |
| Heading | 20px | 700 | -0.3px | 카드 제목, 루틴 이름 |
| Subheading | 16px | 600 | 0px | 섹션 헤더 |
| Body | 15px | 400 | 0px | 일반 텍스트 |
| Label | 13px | 500 | 0.1px | 입력 레이블, 뱃지 |
| Caption | 12px | 400 | 0.2px | 타임스탬프, 보조 정보 |

---

## Elevation & Shadow

테두리 대신 그림자로 깊이감 표현. 얇은 테두리와 병용.

```css
/* card — 기본 카드 */
box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
border: 1px solid #E2E8F0;

/* card-hover — 카드 hover 시 */
box-shadow: 0 4px 12px rgba(37,99,235,0.10), 0 1px 3px rgba(0,0,0,0.06);

/* modal — 바텀시트 / 모달 */
box-shadow: 0 -4px 32px rgba(0,0,0,0.10);

/* button — Primary 버튼 */
box-shadow: 0 4px 14px rgba(37,99,235,0.30);
```

---

## Spacing & Layout

- 기본 단위: `4px`
- 모바일 기준 최대 너비: `430px`, 중앙 정렬
- 화면 좌우 패딩: `20px`
- 카드 내부 패딩: `20px`
- 섹션 간 간격: `28px`
- 카드 간 간격: `12px`

---

## Border Radius

| 요소 | radius |
|------|--------|
| 카드, 시트 | `20px` (`rounded-[20px]`) |
| 버튼 | `14px` (`rounded-[14px]`) |
| 입력 필드 | `12px` (`rounded-xl`) |
| 뱃지, 태그 | `999px` (`rounded-full`) |
| 바텀시트 상단 | `28px 28px 0 0` |
| 아이콘 컨테이너 | `12px` |

---

## Components

### Primary Button

```
┌─────────────────────────────────────────────┐
│  ████████████████  운동 시작  ██████████████  │  height: 54px
│       gradient: #3B82F6 → #2563EB            │  shadow: 0 4px 14px rgba(37,99,235,0.30)
└─────────────────────────────────────────────┘
  border-radius: 14px | font: 15px 600 | color: white
```

### Secondary Button

```
┌─────────────────────────────────────────────┐
│              루틴 편집                        │  height: 54px
│       bg: #F1F5F9 | text: #0F172A            │  border: 1px solid #E2E8F0
└─────────────────────────────────────────────┘
```

### Input (무게 / 횟수)

```
┌──────────────────┐
│                  │  height: 58px | bg: #F1F5F9
│      60 kg       │  text: center, 17px 600, #0F172A
│                  │  focus: border 2px #2563EB, bg: #FFF
└──────────────────┘
  placeholder: 이전 기록 (text-secondary)
```

### Set Row (완료 전 / 후)

```
미완료:
┌──────────────────────────────────────────────────┐
│  ① 세트 1   │  60 kg  ×  10회  │  [완료 체크]  │
│  bg: white  │  text: primary   │  circle btn  │
└──────────────────────────────────────────────────┘

완료:
┌──────────────────────────────────────────────────┐
│  ① 세트 1   │  60 kg  ×  10회  │     ✓         │
│  bg: #ECFDF5 │ text: #6B7280   │  green check  │
└──────────────────────────────────────────────────┘
```

### Streak Badge

```
┌────────────────────────────────┐
│  🔥  7일 연속 운동              │
│  gradient: #F59E0B → #EF4444   │
│  text: white 700               │
└────────────────────────────────┘
  border-radius: full | padding: 10px 16px
```

### Exercise Card (홈 루틴 선택)

```
┌──────────────────────────────────────────────┐
│                                              │
│  💪 풀바디 루틴               →              │
│  6개 종목 · 약 45분                          │
│                                              │
│  [가슴] [등] [하체]                           │  뱃지: primary-subtle
│                                              │
└──────────────────────────────────────────────┘
  hover: border-color #2563EB, shadow card-hover
```

### Bottom Navigation

```
┌──────────┬──────────┬──────────┬──────────┐
│    🏠     │   📋     │   📅     │    👤    │
│   홈      │  루틴    │ 히스토리  │  프로필  │
│  active: primary icon + label + indicator dot
└──────────┴──────────┴──────────┴──────────┘
  height: 64px | bg: white | top-border: 1px #E2E8F0
  active indicator: 3px dot below icon, color: primary
```

---

## Screen Map

```
홈
 ├─ 헤더: 인사말 + 날짜
 ├─ 스트릭 배너 (조건부) — gradient 카드
 ├─ 오늘 완료 운동 (조건부)
 └─ 루틴 선택 카드 목록

세션 화면
 ├─ 진행률 바 (상단 고정) — 파란색 progress bar
 ├─ 종목 카드 목록 (스크롤)
 │   └─ 세트 행 + [+ 세트 추가] 버튼
 ├─ 휴식 타이머 (하단 고정, 반투명 blur)
 └─ [운동 완료] Primary 버튼

루틴
 ├─ 루틴 목록 (카드)
 └─ 루틴 편집
     └─ 종목 추가 (바텀시트 — 검색 + 필터 칩)

히스토리
 ├─ 월별 캘린더 (운동일: 파란 점)
 └─ 날짜 클릭 → 세션 상세 + 볼륨 차트

프로필
 └─ 통계 그리드 (streak, 총 횟수, 볼륨, 세트)
```

---

## Interaction & Motion

- **세트 완료**: 행 배경 흰색 → `#ECFDF5` 전환, 체크 아이콘 scale 0 → 1, 200ms spring
- **버튼 탭**: `scale(0.97)` 80ms, 복귀 150ms ease-out
- **카드 hover**: border-color + shadow 전환 150ms ease
- **바텀시트 진입**: translateY(100%) → 0, 300ms cubic-bezier(0.32, 0.72, 0, 1)
- **페이지 전환**: slide + fade, 220ms ease-out
- **타이머 완료**: `navigator.vibrate([100, 50, 100])` + warning color pulse

---

## 디자인 레퍼런스

- **Nike Training Club** — 카드 레이아웃, 여백감
- **Strava** — 통계 표현, 진행률 시각화
- **Apple Fitness+** — 타이포그래피, 애니메이션 품질
- **Linear** — 인터랙션 세련도, 미니멀리즘
