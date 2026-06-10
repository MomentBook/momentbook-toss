# ADR 0007: Simplify Documentation For Codex

- Status: Superseded by [0008](0008-split-codex-startup-map-and-operating-guide.md)
- Date: 2026-05-12
- Scope: historical Codex-only documentation consolidation
- Read when: investigating the removal of `CLAUDE.md`, the merge of
  `docs/PRODUCT.md` into `docs/DESIGN.md`, or older Codex docs structure

## Current Guidance

This ADR is preserved for history. ADR 0008 is the current decision for Codex
operating documentation: `AGENTS.md` remains the compact startup map and
`docs/CODEX.md` holds detailed workflow guidance.

## Original Decision

The repository documentation was simplified around Codex-only usage:

- Root `AGENTS.md` became the short automatic startup map.
- Product purpose, scope, architecture, and high-risk invariants moved to
  `docs/DESIGN.md`.
- Durable decisions stayed in ADRs.
- Non-trivial task logs stayed in `docs/ai/`.
- `CLAUDE.md` was removed.
- `docs/PRODUCT.md` was folded into `docs/DESIGN.md`.
- No alternate agent-specific instruction filename was added.

## Historical Context

The repository previously had overlapping product and agent instructions across
multiple files. That increased context load and created drift risk. OpenAI
Codex guidance treats `AGENTS.md` as durable project guidance that loads
automatically, but warns against making it too large. The earlier simplification
kept Codex's default startup context short and moved product/architecture
context into canonical docs.

## Why It Was Superseded

The simplification was directionally correct, but the repository now needs a
dedicated Codex operating guide for repeatable workflow rules, verification
policy, research use, approval boundaries, and subagent constraints. Adding
`docs/CODEX.md` preserves the short `AGENTS.md` entry point while keeping
operational guidance versioned and discoverable.

## References

- OpenAI AGENTS.md guidance:
  https://developers.openai.com/codex/guides/agents-md
- OpenAI Codex best practices:
  https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex prompting:
  https://developers.openai.com/codex/prompting
- OpenAI subagents:
  https://developers.openai.com/codex/concepts/subagents
- OpenAI harness engineering:
  https://openai.com/index/harness-engineering/
- OpenAI running Codex safely:
  https://openai.com/index/running-codex-safely/
- OpenAI Codex agent loop:
  https://openai.com/index/unrolling-the-codex-agent-loop/
