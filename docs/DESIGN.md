# MomentBook Toss Design

- Status: Living document
- Last updated: 2026-06-10
- Role: product, architecture, and agent-work source of truth for this repository

## Purpose

MomentBook Toss는 Apps in Toss 안에서 사용자가 여행 사진을 고르고, 직접
모먼트 단위로 정리한 뒤, 비공개 여정으로 서버에 저장하는 모바일 우선
WebView 미니앱입니다.

사용자는 EXIF, 위치 정보, 자동 클러스터링에 의존하지 않고도 자신의 여행을
사진과 짧은 기록으로 정리할 수 있어야 합니다. 이 흐름의 목적은 앱 설치 전
탐색형 acquisition에 머무는 것이 아니라, Toss 안에서 바로 "사진 묶음이
타임라인 기록으로 정리되는" 핵심 작업을 완료하게 하는 것입니다.

출시 목표는 Toss 로그인으로 사용자를 식별하고, 정리한 여정을 비공개 서버
저장 상태로 남기는 것입니다. 공개 URL 생성, 공개 게시, 네이티브 앱 계정
자동 연결은 이번 Toss 미니앱 출시 흐름 밖에 둡니다.

현재 코드 구현은 아직 비공개 초안 완료 시뮬레이션 단계입니다. 실제 Toss
로그인 token exchange, 서버 업로드 API 호출, 서버 저장 완료 상태는 ADR
0009의 계약에 맞춰 후속 구현에서 추가합니다.

## Product Principles

- Toss 안에서는 공개보다 비공개 서버 저장 완료를 우선합니다.
- 사진 선택부터 업로드까지 한 번에 이해되는 짧은 4단계 흐름을 유지합니다.
- EXIF, 위치, 자동 클러스터링이 없더라도 사용자가 직접 모먼트를 만들 수 있어야 합니다.
- 선택했지만 모먼트에 넣지 않은 사진은 버리지 않고 미정리 사진으로 함께 저장합니다.
- Toss 로그인은 사용자를 식별하기 위한 진입점이며, 토큰 교환과 토큰 보관은 서버 책임입니다.
- 공개 URL, 공개 게시, 네이티브 계정 자동 연결은 사용자에게 완료된 것처럼 보이면 안 됩니다.
- 네이티브 MomentBook의 calm, artifact-first, mobile-first 톤을 유지합니다.
- Toss 안에서 어색하지 않도록 TDS Mobile과 Apps in Toss 패턴을 우선 사용합니다.
- UX/UI 작업은 Apple-inspired 방향을 따르되, Apple 브랜드나 네이티브 iOS 화면을 복제하지 않습니다.

## Apple-Inspired UX/UI Direction

MomentBook Toss의 Apple 스타일은 장식적인 모방이 아니라, 사진과 여정 결과물이 먼저 보이는 조용한 인터페이스, 명확한 정보 구조, 정밀한 간격, 읽기 쉬운 타이포그래피, 부드럽지만 절제된 피드백을 의미합니다.

이 방향은 TDS Mobile과 Apps in Toss 런타임 위에 얹는 제품 디자인 기준입니다. TDS 컴포넌트, Toss 권한/런타임 제약, 비공개 서버 저장 제품 범위를 Apple 스타일보다 우선합니다.

### Experience Principles

- 화면은 항상 "현재 어디인가", "무엇을 할 수 있는가", "다음에 어디로 갈 수 있는가"를 즉시 답해야 합니다.
- 여정 사진, 타임라인, 사용자가 만든 모먼트가 주인공입니다. 내비게이션, 설명, 배지는 콘텐츠를 보조하는 얇은 레이어로 둡니다.
- 한 화면의 주요 CTA는 하나만 선명하게 둡니다. 보조 액션은 시각적 무게를 낮추고, 공개 게시나 네이티브 계정 연결처럼 범위 밖 기능으로 오해될 표현을 피합니다.
- 사용자가 선택한 사진, 대표 이미지, 모먼트 구성은 직접 조작하는 느낌이 나야 합니다. 선택/해제/정렬/편집 상태는 즉각적인 시각 피드백과 햅틱 가능 지점으로 연결합니다.
- 빈 상태, 오류, 권한 거부, 브라우저 fallback은 차분하고 구체적으로 다음 행동을 제시합니다.

### Visual Language

