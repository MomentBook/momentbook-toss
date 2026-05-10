# ADR 0005: WebView 번들에는 공개 가능한 서버 URL만 환경별로 주입한다

- Status: Accepted
- Date: 2026-05-10

## Context

MomentBook Toss 미니앱은 이제 개발 서버와 운영 서버를 분리해서 바라봐야 합니다.
Sibling `momentbook` 프로젝트는 `.env.development`와 `.env.production`에서 API 서버와 웹 서버를 분리하고, 서버 요청 일부에는 `APP_SECRET` 같은 비밀값을 사용합니다.

하지만 이 저장소는 Vite 기반 WebView 앱입니다. Vite에서 `VITE_` 환경 변수는 클라이언트 번들에 포함됩니다.
따라서 서버 주소처럼 공개 가능한 배포별 설정은 넣을 수 있지만, 서버 비밀값이나 장기 인증 자격 증명을 넣으면 안 됩니다.

## Decision

이 저장소는 `.env.development`와 `.env.production`으로 공개 가능한 서버 주소만 분리합니다.

- `VITE_MOMENTBOOK_API_BASE_URL`: MomentBook API origin
- `VITE_MOMENTBOOK_WEB_BASE_URL`: MomentBook public web origin
- `VITE_MOMENTBOOK_APP_ENV`: development 또는 production

클라이언트 런타임은 `src/lib/environment.ts`에서 URL 형식을 검증하고, production 환경에서는 HTTPS를 강제합니다.
서버 비밀값은 이 WebView 번들에 넣지 않습니다.

## Consequences

- 개발/운영 서버 주소를 코드 변경 없이 Vite mode에 따라 바꿀 수 있습니다.
- 공개 URL 기반 기능은 이 미니앱에서 바로 사용할 수 있습니다.
- `APP_SECRET`이 필요한 sibling 앱의 서버 호출은 그대로 복사하지 않습니다.
- 실제 write/publish API 연동은 별도 인증, 업로드, CORS, CSRF 계약이 정리된 뒤 진행해야 합니다.

## References

- Vite Env Variables and Modes: https://vite.dev/guide/env-and-mode
- Twelve-Factor App Config: https://www.12factor.net/config
- OWASP Secrets Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- OWASP API Security Top 10: https://owasp.org/API-Security/
