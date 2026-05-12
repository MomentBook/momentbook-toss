# MomentBook Toss Design

- Status: Living document
- Last updated: 2026-05-12
- Role: product, architecture, and agent-work source of truth for this repository

## Purpose

MomentBook Toss는 Apps in Toss 안에서 MomentBook 네이티브 앱의 핵심 경험을 가볍게 보여주는 모바일 우선 WebView acquisition 미니앱입니다.

사용자는 다른 사람이 만든 공개 여정 예시를 둘러본 뒤, 자신의 사진으로 비공개 여정 초안을 직접 구성합니다. 이 흐름의 목적은 앱 설치 전에도 "여정은 사진 묶음이 아니라 모먼트 단위의 결과물"이라는 감각을 빠르게 경험하게 하는 것입니다.

현재 단계의 Toss 미니앱은 실제 공개 서비스가 아닙니다. 서버 공개, Toss 로그인 기반 계정 연결, 공개 URL 생성은 사업자 등록과 인증/서버 계약이 준비된 뒤 별도 결정으로 진행합니다.

## Product Principles

- 공개 예시는 완성된 여정 결과물을 중심으로 보여줍니다.
- Toss 안에서는 공개보다 비공개 초안 완성을 우선합니다.
- EXIF, 위치, 자동 클러스터링이 없더라도 사용자가 직접 모먼트를 만들 수 있어야 합니다.
- 서버 업로드, 공개 URL, Toss 로그인 연동은 실제 계약이 준비되기 전까지 제품에서 숨깁니다.
- 네이티브 MomentBook의 calm, artifact-first, mobile-first 톤을 유지합니다.
- Toss 안에서 어색하지 않도록 TDS Mobile과 Apps in Toss 패턴을 우선 사용합니다.

## Current Scope

### In Scope

- Apps in Toss WebView 기반 모바일 우선 acquisition flow
- MomentBook 공개 여정 예시 탐색
- 브라우저 파일 또는 Toss 앨범 사진 선택
- 공개나 로그인 없는 여정 제목, 설명, 대표 사진 설정
- 수동 moment grouping과 메모 입력
- 비공개 타임라인 프리뷰
- 비공개 초안 완료 시뮬레이션
- Toss 런타임 감지와 햅틱 피드백
- TDS 기반 CTA, 버튼, 입력 컴포넌트 활용

### Out Of Scope

- 실제 서버 저장
- 실제 게시 URL 생성
- Toss 로그인 `authorizationCode` 처리 또는 토큰 교환
- 네이티브 앱 계정과 Toss 유저 자동 연동
- 공개 여정 생성/수정/삭제 API
- 사용자 계정 기반 draft 복원
- 협업 앨범
- 고급 AI 캡션/요약 생성
- EXIF/GPS 기반 자동 클러스터링
- 분석 이벤트 설계 및 대시보드
- 콘텐츠 moderation 파이프라인
- admin/backoffice/web CMS/SEO-only surface

## Current Flow

| Step | Behavior | Implementation anchor |
| --- | --- | --- |
| Discover | 공개 여정 예시 목록과 상세 타임라인을 둘러봅니다. | `src/screens/DiscoverScreen.tsx`, `src/screens/FeaturedJourneyScreen.tsx`, `src/lib/featuredJourneys.ts` |
| Photo intake | 브라우저 파일 또는 Toss 앨범 사진을 선택하고 미리보기로 확인합니다. | `src/App.tsx`, `src/screens/UploadScreen.tsx`, `src/lib/appsInToss.ts` |
| Private organizing | 제목, 설명, 대표 사진, 모먼트별 사진/메모를 직접 구성합니다. | `src/screens/OrganizingScreen.tsx`, `src/lib/momentbook.ts` |
| Timeline preview | 사용자가 직접 구성한 비공개 여정 초안을 타임라인으로 확인합니다. | `src/screens/TimelineScreen.tsx` |
| Private draft completion | 공개 없이 비공개 초안 완료 상태를 보여줍니다. | `src/screens/PrivateDraftScreen.tsx` |

## Architecture

이 저장소는 Vite, React 18, TypeScript, `@apps-in-toss/web-framework`, `@toss/tds-mobile` 기반의 작은 Apps in Toss WebView 앱입니다.

- 기준 런타임은 Apps in Toss WebView SDK + Granite 설정입니다.
- `granite.config.ts`는 앱 진입 계약, 브랜드, 권한, WebView 실행 설정을 담당합니다.
- `src/App.tsx`는 reducer 상태, 화면 접근 제어, hash/history 네비게이션을 함께 관리합니다.
- `src/lib/navigation.ts`는 화면 union, 순서, 메타데이터, 접근 규칙을 작게 유지합니다.
- `src/lib/appsInToss.ts`는 Toss SDK 접근을 얇은 어댑터 뒤에 둡니다.
- `src/lib/momentbook.ts`는 비공개 초안과 수동 모먼트 구성 로직을 담당합니다.
- `src/screens/*`는 가능한 한 표현 계층으로 유지합니다.

