# AGENTS.md

이 저장소는 Codex만 사용하는 작업 공간입니다. 이 파일은 Codex가 자동으로 읽는 짧은 진입점이며, 긴 제품/설계 맥락은 `docs/`에 둡니다.

## 먼저 읽기

- `README.md`
- `docs/DESIGN.md`
- `docs/adr/README.md`

관련 작업을 시작할 때만 개별 ADR과 `docs/ai/*` 작업 로그를 추가로 읽습니다. 모든 ADR을 습관적으로 전부 읽지 마세요.

## Source of Truth

충돌 시 저장소 문서 안에서는 `docs/DESIGN.md`와 Accepted ADR이 `AGENTS.md`보다 우선합니다. 사용자 지시가 제품 범위나 지속 결정과 충돌하면, 관련 문서를 먼저 확인하고 필요한 문서 변경까지 함께 제안합니다.

## 작업 원칙

- 먼저 관련 코드, 타입, 설정, 문서, 호출부를 읽고 나서 수정합니다.
- 작은 변경은 좁게 구현하고 바로 검증합니다.
- 다중 파일, 모호한 요구, 런타임/권한/데이터 계약 변경은 먼저 조사하고 짧은 계획을 세웁니다.
- 기존 아키텍처와 로컬 패턴을 우선하고, 추측성 추상화나 기능을 추가하지 않습니다.
- 사용자 또는 다른 작업자의 미커밋 변경은 보존하고, 관련 없는 변경을 되돌리지 않습니다.
- 외부 사실, Apps in Toss SDK, Granite, TDS 동작은 공식 문서로 확인합니다.

## 프로젝트 불변조건

- Apps in Toss용 Vite + React 18 + TypeScript WebView 미니앱입니다.
- `browser`, `sandbox`, `toss` 실행 컨텍스트를 모두 고려합니다.
- 현재 완료 단계는 실제 게시가 아니라 비공개 초안 완료 시뮬레이션입니다.
- 서버 publish, Toss 로그인 토큰 교환, 네이티브 계정 연결은 현재 범위 밖입니다.
- `granite.config.ts`의 `appName`은 현재 `MomentBook`이며 대소문자를 임의로 바꾸지 않습니다.
- 사진 흐름 변경 시 `photos: read` 권한과 Toss 콘솔 설정 정합성을 함께 확인합니다.
- UI는 모바일 우선, TDS 우선입니다. 기존 `Button`, `FixedBottomCTA`, `Loader`를 먼저 고려합니다.
- 한국어 mojibake는 해당 작업 범위가 아니면 incidental rewrite하지 않습니다.

## 코드 지도

- 앱 오케스트레이션: `src/App.tsx`
- 화면 순서/접근 규칙: `src/lib/navigation.ts`
- Toss 런타임 어댑터: `src/lib/appsInToss.ts`
- 비공개 초안/수동 모먼트 로직: `src/lib/momentbook.ts`
- 화면 컴포넌트: `src/screens/*`

## 검증

- 기본: `yarn lint`, `yarn build:web`
- 웹 미리보기: `yarn dev:web`
- Apps in Toss/Granite 변경: `yarn dev`, `yarn build`
- 문서만 변경한 경우에도 참조 검색으로 깨진 링크/파일명을 확인합니다.

검증을 실행하지 못했거나 일부만 실행했다면 결과와 남은 위험을 명확히 보고합니다.

## 문서 규칙

- 제품 목적, 범위, 설계 불변조건이 바뀌면 `docs/DESIGN.md`를 갱신합니다.
- 지속되는 기술 결정을 바꾸면 새 ADR을 추가하고 `docs/adr/README.md` 인덱스를 갱신합니다.
- 비자명한 작업은 `docs/ai/`에 짧은 작업 로그를 남깁니다.
- `AGENTS.md`는 자동 로드용 지도이므로 짧게 유지합니다.
