# AGENTS.md

이 문서는 이 저장소에서 작업하는 코딩 에이전트를 위한 짧은 진입점입니다.
깊은 맥락은 `docs/`를 source of truth로 두고, 여기에는 자주 필요한 작업 규칙만 남깁니다.

## 먼저 읽기

- `README.md`
- `docs/PRODUCT.md`
- `docs/adr/README.md`

## 저장소 요약

- 이 저장소는 Apps in Toss용 WebView 미니앱입니다.
- 기술 스택은 Vite, React 18, TypeScript, `@apps-in-toss/web-framework`, `@toss/tds-mobile`입니다.
- 앱 오케스트레이션은 `src/App.tsx`에 모여 있습니다.
- Toss 런타임 연동은 `src/lib/appsInToss.ts`에 모여 있습니다.
- 로컬 초안 생성 로직은 `src/lib/momentbook.ts`에 있습니다.
- 화면 컴포넌트는 `src/screens/*`에 있습니다.

## 작업 원칙

- `AGENTS.md`는 짧게 유지합니다. 긴 설명은 `docs/`로 옮깁니다.
- 현재 앱은 `browser`, `sandbox`, `toss` 세 실행 컨텍스트를 모두 고려합니다.
- 현재 publish 단계는 실제 게시가 아니라 로컬 시뮬레이션 프리뷰입니다.
- 비자명한 변경을 하기 전에 `docs/PRODUCT.md`와 관련 ADR을 확인합니다.
- Apps in Toss SDK, Granite 설정, TDS 컴포넌트 동작은 추측하지 말고 공식 문서로 확인합니다.
- `granite.config.ts`의 `appName`은 Toss 콘솔의 앱 ID와 정확히 일치해야 합니다. 현재 워크트리 값은 `MomentBook`이므로 대소문자를 임의로 바꾸지 마세요.
- 현재 앱은 사진 API를 사용하지만 `granite.config.ts`의 `permissions`는 비어 있습니다. Toss 실환경에서 사진 흐름을 다룰 때는 `photos: read` 권한 검토가 선행돼야 합니다.
- UI는 모바일 우선, TDS 우선 원칙을 따릅니다. 이미 쓰고 있는 `Button`, `FixedBottomCTA`, `Loader`를 먼저 고려하세요.
- 한국어 카피가 일부 파일에서 mojibake 상태입니다. 인코딩 복구가 작업 범위가 아니라면 incidental rewrite를 하지 마세요.

## 검증 명령

- `npm run lint`
- `npm run build:web`
- `npm run dev:web`
- `npm run dev`
- `npm run build`

`npm run lint`와 `npm run build:web`는 2026-04-18 기준 로컬에서 확인했습니다.
`npm run dev`와 `npm run build`는 Apps in Toss 런타임과 콘솔 설정에 더 의존하므로 플랫폼 연동 변경 시 추가 검증하세요.

## 아키텍처 힌트

- `src/App.tsx`는 reducer 상태, 화면 접근 제어, hash/history 네비게이션을 함께 관리합니다.
- `src/lib/navigation.ts`는 의도적으로 작습니다. 새 화면을 추가하면 screen union, 순서, 메타데이터, 접근 규칙을 함께 갱신하세요.
- `src/lib/momentbook.ts`는 결정론적 로컬 휴리스틱으로 사진을 묶습니다.
- `src/screens/*`는 가능한 한 표현 계층으로 유지합니다.

## 문서 갱신 규칙

- 제품 목적이나 범위가 바뀌면 `docs/PRODUCT.md`를 갱신합니다.
- 지속되는 기술 결정을 바꾸면 새 ADR을 추가합니다.
- 에이전트 작업 규칙이 바뀌면 `AGENTS.md`와 `CLAUDE.md`를 함께 정리합니다.
