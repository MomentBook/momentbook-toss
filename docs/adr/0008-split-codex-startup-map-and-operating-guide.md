# ADR 0008: Split Codex Startup Map And Operating Guide

- Status: Accepted
- Date: 2026-06-10
- Scope: Codex instruction structure, repository workflow guidance, ADR/doc
  maintenance
- Read when: changing `AGENTS.md`, `docs/CODEX.md`, ADR rules, Codex workflow
  expectations, or agent-facing documentation structure
- Supersedes: [0007](0007-simplify-docs-for-codex.md)

## Decision

Keep `AGENTS.md` as the compact automatic startup map and use `docs/CODEX.md` as
the detailed Codex operating guide.

- `AGENTS.md` lists startup context, source-of-truth order, project invariants,
  code map, verification defaults, and documentation routing.
- `docs/CODEX.md` owns reusable Codex workflow rules: context loading, task
  loop, planning/asking policy, editing constraints, verification matrix,
  external research rules, security/permissions, review mode, and subagent
  boundaries.
- `docs/adr/README.md` remains the ADR index and read-routing map.
- Accepted ADRs remain the durable decision layer.
- `docs/DESIGN.md` remains the product/UX/architecture source of truth.

## Context

OpenAI Codex guidance says `AGENTS.md` is loaded automatically and should encode
durable repository expectations. OpenAI also recommends keeping it practical and
short, moving deeper task-specific material into referenced files when it grows.

OpenAI's agent-first engineering writeup describes the same pattern at larger
scale: treat `AGENTS.md` as a table of contents and keep structured repository
docs as the system of record. That reduces context load and makes the repository
more legible to future agent runs.

Community and research material points in the same direction:

- Long context is not uniformly reliable; irrelevant context can reduce
  performance.
- Agent instruction files can become stale and should be treated like
  maintainable documentation, not one-off prompts.
- Coding agents can show action bias, so "inspect first" and "no change needed"
  must remain valid outcomes.
- Simple, composable workflows and clear tool/environment feedback are more
  reliable than unnecessary agentic complexity.

## Operating Rules

- Keep `AGENTS.md` short enough to be read on every session without crowding out
  task context.
- Put durable workflow rules in `docs/CODEX.md`, not in repeated prompts.
- Add or update ADRs when the instruction structure or durable architecture
  policy changes.
- Keep all document references searchable and current.
- Do not add other agent-specific instruction files unless a new ADR explains
  why Codex-only operation changed.
- Do not use subagents by default; require explicit user instruction for
  parallel agent work.

## Consequences

- Codex gets a concise startup path and a deeper operating manual only when it
  needs one.
- Repeated workflow corrections can become durable repository guidance.
- Documentation drift risk moves from hidden prompts into versioned files that
  can be searched and reviewed.
- The repository now has one more maintained document, so reference checks are
  required when changing doc structure.

## Revisit When

- Codex changes how it discovers project guidance.
- The repository stops being Codex-only.
- Workflow rules grow large enough to require specialized documents or skills.
- Mechanical checks are added for instruction freshness, ADR links, or doc
  routing.

## Alternatives Considered

- Keep all Codex guidance in `AGENTS.md`.
- Put workflow rules only in user prompts.
- Use separate instruction files for multiple agent products.
- Convert all recurring workflows into skills immediately.

## References

- OpenAI Codex best practices:
  https://developers.openai.com/codex/learn/best-practices
- OpenAI Codex prompting:
  https://developers.openai.com/codex/prompting
- OpenAI AGENTS.md guidance:
  https://developers.openai.com/codex/guides/agents-md
- OpenAI sandboxing:
  https://developers.openai.com/codex/concepts/sandboxing
- OpenAI subagents:
  https://developers.openai.com/codex/concepts/subagents
- OpenAI harness engineering:
  https://openai.com/index/harness-engineering/
- OpenAI running Codex safely:
  https://openai.com/index/running-codex-safely/
- OpenAI Codex agent loop:
  https://openai.com/index/unrolling-the-codex-agent-loop/
- Chroma context rot report:
  https://www.trychroma.com/research/context-rot
- Treude and Baltes, "Context Rot in AI-Assisted Software Development":
  https://arxiv.org/abs/2606.09090
- Gloaguen et al., "Coding Agents Don't Know When to Act":
  https://arxiv.org/abs/2605.07769
- Anthropic, "Building effective agents":
  https://www.anthropic.com/engineering/building-effective-agents
- HumanLayer, "12-factor agents":
  https://github.com/humanlayer/12-factor-agents
