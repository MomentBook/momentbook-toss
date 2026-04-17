# MomentBook Product Definition

- Status: Living document
- Last updated: 2026-04-18
- Document type: working product brief + current-scope requirements

## Purpose

이 문서는 MomentBook가 무엇을 만들고 있는지, 현재 저장소가 어디까지 구현했는지, 다음 의사결정을 어떤 기준으로 내려야 하는지를 한곳에 정리합니다.
사람과 에이전트가 같은 제품 맥락을 공유하는 것이 목적입니다.

## What MomentBook is

MomentBook는 여행 또는 이벤트 후에 쌓인 사진 묶음을 빠르게 "이야기 단위의 순간들"로 정리해 주는 Apps in Toss 미니앱입니다.
사용자는 빈 에디터에서 시작하지 않고, 사진을 고른 뒤 자동 정리된 초안을 확인하고, 공유 가능한 형태의 결과를 미리 보게 됩니다.

현재 저장소의 구현은 완전한 게시 시스템이라기보다, 이 가치 제안을 검증하기 위한 고품질 프로토타입에 가깝습니다.

## Evidence base

이 문서는 다음 근거를 바탕으로 작성했습니다.

- 코드베이스 직접 검토
- Apps in Toss 공식 WebView, Config, Permission, Photo, Environment, Haptic 문서
- Toss Design System 공식 문서
- React 공식 상태 관리 문서
- ADR 작성 관행에 대한 Michael Nygard의 원문
- 제품 문서 구조에 대한 Atlassian의 PRD/Product Discovery 자료
- 개인 디지털 사진 사용과 여행 사진 편집 경험에 대한 연구 자료

## Product problem

MomentBook가 해결하려는 문제는 "사진을 많이 찍는 것"이 아니라 "많이 찍은 뒤 다시 의미 있게 정리하지 못하는 것"입니다.

연구는 개인 디지털 사진이 기억, 공유, 회상, 실용 목적 등 여러 쓰임을 갖는다고 설명합니다.
또한 여행 사진 편집과 재구성 과정 자체가 여행 경험과 기억 형성에 영향을 줄 수 있습니다.
따라서 MomentBook의 핵심 가치는 사진 저장소를 하나 더 만드는 것이 아니라, 정리와 회상의 마찰을 줄여 사용자가 기록을 끝낼 수 있게 돕는 데 있습니다.

## Target user

### Primary

짧은 여행, 데이트, 행사, 주말 외출 후 10~60장의 사진을 남긴 Toss 사용자

### Secondary

Sandbox 또는 브라우저 미리보기에서 플로우를 검증하는 내부 팀, 디자이너, 개발자

## Jobs to be done

- 사진을 하나하나 수동으로 정리하지 않고도 "이번 여행을 한 번에 회고"하고 싶다.
- SNS 게시글보다는 덜 무겁고, 앨범 앱보다는 더 이야기적인 결과를 빠르게 얻고 싶다.
- 나중에 다시 봤을 때 사진 묶음이 아니라 장면 단위의 기억으로 떠오르게 만들고 싶다.

## Product principles

- 사진 선택 뒤 바로 가치가 보여야 한다.
- 빈 캔버스 대신 초안을 먼저 보여준다.
- 자동 정리는 사용자를 대체하는 것이 아니라 시작점을 제공해야 한다.
- Toss 안에서 어색하지 않은 신뢰감과 모바일 사용성을 유지한다.
- 현재 단계에서는 "완벽한 AI"보다 "낮은 마찰과 높은 완성률"을 우선한다.

## Current implementation snapshot

현재 코드가 실제로 제공하는 경험은 아래와 같습니다.

| Step | Current behavior | Implementation anchor |
| --- | --- | --- |
| Upload | 브라우저 파일 또는 Toss 앨범 사진을 고른다 | `src/App.tsx`, `src/screens/UploadScreen.tsx`, `src/lib/appsInToss.ts` |
| Review | 선택한 사진 수, 범위, 일부 썸네일을 확인한다 | `src/screens/ReviewScreen.tsx` |
| Organizing | 3단계 진행 UI를 보여준 뒤 초안을 만든다 | `src/screens/OrganizingScreen.tsx`, `src/lib/momentbook.ts` |
| Timeline | 최대 4개의 moment 카드로 묶인 프리뷰를 보여준다 | `src/screens/TimelineScreen.tsx` |
| Publish | 실제 게시가 아니라 게시 결과 프리뷰 상태를 보여준다 | `src/screens/PublishScreen.tsx` |

추가로 현재 앱은 `browser`, `sandbox`, `toss` 실행 환경을 구분합니다.

## Scope for the current repository

### In scope

- 모바일 우선 WebView 경험
- 사진 선택과 기본 검토
- 로컬 정렬 및 moment grouping
- 타임라인 프리뷰
- 게시 완료처럼 보이는 결과 화면
- Toss 런타임 감지와 햅틱 피드백
- TDS 기반 CTA와 로딩 인터랙션

### Out of scope

- 실제 서버 저장
- 실제 게시 URL 생성
- 사용자 계정 기반 draft 복원
- 협업 앨범
- 고급 AI 캡션/요약 생성
- 분석 이벤트 설계 및 대시보드
- 콘텐츠 moderation 파이프라인

## Functional requirements

### FR-1 Photo intake

사용자는 브라우저 또는 Toss 런타임에서 사진을 선택할 수 있어야 합니다.

### FR-2 Fast first value

