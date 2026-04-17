# ADR 0003: 흐름 제어는 로컬 reducer 상태와 가벼운 hash navigation으로 관리한다

- Status: Accepted
- Date: 2026-04-18

## Context

현재 MomentBook는 업로드, 리뷰, 정리, 타임라인, publish 프리뷰로 이어지는 작고 선형적인 흐름을 갖습니다.
복잡한 서버 데이터, 다중 탭, 중첩 라우트, 백그라운드 동기화는 없습니다.

React 공식 문서는 `useReducer`를 여러 상태 전환 규칙을 한 곳에 모으는 방식으로 설명하고, `startTransition`은 덜 긴급한 UI 갱신을 비차단 방식으로 처리하는 데 적합하다고 설명합니다.
현재 구현은 이 조합을 그대로 사용합니다.

- `src/App.tsx`는 `useReducer`로 `photos`, `draft`, `publishStatus`, `errorMessage`를 관리합니다.
- `startTransition`으로 초안 생성 완료와 publish 완료 상태 갱신을 감쌉니다.
- `src/lib/navigation.ts`는 hash와 `window.history.state`를 사용해 현재 화면을 복원합니다.
- 접근 가능한 화면을 `resolveAccessibleScreen`으로 제한해 잘못된 deep link를 방지합니다.

## Decision

현재 단계에서는 별도 라우터나 전역 상태 라이브러리 없이, 로컬 reducer 상태와 hash navigation을 유지합니다.

- 화면 흐름의 단일 source of truth는 `src/App.tsx`입니다.
- URL hash는 브라우저 미리보기와 히스토리 복원을 위한 최소한의 주소 표현으로 사용합니다.
- 개별 화면 컴포넌트는 표현 계층에 가깝게 유지합니다.

## Consequences

- 작은 제품 단계에서는 의존성과 개념 수를 줄일 수 있습니다.
- 화면 추가나 전이 규칙 변경 시 `orderedScreens`, reducer, 접근 제어, CTA 조건을 함께 수정해야 합니다.
- 앱이 커지면 `App.tsx`가 비대해질 수 있으므로, 다중 플로우나 데이터 소스가 생기면 재평가해야 합니다.
- hash navigation은 충분히 가볍지만, 복잡한 URL semantics나 중첩 라우팅이 필요해지면 한계가 옵니다.

## Alternatives considered

- `react-router` 기반 라우팅
- 상태 머신 라이브러리 도입
- 전역 store 기반 플로우 관리

## References

- React `useReducer`: https://react.dev/reference/react/useReducer
- React `startTransition`: https://react.dev/reference/react/startTransition
- React state management overview: https://react.dev/learn/managing-state
