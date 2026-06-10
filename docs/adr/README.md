# Architecture Decision Records

This directory is the durable decision log for MomentBook Toss. It records
decisions that should survive beyond one Codex thread, one prompt, or one local
implementation detail.

## How To Use This Index

Start here before opening individual ADRs. Read only the ADRs relevant to the
current task.

- Runtime, Granite, Apps in Toss SDK: read ADR 0001.
- TDS Mobile or mobile UX conventions: read ADR 0002.
- Screen flow, reducer state, or hash navigation: read ADR 0003.
- Legacy local heuristic publish language: read ADR 0004 only for history.
- Client-visible environment/server config: read ADR 0005.
- Private manual Toss v1 draft flow: read ADR 0006.
- Codex documentation structure before 2026-06-10: read ADR 0007 only for
  history.
- Current Codex operating documentation: read ADR 0008.

## Source Of Truth Map

- Product scope, UX intent, architecture map, and high-risk invariants:
  `docs/DESIGN.md`
- Durable technical decisions: Accepted ADRs in this directory
- Codex workflow rules: `docs/CODEX.md`
- Automatic startup map: `AGENTS.md`
- Non-trivial task history: `docs/ai/*`

If these documents disagree, follow `docs/DESIGN.md` and Accepted ADRs first,
then update the stale document as part of the work when appropriate.

## Status Rules

- `Proposed`: under consideration, not repository policy yet.
- `Accepted`: current durable decision.
- `Superseded by NNNN`: preserved history; another ADR is current policy.
- `Deprecated`: preserved history; no longer recommended.

Do not delete or renumber ADRs. Add a new ADR when a durable decision changes.

## ADR Shape

Each ADR should stay short and use this structure unless there is a clear reason
not to:

- Status, date, scope, and "read when" metadata
- Decision
- Context
- Operating rules or invariants
- Consequences
- Revisit triggers
- Alternatives considered
- References

Keep one decision per ADR. Prefer concrete repository rules over broad essays.

## Index

| ADR | Status | Decision | Read when |
| --- | --- | --- | --- |
| [0001](0001-use-apps-in-toss-webview-runtime.md) | Accepted | Use Apps in Toss WebView runtime and Granite as the baseline runtime contract. | Runtime, SDK, Granite, permissions, build |
| [0002](0002-adopt-tds-mobile-and-mobile-first-ui.md) | Accepted | Use TDS Mobile as the default UI language and keep the app mobile-first. | UI, CTA, layout, TDS, mobile UX |
| [0003](0003-model-flow-with-local-state-and-hash-navigation.md) | Accepted | Model screen flow with local reducer state and lightweight hash navigation. | Navigation, state transitions, screen access |
| [0004](0004-keep-v1-organization-local-and-heuristic.md) | Superseded by [0006](0006-keep-toss-v1-private-and-manual.md) | Historical local heuristic organization and publish simulation decision. | Legacy context only |
| [0005](0005-use-client-visible-environment-server-config.md) | Accepted | Inject only public server URLs into the WebView bundle by environment. | Env vars, server URLs, client config, secrets |
| [0006](0006-keep-toss-v1-private-and-manual.md) | Accepted | Keep Toss v1 as private, manual journey draft composition. | Product flow, publish semantics, photo grouping |
| [0007](0007-simplify-docs-for-codex.md) | Superseded by [0008](0008-split-codex-startup-map-and-operating-guide.md) | Historical Codex-focused documentation simplification. | Documentation history only |
| [0008](0008-split-codex-startup-map-and-operating-guide.md) | Accepted | Keep `AGENTS.md` as a compact startup map and `docs/CODEX.md` as the Codex operating guide. | Codex workflow, agent docs, instruction structure |

## Reference Baseline

- Michael Nygard, "Documenting Architecture Decisions":
  https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- OpenAI Codex best practices:
  https://developers.openai.com/codex/learn/best-practices
- OpenAI AGENTS.md guidance:
  https://developers.openai.com/codex/guides/agents-md
- OpenAI harness engineering:
  https://openai.com/index/harness-engineering/
