# AGENTS.md

This repository is a Codex-only workspace for the MomentBook Apps in Toss
WebView mini app. Keep this file short: it is the automatic startup map, not the
full operating manual.

## Startup Context

Read these first when beginning repository work:

- `README.md`
- `docs/DESIGN.md`
- `docs/adr/README.md`
- `docs/CODEX.md`

Then open only the context needed for the current task:

- Relevant ADRs listed in `docs/adr/README.md`
- Relevant `docs/ai/*` task logs
- Relevant code, types, configs, tests, and call sites

Do not read every ADR or every task log by default.

## Source Of Truth

Runtime/system/developer instructions override repository documents. Within this
repository, use this order:

1. `docs/DESIGN.md` for product scope, UX intent, architecture map, and
   high-risk invariants.
2. Accepted ADRs for durable architecture, runtime, data, and documentation
   decisions.
3. `docs/CODEX.md` for Codex workflow rules.
4. `AGENTS.md` as the short startup index.

When user instructions conflict with product scope or durable decisions, inspect
the relevant source of truth and include any needed documentation update in the
work.

## Working Rules

- Inspect before editing: read relevant code, types, configs, docs, tests, and
  call sites first.
- Keep changes narrow, local, and verifiable.
- Preserve user or uncommitted changes. Do not revert unrelated files.
- Prefer existing architecture, naming, state management, UI components, and
  validation patterns over new abstractions.
- Use `rg`/`rg --files` for search, `apply_patch` for manual edits, and
  repository-native scripts for verification.
- Ask only when guessing could materially affect behavior, data, security,
  public UX, schema, permissions, or operations.
- Use external sources only when current external facts matter; prefer official
  primary sources and cite sources when they affect the work.
- Do not use subagents unless the user explicitly asks for parallel agent work.

## Project Invariants

- This is a Vite + React 18 + TypeScript WebView mini app for Apps in Toss.
- Consider all runtime contexts: `browser`, `sandbox`, and `toss`.
- The launch target is Toss login based private server save; the current code
  still simulates private draft completion.
- Public publishing, WebView-side Toss token exchange, native account linking,
  and public journey mutation APIs are out of scope.
- `granite.config.ts` `appName` is `MomentBook`; do not change casing casually.
- Photo-flow changes must keep `photos: read` permission and Toss console
  configuration aligned.
- UI is mobile-first and TDS-first. Consider existing `Button`,
  `FixedBottomCTA`, and `Loader` before custom controls.
- Do not incidentally rewrite Korean mojibake unless the task explicitly covers
  those strings.

## Code Map

- App orchestration: `src/App.tsx`
- Screen order and access rules: `src/lib/navigation.ts`
- Toss runtime adapter: `src/lib/appsInToss.ts`
- Current private draft and manual moment logic: `src/lib/momentbook.ts`
- Screen components: `src/screens/*`
- Apps in Toss contract: `granite.config.ts`

## Verification

- Default: `yarn lint`, `yarn build:web`
- Web preview: `yarn dev:web`
- Apps in Toss/Granite changes: `yarn dev`, `yarn build`
- Docs-only changes: use reference searches to check broken file names, stale
  links, and removed document names.

If verification is partial or blocked, report what ran, what passed or failed,
and the remaining risk.

## Documentation

- Product purpose, scope, and design invariants belong in `docs/DESIGN.md`.
- Durable technical decisions require a new ADR and an update to
  `docs/adr/README.md`.
- Non-trivial work should leave a short task log in `docs/ai/`.
- Keep `AGENTS.md` compact; move detailed Codex workflow guidance to
  `docs/CODEX.md`.