- 배경은 밝고 깨끗한 중립 표면을 기본으로 하며, 사진과 사용자 콘텐츠에서 색이 나오게 합니다.
- Apple-like material은 floating navigation, bottom CTA, small control cluster처럼 콘텐츠 위에 떠야 하는 레이어에만 제한적으로 사용합니다. 콘텐츠 카드, 목록, 타임라인 전체를 과도한 blur/glass로 덮지 않습니다.
- glass-on-glass, blur-on-blur, 낮은 대비의 반투명 텍스트는 금지합니다. 반투명 표면을 쓰면 배경 밝기, 다크 모드, 이미지 위 배치에서 대비를 확인합니다.
- 둥근 모서리는 부모/자식 요소가 같은 중심을 공유하는 concentric geometry처럼 보이게 맞춥니다. 반지름은 임의로 섞지 말고 TDS 토큰이나 기존 로컬 값을 우선합니다.
- 그림자는 깊이를 설명할 때만 사용합니다. 장식적 elevation을 여러 겹 쌓지 않습니다.
- 색상 강조는 primary CTA, 선택 상태, 위험/주의 상태처럼 기능적 의미가 있을 때만 씁니다. 모든 요소를 같은 accent로 물들이지 않습니다.

### Layout And Typography

- 모바일 단일 컬럼을 기본으로 하며, 주요 콘텐츠는 확대나 가로 스크롤 없이 보여야 합니다.
- 터치 타깃은 최소 44 x 44 CSS px 수준을 목표로 하고, TDS 컴포넌트가 제공하는 기본 hit area를 축소하지 않습니다.
- 본문과 입력 텍스트는 시스템 sans stack과 TDS typography를 우선합니다. 작은 보조 텍스트도 일반적인 모바일 시청 거리에서 확대 없이 읽혀야 합니다.
- 화면 제목, 섹션 제목, 설명, CTA의 계층을 명확히 분리합니다. 브랜드성 큰 제목보다 현재 작업 맥락을 알려주는 제목을 우선합니다.
- 한국어 문구는 줄바꿈과 장문 overflow를 먼저 고려합니다. 고정 높이 버튼, chip, pill 안에서 텍스트가 잘리거나 겹치면 레이아웃을 바꿉니다.
- 이미지와 미디어는 원본 비율을 유지하고, Retina급 밀도에서 흐릿해 보이지 않도록 충분한 해상도나 명확한 placeholder를 사용합니다.

### Motion And Feedback

- 전환은 상태 변화의 방향을 설명해야 합니다. 단순 장식 애니메이션이나 느린 등장 효과는 피합니다.
- 버튼, 선택 카드, 사진 썸네일은 눌림/선택/비활성/로딩 상태를 분명히 보여줍니다.
- Toss 햅틱은 성공, 선택, 완료처럼 사용자가 결과를 기대하는 순간에만 절제해서 사용합니다.
- reduced motion, reduced transparency, increased contrast 사용자를 고려해 motion과 glass 효과가 없어도 정보 구조가 유지되어야 합니다.

### Apple-Style UI Review Checklist

- 첫 화면에서 현재 단계, 핵심 콘텐츠, 다음 CTA가 즉시 보이는가?
- 사진/타임라인보다 설명 박스, 장식, 배지가 더 눈에 띄지 않는가?
- primary CTA는 하나이며, 공개 게시나 네이티브 계정 연결처럼 범위 밖 결과를 암시하지 않는가?
- 모든 터치 컨트롤은 44 x 44 CSS px 수준의 hit area를 가지는가?
- 한국어 장문, 작은 화면, 다크 모드, 이미지 위 텍스트에서 대비와 overflow가 안전한가?
- bottom CTA, modal, sheet, toast, 권한 fallback이 기존 TDS/Apps in Toss 패턴과 충돌하지 않는가?
- glass/blur/material은 계층을 더 명확히 만드는 곳에만 쓰였고, glass-on-glass가 없는가?
- `browser`, `sandbox`, `toss` 런타임에서 같은 핵심 행동을 완료할 수 있는가?

## Current Scope

### In Scope

- Apps in Toss WebView 기반 모바일 우선 비공개 저장 flow
- 브라우저 파일 또는 Toss 앨범 사진 선택
- Toss 로그인 authorization code 획득과 서버 전달
- 여정 제목, 설명, 대표 사진 설정
- 기본 3개 모먼트에서 시작하는 수동 moment grouping과 메모 입력
- 필요할 때 모먼트 추가
- 선택했지만 모먼트에 담지 않은 사진의 미정리 사진 저장
- 비공개 타임라인 프리뷰와 서버 업로드 전 최종 확인
- 비공개 서버 저장 완료 상태
- Toss 런타임 감지와 햅틱 피드백
- TDS 기반 CTA, 버튼, 입력 컴포넌트 활용

### Out Of Scope

