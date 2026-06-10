# ADR 0004: Keep V1 Organization Local And Heuristic

- Status: Superseded by [0006](0006-keep-toss-v1-private-and-manual.md)
- Date: 2026-04-18
- Scope: historical local heuristic organization and publish simulation
- Read when: investigating legacy `publish` language or old heuristic grouping
  assumptions

## Current Guidance

This ADR is preserved for history. ADR 0006 later made Toss v1 a private,
manual journey draft flow. ADR 0009 is the current launch target policy. Do not
use this ADR to justify new publish semantics or automatic grouping.

## Original Decision

At the earlier v1 prototype stage, draft generation and publish were kept local
and heuristic.

- No remote AI.
- No server storage.
- No real publish pipeline.
- Deterministic grouping based on local photo order/timing assumptions.
- Result represented by preview UI and a simulated path string.

## Historical Context

The earlier product hypothesis was that quickly grouping travel photos into a
shareable-looking story would be easier than starting from a blank canvas.
Because this repository had no backend API, persistent storage, or public share
page pipeline, local simulation was the lowest-friction way to validate the
organizing experience.

This was later superseded when the product direction shifted toward an Apps in
Toss acquisition surface: users browsed public examples and manually composed a
private draft rather than generating a publish-like result. ADR 0009 later
shifted the launch target to Toss login based private server save.

## Consequences At The Time

- Browser and sandbox iteration stayed fast.
- Demos worked without backend dependencies.
- Result quality was bounded by local heuristics.
- Real publish, account sync, AI captioning, and analytics required future
  decisions.

## Why It Was Superseded

The word `publish` and automatic organization assumptions could mislead users
about what the Toss mini app actually does. ADR 0006 replaced this with private
manual draft semantics, and ADR 0009 now defines private server save as the
launch target.

## References

- From PhotoWork to PhotoUse:
  https://www.tandfonline.com/doi/abs/10.1080/0144929X.2017.1288266
- The influence of travel photo editing on tourists' experiences:
  https://www.sciencedirect.com/science/article/pii/S0261517723000444
- Atlassian Product Discovery handbook:
  https://support.atlassian.com/jira-product-discovery/docs/the-product-management-handbook/
