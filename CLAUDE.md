프로젝트 개요는 @README.md 를 참고하세요.
명령어는 @package.json 를 참고하세요.
제품 의도와 범위는 @docs/PRODUCT.md 를 참고하세요.
아키텍처 결정은 @docs/adr/README.md 를 참고하세요.

# MomentBook Claude Memory

## 기본 사실

- 이 저장소는 Vite, React 18, TypeScript, `@apps-in-toss/web-framework` 기반의 작은 Apps in Toss WebView 미니앱입니다.
- 앱은 모바일 우선이며, 로컬 브라우저 미리보기, Toss Sandbox, Toss App 컨텍스트를 모두 고려합니다.
- `src/App.tsx`가 오케스트레이션 계층이고, `src/screens/*`는 단계별 화면, `src/lib/*`는 런타임 및 초안 로직을 담당합니다.
- 이 저장소 안에는 백엔드나 영속 저장 계층이 없습니다. 초안 생성과 publish는 현재 클라이언트 사이드 동작입니다.

## 작업 자세

- 비자명한 변경 전에 `docs/PRODUCT.md`와 관련 ADR을 먼저 읽습니다.
- 새로운 프레임워크나 전역 추상화를 추가하기보다 작은 로컬 변경을 우선합니다.
- SDK 동작, 권한, TDS 컴포넌트 API는 공식 Apps in Toss/TDS 문서로 확인합니다.
- 이 파일은 짧게 유지합니다. 오래 남을 자세한 내용은 `docs/`에 둡니다.

## 현재 주의점

- `granite.config.ts`는 이미 사용자가 만진 파일입니다. 명시적 요청이 없다면 의도와 casing을 보존합니다.
- Toss 사진 흐름은 `granite.config.ts`에 `photos` 권한이 필요할 가능성이 높지만, 현재 config의 `permissions`는 비어 있습니다.
- 한국어 UI 문자열 일부가 인코딩 손상 상태입니다. 관련 작업이 아니라면 incidental fix를 하지 않습니다.
- `npm run lint`와 `npm run build:web`는 2026-04-18 기준 로컬에서 통과했습니다.