- 공개 게시 URL 생성
- 공개 여정 게시
- WebView 클라이언트에서 Toss token exchange 직접 처리
- WebView 클라이언트에서 access token 또는 refresh token 장기 저장
- 네이티브 앱 계정과 Toss 유저 자동 연동
- 공개 여정 생성/수정/삭제 API
- 사용자 계정 기반 draft 복원
- 협업 앨범
- 고급 AI 캡션/요약 생성
- EXIF/GPS 기반 자동 클러스터링
- 분석 이벤트 설계 및 대시보드
- 콘텐츠 moderation 파이프라인
- admin/backoffice/web CMS/SEO-only surface
- Apple 브랜드, Apple 자산, 네이티브 iOS 화면의 직접 복제
- CSS만으로 구현한 과도한 Liquid Glass 클론이나 읽기성을 낮추는 장식형 blur

## Target Launch Flow

| Step | Behavior | Implementation anchor |
| --- | --- | --- |
| Photo intake | 브라우저 파일 또는 Toss 앨범 사진을 선택하고 미리보기로 확인합니다. | `src/App.tsx`, `src/screens/UploadScreen.tsx`, `src/lib/appsInToss.ts` |
| Journey basics | 여정 제목, 설명, 대표 사진을 짧게 정합니다. | `src/screens/OrganizingScreen.tsx`, `src/lib/momentbook.ts` |
| Moment compose | 기본 3개 모먼트에 사진과 메모를 담고 필요하면 모먼트를 추가합니다. 미정리 사진은 함께 저장됩니다. | `src/screens/OrganizingScreen.tsx`, `src/lib/momentbook.ts` |
| Review upload | 타임라인과 미정리 사진 수를 확인하고 Toss 로그인 후 비공개 서버 저장을 완료합니다. | `src/screens/TimelineScreen.tsx`, `src/screens/PrivateDraftScreen.tsx` |

## Current Implementation State

현재 코드의 화면 구조는 아직 ADR 0006 기반의 private draft simulation입니다.

- 공개 예시 탐색 화면이 첫 진입점입니다.
- 사진 선택, 여정 정보, 수동 모먼트 구성, 타임라인 미리보기 구조는 재사용 가능합니다.
- 모먼트는 고정 4개 슬롯이며 추가/삭제 흐름이 없습니다.
- 모든 사진을 모먼트에 담아야 타임라인으로 넘어갑니다.
- 완료 화면은 서버 업로드나 공개 URL을 만들지 않는 비공개 초안 완료 시뮬레이션입니다.
- 후속 구현은 ADR 0009를 기준으로 화면 순서, CTA copy, 저장 상태, auth/upload adapter를 갱신해야 합니다.

## Architecture

이 저장소는 Vite, React 18, TypeScript, `@apps-in-toss/web-framework`, `@toss/tds-mobile` 기반의 작은 Apps in Toss WebView 앱입니다.

- 기준 런타임은 Apps in Toss WebView SDK + Granite 설정입니다.
- `granite.config.ts`는 앱 진입 계약, 브랜드, 권한, WebView 실행 설정을 담당합니다.
- 현재 `src/App.tsx`는 reducer 상태, 화면 접근 제어, hash/history 네비게이션을 함께 관리합니다.
- `src/lib/navigation.ts`는 화면 union, 순서, 메타데이터, 접근 규칙을 작게 유지합니다.
- `src/lib/appsInToss.ts`는 Toss SDK 접근을 얇은 어댑터 뒤에 둡니다.
- `src/lib/momentbook.ts`는 현재 비공개 초안과 수동 모먼트 구성 로직을 담당합니다.
- `src/screens/*`는 가능한 한 표현 계층으로 유지합니다.
- 후속 업로드 구현에서는 Toss login adapter, 서버 업로드 client, retry/error 상태를 화면 표현 계층과 분리합니다.

## Accepted Decisions

- ADR 0001: Apps in Toss WebView 런타임과 Granite 설정을 기준으로 사용합니다.
- ADR 0002: TDS Mobile을 기본 UI 언어로 사용하고 모바일 우선 인터페이스를 유지합니다.
- ADR 0003: 흐름 제어는 로컬 reducer 상태와 가벼운 hash navigation으로 관리합니다.
- ADR 0005: WebView 번들에는 공개 가능한 서버 URL만 환경별로 주입합니다.
- ADR 0006: 과거 Toss v1은 비공개 수동 초안 구성으로 유지했습니다.
- ADR 0008: `AGENTS.md`와 `docs/CODEX.md`의 역할을 분리합니다.
- ADR 0009: 출시 목표는 Toss 로그인 기반 비공개 서버 저장 flow입니다.

ADR 0004는 ADR 0006으로 대체되었고, ADR 0006은 ADR 0009로 대체되었습니다.

## High-Risk Invariants

### Runtime

