# MomentBook Toss Product Definition

- Status: Living document
- Last updated: 2026-05-10
- Document type: working product brief + current-scope requirements

## Purpose

이 문서는 MomentBook Toss 미니앱이 무엇을 검증하는지, 현재 저장소가 어디까지 구현해야 하는지, 다음 의사결정을 어떤 기준으로 내려야 하는지를 정리합니다.

## What MomentBook Toss Is

MomentBook Toss는 Apps in Toss 안에서 MomentBook 네이티브 앱의 핵심 경험을 가볍게 보여주는 마케팅용 WebView 미니앱입니다.

사용자는 먼저 다른 사람이 만든 공개 여정 예시를 둘러보고, 이어서 자신의 사진으로 비공개 여정 초안을 만들어 봅니다. 이 흐름의 목적은 토스 사용자가 MomentBook의 여정 구조와 결과물 중심 UX를 이해하고, 이후 네이티브 앱 사용자로 전환될 이유를 만드는 데 있습니다.

현재 단계의 Toss 미니앱은 실제 공개 서비스가 아닙니다. 서버 공개, 토스 로그인 기반 계정 연결, 공개 URL 생성은 사업자 등록과 인증/서버 계약이 준비된 뒤 별도 단계로 진행합니다.

## Product Problem

MomentBook의 본 제품 가치는 사진을 많이 찍은 뒤 다시 의미 있게 정리하지 못하는 문제를 줄이는 데 있습니다. Toss 미니앱은 이 전체 제품의 acquisition surface로서, 사용자가 앱 설치 전에도 “여정은 사진 묶음이 아니라 모먼트 단위의 결과물”이라는 감각을 빠르게 경험하도록 합니다.

Apps in Toss 환경에서는 현재 EXIF/위치 메타데이터에 기대지 않는 쪽이 안전합니다. 따라서 이 미니앱의 v1은 자동 정리보다 사용자가 직접 제목, 설명, 대표 사진, 모먼트를 고르는 흐름을 우선합니다.

## Target User

### Primary

MomentBook을 아직 설치하지 않았거나 사용해 보지 않은 Toss 사용자

### Secondary

Toss Sandbox 또는 브라우저 미리보기에서 acquisition flow와 UI를 검증하는 내부 팀, 디자이너, 개발자

## Jobs To Be Done

- 다른 사람이 만든 여행 기록을 보고 MomentBook이 어떤 앱인지 빠르게 이해하고 싶다.
- 내 사진 몇 장으로 MomentBook식 여정 초안을 부담 없이 만들어 보고 싶다.
- 공개나 로그인 없이 먼저 비공개로 구성해 보고, 필요하면 나중에 네이티브 앱에서 이어가고 싶다.

## Product Principles

- 공개 예시는 완성된 여정 결과물을 중심으로 보여준다.
- Toss 안에서는 공개보다 비공개 초안 완성을 우선한다.
- EXIF, 위치, 자동 클러스터링이 없더라도 사용자가 직접 모먼트를 만들 수 있어야 한다.
- 서버 업로드, 공개 URL, 토스 로그인 연동은 실제 계약이 준비되기 전까지 제품에서 숨긴다.
- 네이티브 MomentBook의 calm, artifact-first, mobile-first 톤을 유지한다.
- Toss 안에서 어색하지 않도록 TDS Mobile과 Apps in Toss 패턴을 우선 사용한다.

## Current Implementation Snapshot

| Step | Current behavior | Implementation anchor |
| --- | --- | --- |
| Discover | 공개 여정 예시 목록과 상세 타임라인을 둘러본다 | `src/screens/DiscoverScreen.tsx`, `src/screens/FeaturedJourneyScreen.tsx`, `src/lib/featuredJourneys.ts` |
| Photo intake | 브라우저 파일 또는 Toss 앨범 사진을 선택하고 미리보기로 확인한다 | `src/App.tsx`, `src/screens/UploadScreen.tsx`, `src/lib/appsInToss.ts` |
| Private organizing | 제목, 설명, 대표 사진, 모먼트별 사진/메모를 직접 구성한다 | `src/screens/OrganizingScreen.tsx`, `src/lib/momentbook.ts` |
| Timeline preview | 사용자가 직접 구성한 비공개 여정 초안을 타임라인으로 확인한다 | `src/screens/TimelineScreen.tsx` |
| Private draft completion | 공개 없이 비공개 초안 완료 상태를 보여준다 | `src/screens/PrivateDraftScreen.tsx` |

추가로 현재 앱은 `browser`, `sandbox`, `toss` 실행 환경을 구분합니다.

## Scope For The Current Repository

### In Scope

- Apps in Toss WebView 기반 모바일 우선 acquisition flow
- MomentBook 공개 여정 예시 탐색
- 사진 선택과 기본 검토
- EXIF 없는 수동 여정 정보 입력
- 수동 moment grouping과 메모 입력
- 비공개 타임라인 프리뷰
- 비공개 초안 완료 시뮬레이션
- Toss 런타임 감지와 햅틱 피드백
- TDS 기반 CTA, 버튼, 입력 컴포넌트 활용

