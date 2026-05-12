# Momentbook for Apps in Toss

This project adapts a Vite + React app into an Apps in Toss WebView marketing
mini app for MomentBook.

## Commands

- `yarn install`: install dependencies with the project-pinned Yarn version
- `yarn dev`: Apps in Toss local development via Granite (`8081`) plus the configured web dev server (`5173`)
- `yarn dev:web`: direct local web preview with Vite
- `yarn dev:host`: Vite dev server bound to `0.0.0.0`
- `yarn build:web`: static web build to `dist`
- `yarn build`: Apps in Toss artifact build via `ait build`
- `yarn lint`: ESLint check

## Environment

- `.env.development`: development server URLs loaded by Vite dev mode
- `.env.production`: production server URLs loaded by Vite build mode
- Only `VITE_*` values are exposed to the WebView bundle. Do not put server secrets such as the sibling app's `APP_SECRET` in this project.

## Key Files

- `AGENTS.md`: Codex entrypoint and repository working rules
- `docs/DESIGN.md`: product scope, current architecture, and high-risk invariants
- `docs/adr/README.md`: architecture decision index
- `granite.config.ts`: Apps in Toss app contract
- `src/lib/environment.ts`: client-visible environment/server URL validation
- `src/lib/appsInToss.ts`: bridge access wrapper for browser, sandbox, and Toss runtime
- `src/lib/momentbook.ts`: private draft, photo, and manual moment helpers
- `src/App.tsx`: mobile-oriented Apps in Toss flow orchestration

## Notes

- The app name in `granite.config.ts` is set to `MomentBook`. It must match the Apps in Toss console app ID exactly, including casing.
- The project uses `@apps-in-toss/web-framework` with Yarn Modern through Corepack.
- Yarn is configured with `nodeLinker: node-modules` to keep the runtime close to the existing Vite/Granite setup and the sibling MomentBook project.
- TDS Mobile packages are installed and should remain the first choice for mobile UI changes.
- The current Toss flow creates private journey drafts only. Server publish, Toss login token exchange, and native-account linking are intentionally out of scope for this repo stage.
