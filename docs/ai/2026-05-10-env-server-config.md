# Environment server config

- Date: 2026-05-10
- Scope: environment split and client-visible server URL wiring

## What changed

- Added `.env.development` and `.env.production` with MomentBook API/Web origins copied from the sibling `momentbook` project.
- Added `src/lib/environment.ts` to validate client-visible server URL configuration and enforce HTTPS for production.
- Added typed Vite env declarations.
- Wired generated draft preview URLs to the environment-specific MomentBook web origin.
- Documented the security boundary in README and ADR 0005.

## Why

The WebView app needs development and production server separation, but Vite client env values are bundled into the app. Only public origins are safe here; sibling `APP_SECRET`-style values must stay out of this bundle.

## Verification

- Passed: `yarn eslint src/App.tsx src/lib/environment.ts src/lib/momentbook.ts src/screens/PublishScreen.tsx`
- Passed: `yarn tsc --noEmit`
- Passed: `yarn lint`
- Passed: `yarn build:web`
- Passed: `git diff --check`

## Risks

- Actual write/publish API calls still need a separate auth/upload contract. This change intentionally does not expose server secrets or copy secret-backed mobile app requests into the WebView client.
