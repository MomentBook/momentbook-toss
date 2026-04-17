# ADR 0002: TDS Mobile을 기본 UI 언어로 사용하고 모바일 우선 인터페이스를 유지한다

- Status: Accepted
- Date: 2026-04-18

## Context

MomentBook는 Toss 앱 내부의 WebView에서 사용될 가능성이 높은 서비스입니다.
Apps in Toss 디자인 문서는 TDS를 토스 커뮤니티 전반의 공통 디자인 언어로 설명하며, 일관된 제품 경험과 더 빠른 구현을 장점으로 제시합니다.
또한 WebView 디자인 가이드는 TDS Mobile 사용 시 React 환경과 React 18 호환성을 전제로 하고, 최상위 Provider 설정을 요구합니다.

현재 코드베이스는 이미 그 전제를 상당 부분 채택하고 있습니다.

- `src/main.tsx`에서 `TDSMobileAITProvider`로 앱 전체를 감쌉니다.
- 주요 액션은 `Button`, `FixedBottomCTA`, `Loader` 같은 TDS 컴포넌트를 사용합니다.
- 레이아웃과 브랜딩은 `src/App.css`에서 커스텀하지만, 상호작용 컴포넌트는 TDS에 기대고 있습니다.
- 화면 폭, 하단 CTA, safe area 패딩 등은 모바일 사용 맥락을 전제로 설계되어 있습니다.

## Decision

MomentBook는 TDS Mobile을 기본 UI 언어로 유지합니다.

- 상호작용 컴포넌트는 가능하면 TDS를 우선 사용합니다.
- 커스텀 CSS는 레이아웃, 카드 컴포지션, 브랜드 톤 조정에 한정합니다.
- 모바일 우선 단일 컬럼 UX를 유지합니다.

## Consequences

- React 메이저 업그레이드는 TDS 호환성을 함께 점검해야 합니다.
- 새로운 버튼, 로더, CTA, 리스트 성격의 UI를 만들 때는 TDS 문서를 먼저 확인해야 합니다.
- 시각적으로 차별화하더라도 Toss 환경에서 어색하지 않은 수준의 패턴을 유지해야 합니다.
- 디자인 시스템을 우회하는 커스텀 인터랙션이 많아지면 유지보수 비용이 증가합니다.

## Alternatives considered

- 커스텀 HTML/CSS 컴포넌트 체계로 일원화
- React Native 전용 TDS로 전환
- 디자인 시스템 없이 페이지별 개별 구현

## References

- TDS 소개: https://developers-apps-in-toss.toss.im/design/components.html
- WebView로 디자인 개발하기: https://developers-apps-in-toss.toss.im/design_tutorials/webview.html
- TDS Mobile Button: https://tossmini-docs.toss.im/tds-mobile/components/button/
- TDS Mobile FixedBottomCTA: https://tossmini-docs.toss.im/tds-mobile/components/BottomCTA/fixed-bottom-cta/
- TDS Mobile Loader: https://tossmini-docs.toss.im/tds-mobile/components/loader/
