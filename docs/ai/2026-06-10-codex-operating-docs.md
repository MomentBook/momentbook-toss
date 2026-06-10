# 2026-06-10 Codex Operating Docs

## What Changed

- Rebuilt `AGENTS.md` as a compact Codex startup map.
- Added `docs/CODEX.md` as the repository-specific Codex operating guide.
- Reworked the ADR index as a source-of-truth and read-routing map.
- Rewrote ADR 0001-0006 into a consistent decision template without changing
  their product or architecture intent.
- Marked ADR 0007 as superseded and added ADR 0008 for the new
  `AGENTS.md`/`docs/CODEX.md` split.

## Why

The repository needs durable Codex guidance that is detailed enough to improve
agent performance but not so large that it crowds out task context. The new
structure keeps automatic startup context small and moves reusable workflow
rules into a versioned guide.

## Research Basis

- OpenAI Codex best practices, prompting, AGENTS.md discovery, sandboxing, and
  subagent documentation.
- OpenAI engineering posts on harness engineering, safe Codex operation, and
  the Codex agent loop.
- Supporting research and industry writing on context rot, stale AI
  configuration files, coding-agent action bias, and simple composable agent
  workflows.

## Verification

- `git diff --check` passed.
- `rg` reference checks confirmed the new `docs/CODEX.md` and ADR 0008
  references are present.
- `rg` confirmed `CLAUDE.md` and `docs/PRODUCT.md` references remain only in
  intentional historical documentation.

## Risks

- `README.md` and `docs/DESIGN.md` may later be updated to mention
  `docs/CODEX.md` more explicitly, but this task stayed focused on Codex and
  ADR operating docs.
