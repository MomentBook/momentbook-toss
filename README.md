# Momentbook for Apps in Toss

This project adapts a Vite + React app into an Apps in Toss WebView mini app.

## Commands

- `npm run dev`: local web preview with Vite
- `npm run dev:host`: Vite dev server bound to `0.0.0.0`
- `npm run build:web`: static web build to `dist`
- `npm run build`: Apps in Toss artifact build via `ait build`

## Key Files

- `granite.config.ts`: Apps in Toss app contract
- `src/lib/appsInToss.ts`: bridge access wrapper for browser, sandbox, and Toss runtime
- `src/App.tsx`: mobile-oriented runtime dashboard UI

## Notes

- The app name in `granite.config.ts` is set to `momentbook-toss`. Change it if your Apps in Toss console app name differs.
- The current patch integrates the official `@apps-in-toss/web-framework`.
- Official Apps in Toss design docs recommend TDS for non-game mini apps. In this environment the TDS package was not publicly installable from npm, so the UI layer is kept framework-ready and isolated from the runtime layer for a later TDS swap.
