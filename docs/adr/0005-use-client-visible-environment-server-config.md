# ADR 0005: Use Client-Visible Environment Server Config

- Status: Accepted
- Date: 2026-05-10
- Scope: Vite environment variables, public server URLs, client bundle safety
- Read when: changing `.env.*`, `src/lib/environment.ts`, server URL handling,
  public web/API origins, or client-visible config

## Decision

MomentBook Toss injects only public, client-safe server URLs into the WebView
bundle by environment.

Allowed client-visible values:

- `VITE_MOMENTBOOK_API_BASE_URL`
- `VITE_MOMENTBOOK_WEB_BASE_URL`
- `VITE_MOMENTBOOK_APP_ENV`

Server secrets, long-lived credentials, and sibling-app `APP_SECRET` values must
not be added to this WebView project.

## Context

This repository is a Vite WebView app. Vite exposes `VITE_*` environment
variables to browser code, so any value placed there must be safe for users to
inspect.

The sibling MomentBook app may use server-only secrets for backend requests, but
those patterns cannot be copied into the Toss mini app bundle.

`src/lib/environment.ts` validates URL shape and requires HTTPS in production.

## Operating Rules

- Keep environment variables public and client-safe.
- Use `.env.development` and `.env.production` for deploy-specific public
  origins only.
- Do not add server secrets, token exchange credentials, or private API keys to
  Vite env vars.
- Production origins must be HTTPS.
- Any write/publish API integration needs a new decision covering auth, upload,
  CORS, CSRF, and content safety boundaries.

## Consequences

- Development and production origins can change without code edits.
- Public URL construction can happen inside the WebView.
- Server-only sibling app calls cannot be copied directly.
- Real write/publish integration remains blocked until security and backend
  contracts are decided.

## Revisit When

- The Toss mini app receives authenticated server write capability.
- A backend token exchange or native account linking flow is introduced.
- Environment config expands beyond public origins.

## References

- Vite Env Variables and Modes:
  https://vite.dev/guide/env-and-mode
- Twelve-Factor App Config:
  https://www.12factor.net/config
- OWASP Secrets Management Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- OWASP API Security Top 10:
  https://owasp.org/API-Security/
