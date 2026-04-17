# ADR 0001: Apps in Toss WebView 런타임을 기준으로 사용한다

- Status: Accepted
- Date: 2026-04-18

## Context

MomentBook는 Toss 안에서 동작하는 미니앱을 목표로 하는 작은 React/Vite 앱입니다.
Apps in Toss 공식 WebView 가이드는 기존 웹 프로젝트에 `@apps-in-toss/web-framework`를 추가하고, `granite.config.ts`에서 `appName`, `brand`, `web`, `permissions`, `outdir`를 정의하는 흐름을 제공합니다.

공식 설정 문서는 다음 사실을 분명히 합니다.

- `appName`은 콘솔에 등록한 앱 ID와 일치해야 합니다.
- `brand` 정보는 브릿지 경험과 앱 식별에 관여합니다.
- `permissions`는 Toss 앱 검토 및 런타임 권한 기능과 연결됩니다.
- WebView 개발은 브라우저 개발 경험을 최대한 유지하면서 Toss 기능을 붙이는 방식입니다.

현재 저장소도 이미 이 방향을 따르고 있습니다.

- `@apps-in-toss/web-framework`에 의존합니다.
- `granite.config.ts`를 통해 앱 계약을 정의합니다.
- `src/lib/appsInToss.ts`에서 Toss SDK 접근을 얇게 래핑합니다.
- 브라우저 미리보기와 Toss runtime이 하나의 코드베이스를 공유합니다.

## Decision

MomentBook의 기준 런타임은 Apps in Toss WebView SDK + Granite 설정으로 유지합니다.

- 앱 진입 계약은 `granite.config.ts`가 담당합니다.
- 브라우저 미리보기는 보조 실행 환경이며, 가능하면 Toss/Sandbox와 동일한 UI 흐름을 공유합니다.
- Toss 고유 기능은 `src/lib/appsInToss.ts` 같은 어댑터 계층 뒤에 둡니다.

## Consequences

- `granite.config.ts`의 `appName`은 Toss 콘솔 값과 정확히 맞아야 하며, 대소문자도 임의로 바꾸면 안 됩니다.
- Web 전용 코드와 Toss runtime 코드의 경계가 중요해집니다.
- 실기기 테스트 품질은 `web.host`, `web.commands.dev`, `permissions` 설정의 정확도에 크게 의존합니다.
- React Native 전용 화면 제어나 네이티브 레이아웃 제어가 제품 핵심이 되면 이 결정을 재검토해야 합니다.

## Alternatives considered

- Apps in Toss React Native SDK로 전환
- Toss 외부의 일반 웹앱으로 유지

## References

- Apps in Toss WebView guide: https://developers-apps-in-toss.toss.im/tutorials/webview.html
- Apps in Toss Config: https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/Config.html
- Apps in Toss AI/LLM guide: https://developers-apps-in-toss.toss.im/development/llms.html
