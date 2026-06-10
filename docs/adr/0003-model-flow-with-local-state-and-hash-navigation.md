# ADR 0003: Model Flow With Local State And Hash Navigation

- Status: Accepted
- Date: 2026-04-18
- Scope: screen flow, local reducer state, lightweight URL/history handling
- Read when: changing `src/App.tsx`, `src/lib/navigation.ts`, screen order,
  screen access rules, or back/forward behavior

## Decision

MomentBook Toss models its current flow with local reducer state and lightweight
hash navigation.

- `src/App.tsx` owns the main reducer state and screen orchestration.
- `src/lib/navigation.ts` owns screen identifiers, history state shape, and
  hash parsing helpers.
- URL hash is a minimal browser preview and history restoration aid.
- Screen components should remain mostly presentational.

## Context

The current product flow is small and mostly linear: discover public examples,
select photos, organize a private draft, preview the private timeline, and show
private draft completion.

The repository does not currently need:

- nested routes
- server-backed draft recovery
- multi-tab synchronization
- global data cache
- background sync

The existing code uses local React state primitives:

- `src/App.tsx` uses a reducer for selected photos, draft details, moments,
  generated private draft, runtime status, and errors.
- `startTransition` wraps lower-priority flow transitions.
- `src/lib/navigation.ts` validates screen names and history state.
- Invalid or inaccessible screen requests are resolved back to a safe reachable
  screen.

## Operating Rules

- Keep the screen union and hash parsing small and explicit.
- When adding or reordering screens, update screen order, access checks, reducer
  transitions, CTA conditions, and back/forward behavior together.
- Do not introduce a router or global state library for a narrow flow change.
- Preserve safe fallback behavior for invalid deep links or stale history state.

## Consequences

- The product stays easy to run in browser preview and Toss WebView.
- State transitions remain inspectable in one place.
- `App.tsx` can grow if the product adds multiple independent flows.
- Hash navigation is not a substitute for complex URL semantics.

## Revisit When

- The app needs nested routes, multiple flows, or shareable URLs with stable
  semantics.
- Draft recovery becomes server-backed or account-backed.
- Cross-screen data dependencies outgrow local reducer state.

## Alternatives Considered

- `react-router`
- State machine library
- Global store

## References

- React `useReducer`: https://react.dev/reference/react/useReducer
- React `startTransition`: https://react.dev/reference/react/startTransition
- React managing state: https://react.dev/learn/managing-state