## Accepted Decisions

- ADR 0001: Apps in Toss WebView 런타임과 Granite 설정을 기준으로 사용합니다.
- ADR 0002: TDS Mobile을 기본 UI 언어로 사용하고 모바일 우선 인터페이스를 유지합니다.
- ADR 0003: 흐름 제어는 로컬 reducer 상태와 가벼운 hash navigation으로 관리합니다.
- ADR 0005: WebView 번들에는 공개 가능한 서버 URL만 환경별로 주입합니다.
- ADR 0006: Toss v1은 비공개 수동 여정 구성으로 유지합니다.
- ADR 0007: Codex 중심 문서 체계로 단순화합니다.

ADR 0004는 ADR 0006으로 대체되었습니다.

## High-Risk Invariants

### Runtime

- `browser`, `sandbox`, `toss` 실행 컨텍스트를 모두 고려합니다.
- `granite.config.ts`의 `appName`은 Toss 콘솔 앱 ID와 정확히 일치해야 합니다. 현재 값은 `MomentBook`입니다.
- 사진 API를 사용하는 흐름은 `photos: read` 권한과 Toss 콘솔 설정의 정합성을 함께 확인합니다.
- Apps in Toss SDK, Granite 설정, TDS 컴포넌트 동작은 추측하지 말고 공식 문서로 확인합니다.

### Data And Product Contract

- 완료 상태는 실제 게시가 아니라 비공개 초안 완료 시뮬레이션입니다.
- 서버 저장, 공개 URL, Toss 로그인 토큰 교환, 네이티브 계정 연결은 구현하지 않습니다.
- 클라이언트 번들에는 공개 가능한 `VITE_*` 값만 넣고 서버 비밀값을 넣지 않습니다.
- EXIF/GPS 기반 자동 grouping에 제품 흐름을 묶지 않습니다.
- 잘못된 화면 진입은 접근 가능한 단계로 안전하게 되돌립니다.

### UI

- 모바일 우선 단일 컬럼 UX를 유지합니다.
- 주요 액션은 TDS Mobile 컴포넌트를 우선 사용합니다.
- 사용자가 실제 공개가 완료됐다고 오해할 수 있는 카피나 CTA를 피합니다.
- 한국어 UI 문자열 일부가 mojibake 상태일 수 있습니다. 관련 작업이 아니면 incidental rewrite하지 않습니다.

### Agent And Documentation

- `AGENTS.md`는 Codex 자동 로드용 지도입니다. 길게 확장하지 않습니다.
- 제품 목적, 범위, 설계 불변조건은 이 문서에 둡니다.
- 지속되는 기술 결정은 ADR로 남깁니다.
- 비자명한 작업은 `docs/ai/`에 짧은 작업 로그를 남깁니다.

## Verification Commands

- `yarn lint`: ESLint check
- `yarn build:web`: TypeScript build plus Vite static build
- `yarn dev:web`: direct local web preview
- `yarn dev`: Apps in Toss local development via Granite
- `yarn build`: Apps in Toss artifact build via `ait build`

`yarn lint`와 `yarn build:web`는 2026-05-10 기준 로컬에서 확인됐습니다. `yarn dev`와 `yarn build`는 Apps in Toss 런타임과 콘솔 설정 의존성이 더 크므로 플랫폼 연동 변경 시 추가 검증합니다.

## Open Questions

- MomentBook 네이티브 앱으로 전환하는 CTA는 어떤 URL/deep link 계약을 사용할 것인가?
- Toss 로그인 연동이 가능해진 뒤 공개 기능은 Toss 미니앱에서 실행할 것인가, 네이티브 앱으로 넘길 것인가?
- 비공개 초안을 로컬 스토리지에 복원 가능하게 저장할 필요가 있는가?
- 모먼트 수는 고정 슬롯이 적절한가, 사용자가 직접 추가/삭제해야 하는가?
- 공개 예시 데이터는 언제 서버 기반 public journey로 대체할 것인가?

## Working References

- Apps in Toss WebView guide: https://developers-apps-in-toss.toss.im/tutorials/webview.html
- Apps in Toss permissions: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B6%8C%ED%95%9C/permission.html
- Apps in Toss fetchAlbumPhotos: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%82%AC%EC%A7%84/fetchAlbumPhotos.html
- Apps in Toss appLogin: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EB%A1%9C%EA%B7%B8%EC%9D%B8/appLogin.html
- TDS FixedBottomCTA: https://tossmini-docs.toss.im/tds-mobile/components/BottomCTA/fixed-bottom-cta/
- TDS TextArea: https://tossmini-docs.toss.im/tds-mobile/components/TextField/text-area/