- `browser`, `sandbox`, `toss` 실행 컨텍스트를 모두 고려합니다.
- `granite.config.ts`의 `appName`은 Toss 콘솔 앱 ID와 정확히 일치해야 합니다. 현재 값은 `MomentBook`입니다.
- 사진 API를 사용하는 흐름은 `photos: read` 권한과 Toss 콘솔 설정의 정합성을 함께 확인합니다.
- Apps in Toss SDK, Granite 설정, TDS 컴포넌트 동작은 추측하지 말고 공식 문서로 확인합니다.

### Data And Product Contract

- 출시 목표의 완료 상태는 실제 공개가 아니라 비공개 서버 저장 완료입니다.
- 현재 코드의 완료 상태는 아직 비공개 초안 완료 시뮬레이션입니다.
- 공개 URL, 공개 게시, 네이티브 계정 자동 연결은 구현하지 않습니다.
- Toss `authorizationCode`는 클라이언트에서 오래 보관하지 않고 서버로 전달합니다.
- Toss token exchange, access token 발급, refresh token 보관은 반드시 서버에서 처리합니다.
- 기존 비공개 저장 API의 endpoint, request, response shape는 코드 구현 단계에서 실제 계약을 확인한 뒤 반영합니다.
- 클라이언트 번들에는 공개 가능한 `VITE_*` 값만 넣고 서버 비밀값을 넣지 않습니다.
- EXIF/GPS 기반 자동 grouping에 제품 흐름을 묶지 않습니다.
- 사용자가 선택한 사진은 모먼트에 담지 않았더라도 미정리 사진으로 함께 저장합니다.
- 잘못된 화면 진입은 접근 가능한 단계로 안전하게 되돌립니다.

### UI

- 모바일 우선 단일 컬럼 UX를 유지합니다.
- 주요 액션은 TDS Mobile 컴포넌트를 우선 사용합니다.
- Apple-inspired 스타일은 TDS Mobile의 접근성, 상태, CTA semantics를 대체하지 않습니다.
- glass, blur, motion, tint를 추가할 때는 대비, reduced motion/transparency fallback, 한국어 overflow를 함께 확인합니다.
- 사용자가 실제 공개가 완료됐다고 오해할 수 있는 카피나 CTA를 피합니다.
- 업로드 화면은 저장 전 확인, 로그인, 업로드 진행, 실패 후 재시도, 저장 완료 상태를 명확히 구분합니다.
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

문서와 Stitch만 변경한 작업은 `rg` 참조 확인과 Stitch `get_screen` 확인을 기본 검증으로 합니다. 실제 UI 코드, Toss login, 업로드 client 구현으로 넘어가면 `yarn lint`와 `yarn build:web`를 기본으로 실행합니다. `yarn dev`와 `yarn build`는 Apps in Toss 런타임과 콘솔 설정 의존성이 더 크므로 플랫폼 연동 변경 시 추가 검증합니다.

## Open Questions

- 비공개 저장 API의 정확한 endpoint, 요청/응답 shape, 업로드 방식은 무엇인가?
- Toss 로그인 authorization code를 전달받는 서버 endpoint와 세션 발급 방식은 무엇인가?
- 서버 저장 실패 후 재시도 시 사진 payload를 얼마나 오래 메모리에 유지할 것인가?
- 비공개 저장된 여정을 Toss 안에서 다시 열 수 있는 복원 계약이 필요한가?
- 공개 예시 데이터는 언제 서버 기반 public journey로 대체할 것인가?

## Working References

- Apps in Toss WebView guide: https://developers-apps-in-toss.toss.im/tutorials/webview.html
- Apps in Toss permissions: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B6%8C%ED%95%9C/permission.html
- Apps in Toss fetchAlbumPhotos: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%82%AC%EC%A7%84/fetchAlbumPhotos.html
- Apps in Toss appLogin: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EB%A1%9C%EA%B7%B8%EC%9D%B8/appLogin.html
- TDS FixedBottomCTA: https://tossmini-docs.toss.im/tds-mobile/components/BottomCTA/fixed-bottom-cta/
- TDS TextArea: https://tossmini-docs.toss.im/tds-mobile/components/TextField/text-area/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple UI Design Dos and Don'ts: https://developer.apple.com/design/tips/
- Apple Design Resources: https://developer.apple.com/design/resources/
- Apple WWDC25, "Meet Liquid Glass": https://developer.apple.com/videos/play/wwdc2025/219/
- Apple WWDC25, "Get to know the new design system": https://developer.apple.com/videos/play/wwdc2025/356/
- Apple WWDC25, "Design foundations from idea to interface": https://developer.apple.com/videos/play/wwdc2025/359/
- Nielsen Norman Group, "Design Systems 101": https://www.nngroup.com/articles/design-systems-101/