사진을 고른 직후 사용자는 "정리 가능한 단위"와 예상 결과를 빠르게 이해할 수 있어야 합니다.

### FR-3 Guided review

정리 전 단계에서 사진 수, 일부 썸네일, 정리 방식에 대한 설명을 확인할 수 있어야 합니다.

### FR-4 Automatic draft creation

시스템은 선택된 사진을 시간/순서 기반으로 정렬하고 소수의 moment로 묶은 draft를 생성해야 합니다.

### FR-5 Timeline preview

사용자는 결과를 게시 전 타임라인 형태로 검토할 수 있어야 합니다.

### FR-6 Safe simulation

현재 단계에서 publish는 실제 게시처럼 오인되면 안 되며, 프리뷰 성격이 명확해야 합니다.

### FR-7 Runtime adaptation

브라우저 환경과 Toss 환경에서 동일한 사용자 흐름을 유지하되, 사용 가능한 시스템 기능은 환경에 맞게 다르게 동작해야 합니다.

## Non-functional requirements

- 모바일 우선 인터페이스여야 한다.
- 브라우저 미리보기와 Toss 런타임 사이의 동작 차이가 최소화돼야 한다.
- 중요한 액션은 TDS 컴포넌트를 우선 사용한다.
- 사진 정리 시작부터 초안 확인까지의 체감 시간이 짧아야 한다.
- 잘못된 화면 진입이 발생해도 안전하게 앞 단계로 되돌려야 한다.

## Known delivery gaps

현재 코드와 문서 사이에서 반드시 기억해야 할 격차가 있습니다.

- `granite.config.ts`의 `permissions`는 비어 있지만, 실제 Toss 사진 흐름은 `photos` 권한 검토가 필요할 가능성이 높습니다.
- `granite.config.ts`의 `appName`은 현재 `MomentBook`입니다. Toss 콘솔 ID와 정확히 일치하는지 별도 확인이 필요합니다.
- `README.md`에는 오래된 설명이 남아 있습니다. 현재 저장소는 이미 TDS 패키지를 사용합니다.
- 한국어 UI 문자열 일부가 mojibake 상태입니다.
- `publish` 단계는 실제 게시 기능이 아니라 시간 지연이 있는 시뮬레이션입니다.
- 웹 빌드 결과 메인 청크가 큽니다. 추후 code splitting 검토가 필요합니다.

## Success metrics

초기 단계에서는 아래 지표가 적절합니다.

- 사진 선택 후 타임라인 프리뷰 도달률
- 사진 선택 후 타임라인 프리뷰 도달 시간
- 사용자가 "정리 결과가 이해된다"고 느끼는 정성 피드백
- publish 프리뷰까지 진행한 세션 비율
- 사진 재선택 비율

## Decision triggers for the next phase

아래 신호가 보이면 제품과 아키텍처를 한 단계 올릴 시점입니다.

- 사용자가 실제 저장/공유를 반복적으로 요구한다
- 로컬 휴리스틱 품질이 기대치에 미치지 못한다
- 한 번 만든 draft를 다시 열고 싶다는 요구가 많다
- moment grouping 기준이 시간 외 신호를 필요로 한다
- 실기기 테스트에서 권한, 성능, 브릿지 경험 이슈가 반복된다

## Open questions

- publish의 실제 정의는 무엇인가. Toss 내부 공유인가, 외부 링크인가, 개인 보관인가?
- moment grouping은 시간 기준만으로 충분한가?
- 사진 수가 60장 이상일 때도 같은 UX가 유지되는가?
- 사용자가 자동 결과를 얼마나 수정하고 싶어 하는가?
- 여행 외의 사용 사례도 제품 범위에 포함할 것인가?

## Working references

- Apps in Toss WebView guide: https://developers-apps-in-toss.toss.im/tutorials/webview.html
- Apps in Toss Config: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/Config.html
- Apps in Toss permissions: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B6%8C%ED%95%9C/permission.html
- Apps in Toss fetchAlbumPhotos: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%82%AC%EC%A7%84/fetchAlbumPhotos.html
- Apps in Toss getOperationalEnvironment: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%ED%99%98%EA%B2%BD%20%ED%99%95%EC%9D%B8/getOperationalEnvironment.html
- Apps in Toss generateHapticFeedback: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%9D%B8%ED%84%B0%EB%A0%89%EC%85%98/generateHapticFeedback.html
- TDS overview: https://developers-apps-in-toss.toss.im/design/components.html
- TDS WebView guide: https://developers-apps-in-toss.toss.im/design_tutorials/webview.html
- TDS Button: https://tossmini-docs.toss.im/tds-mobile/components/button/
- TDS FixedBottomCTA: https://tossmini-docs.toss.im/tds-mobile/components/BottomCTA/fixed-bottom-cta/
- TDS Loader: https://tossmini-docs.toss.im/tds-mobile/components/loader/
- React `useReducer`: https://react.dev/reference/react/useReducer
- React `startTransition`: https://react.dev/reference/react/startTransition
- Michael Nygard on ADRs: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- Atlassian Product Requirements Blueprint: https://confluence.atlassian.com/docm/latest/product-requirements-blueprint-941593325.html
- Atlassian Product Discovery handbook: https://support.atlassian.com/jira-product-discovery/docs/the-product-management-handbook/
- From PhotoWork to PhotoUse: https://www.tandfonline.com/doi/abs/10.1080/0144929X.2017.1288266
- The influence of travel photo editing on tourists' experiences: https://www.sciencedirect.com/science/article/pii/S0261517723000444
