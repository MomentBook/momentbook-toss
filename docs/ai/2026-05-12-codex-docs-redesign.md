# 2026-05-12 Codex Docs Redesign

## What Changed

- Replaced the broad root `AGENTS.md` with a shorter Codex-only entrypoint.
- Consolidated product scope, architecture, and implementation invariants into `docs/DESIGN.md`.
- Removed `CLAUDE.md` and folded `docs/PRODUCT.md` content into `docs/DESIGN.md`.
- Added ADR 0007 to record the Codex-focused documentation structure.
- Updated `README.md` and `docs/adr/README.md` references.

## Why

Codex official guidance treats `AGENTS.md` as durable project guidance that is automatically loaded, while deeper product and architecture context should live in canonical docs that the agent opens when relevant. This reduces context load and documentation drift.

## Verification

- `rg -n "PRODUCT\\.md|CLAUDE\\.md|docs/PRODUCT|Claude|Anthropic" . --glob '!node_modules/**'` only returns intentional historical references in ADR 0007 and this task log.
- `yarn lint` passed.

## Risks

- Any external workflow still pointing at `docs/PRODUCT.md` or `CLAUDE.md` must be updated to `docs/DESIGN.md` or `AGENTS.md`.