### Out Of Scope

- 실제 서버 저장
- 실제 게시 URL 생성
- 토스 로그인 `authorizationCode` 처리 또는 토큰 교환
- 네이티브 앱 계정과 Toss 유저 자동 연동
- 공개 여정 생성/수정/삭제 API
- 사용자 계정 기반 draft 복원
- 협업 앨범
- 고급 AI 캡션/요약 생성
- EXIF/GPS 기반 자동 클러스터링
- 분석 이벤트 설계 및 대시보드
- 콘텐츠 moderation 파이프라인
- admin/backoffice/web CMS/SEO-only surface

## Functional Requirements

### FR-1 Public example discovery

사용자는 MomentBook 네이티브 앱에서 공개될 수 있는 완성형 여정 예시를 Toss 안에서 둘러볼 수 있어야 합니다.

### FR-2 Photo intake

사용자는 브라우저 또는 Toss 런타임에서 사진을 선택할 수 있어야 합니다.

### FR-3 Private draft setup

사용자는 공개나 로그인 없이 여정 제목, 설명, 대표 사진을 정할 수 있어야 합니다.

### FR-4 Manual moment creation

시스템은 EXIF를 전제로 자동 분류하지 않고, 사용자가 사진을 모먼트에 직접 담고 제목/메모를 수정할 수 있어야 합니다.

### FR-5 Timeline preview

사용자는 비공개 초안을 저장하기 전에 타임라인 형태로 결과를 검토할 수 있어야 합니다.

### FR-6 Safe private completion

현재 단계에서 완료는 실제 공개처럼 오인되면 안 되며, 서버 업로드와 공개 URL을 만들지 않는다는 점이 명확해야 합니다.

### FR-7 Runtime adaptation

브라우저 환경과 Toss 환경에서 동일한 사용자 흐름을 유지하되, 사용 가능한 시스템 기능은 환경에 맞게 다르게 동작해야 합니다.

## Non-Functional Requirements

- 모바일 우선 인터페이스여야 한다.
- 브라우저 미리보기와 Toss 런타임 사이의 동작 차이가 최소화돼야 한다.
- 중요한 액션은 TDS 컴포넌트를 우선 사용한다.
- 사진 선택부터 비공개 초안 확인까지의 체감 시간이 짧아야 한다.
- 잘못된 화면 진입이 발생해도 안전하게 앞 단계로 되돌려야 한다.
- 공개/로그인/서버 업로드가 준비되지 않은 상태에서 사용자가 실제 공개가 완료됐다고 오해하지 않게 한다.

## Known Delivery Gaps

- `granite.config.ts`에는 `photos: read` 권한이 선언돼 있습니다. Toss 콘솔과 실환경 권한 동작의 정합성은 계속 확인이 필요합니다.
- `granite.config.ts`의 `appName`은 현재 `MomentBook`입니다. Toss 콘솔 ID와 정확히 일치하는지 별도 확인이 필요합니다.
- 한국어 UI 문자열 일부가 mojibake 상태일 수 있습니다.
- 비공개 초안 완료는 현재 로컬 시뮬레이션이며, 새로고침 후 복원되는 저장소가 아닙니다.
- 공개 기능은 네이티브 앱의 서버/인증 계약과 분리되어 있습니다.
- 웹 빌드 결과 메인 청크가 큽니다. 추후 code splitting 검토가 필요합니다.

## Success Metrics

초기 단계에서는 아래 지표가 적절합니다.

- 공개 예시 상세 진입률
- 공개 예시 탐색 후 비공개 여정 시작률
- 사진 선택 후 타임라인 프리뷰 도달률
- 사진 선택 후 타임라인 프리뷰 도달 시간
- 사용자가 “MomentBook에서 여정을 만들면 어떤 결과가 나오는지 이해된다”고 느끼는 정성 피드백
- 비공개 초안 완료까지 진행한 세션 비율

## Decision Triggers For The Next Phase

아래 신호가 보이면 제품과 아키텍처를 한 단계 올릴 시점입니다.

- 사용자가 실제 공개/공유를 반복적으로 요구한다
- 개인 사업자 등록과 토스 로그인 서버 연동 조건이 충족된다
- 네이티브 앱으로 이어지는 설치/전환 흐름이 명확해진다
- 수동 모먼트 구성만으로는 완성률이 낮다
- Toss 실기기 테스트에서 권한, 성능, 브릿지 경험 이슈가 반복된다

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
- From PhotoWork to PhotoUse: https://www.tandfonline.com/doi/full/10.1080/0144929X.2017.1288266
- The influence of travel photo editing on tourists' experiences: https://www.sciencedirect.com/science/article/pii/S0261517723000444
