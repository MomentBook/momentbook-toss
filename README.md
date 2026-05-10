# Momentbook for Apps in Toss

This project adapts a Vite + React app into an Apps in Toss WebView mini app.

## Commands

- `yarn install`: install dependencies with the project-pinned Yarn version
- `yarn dev`: Apps in Toss local development via Granite (`8081`) plus the configured web dev server (`5173`)
- `yarn dev:web`: direct local web preview with Vite
- `yarn dev:host`: Vite dev server bound to `0.0.0.0`
- `yarn build:web`: static web build to `dist`
- `yarn build`: Apps in Toss artifact build via `ait build`
- `yarn lint`: ESLint check

## Key Files

- `granite.config.ts`: Apps in Toss app contract
- `src/lib/appsInToss.ts`: bridge access wrapper for browser, sandbox, and Toss runtime
- `src/App.tsx`: mobile-oriented runtime dashboard UI

## Notes

- The app name in `granite.config.ts` is set to `MomentBook`. It must match the Apps in Toss console app ID exactly, including casing.
- The project uses `@apps-in-toss/web-framework` with Yarn Modern through Corepack.
- Yarn is configured with `nodeLinker: node-modules` to keep the runtime close to the existing Vite/Granite setup and the sibling MomentBook project.
- TDS Mobile packages are installed and should remain the first choice for mobile UI changes.
