# ADR 0001: Use Apps in Toss WebView Runtime

- Status: Accepted
- Date: 2026-04-18
- Scope: runtime, Granite config, Apps in Toss SDK boundary
- Read when: changing `granite.config.ts`, Apps in Toss APIs, runtime
  detection, permissions, or build/dev commands

## Decision

MomentBook Toss uses Apps in Toss WebView SDK plus Granite configuration as its
baseline runtime contract.

- `granite.config.ts` owns the Apps in Toss app contract.
- Browser preview is a supporting runtime, not a separate product surface.
- Toss-specific calls stay behind a small adapter such as
  `src/lib/appsInToss.ts`.
- The shared React/Vite code path must continue to handle `browser`, `sandbox`,
  and `toss` contexts.

## Context

MomentBook Toss is a small React/Vite WebView mini app intended to run inside
Toss. The Apps in Toss WebView flow keeps normal browser development available
while adding platform configuration through `@apps-in-toss/web-framework` and
`granite.config.ts`.

The repository already follows this shape:

- `@apps-in-toss/web-framework` is a runtime dependency.
- `granite.config.ts` defines `appName`, brand, WebView host/port/build
  commands, permissions, and output directory.
- `src/lib/appsInToss.ts` wraps Toss APIs for album photo selection, haptics,
  and runtime environment detection.
- Browser and Toss runtime paths share the same screen flow.

## Operating Rules

- Do not casually change `granite.config.ts` `appName`; current value is
  `MomentBook` and must match the Toss console app ID exactly.
- Keep Apps in Toss API calls behind adapter functions instead of scattering SDK
  calls across screens.
- When changing photo behavior, verify `photos: read` permission alignment
  across code, Granite config, and Toss console setup.
- Confirm Apps in Toss SDK and Granite behavior from official Toss
  documentation before relying on new platform behavior.

## Consequences

- A single codebase can support browser preview, sandbox, and Toss execution.
- Platform-specific behavior is easier to test and reason about because it is
  isolated behind a local adapter.
- Real-device quality depends on correct `web.host`, `web.commands`, and
  `permissions` settings.
- A future React Native-only product surface would require a new ADR.

## Revisit When

- The mini app moves away from Apps in Toss WebView.
- Toss requires a different app contract or permission model.
- Runtime-specific branching becomes large enough that the adapter boundary no
  longer keeps screens simple.

## Alternatives Considered

- Apps in Toss React Native SDK
- Generic web app outside Toss
- Scattering SDK calls directly in screen components

## References

- Apps in Toss WebView guide:
  https://developers-apps-in-toss.toss.im/tutorials/webview.html
- Apps in Toss Config:
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/Config.html
- Apps in Toss AI/LLM guide:
  https://developers-apps-in-toss.toss.im/development/llms.html
