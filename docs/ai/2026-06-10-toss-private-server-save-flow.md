## Toss private server save flow

- Date: 2026-06-10

### What changed

- Reframed the launch target from private draft simulation to Toss login based
  private server save.
- Updated `docs/DESIGN.md` so product scope, flow, and high-risk invariants
  match the new target while clearly stating that current code still simulates
  private draft completion.
- Added ADR 0009 and marked ADR 0006 as historical.
- Updated `docs/adr/README.md`, `README.md`, `AGENTS.md`, and `docs/CODEX.md`
  so startup and workflow guidance no longer treats private server save as out
  of scope.
- Updated ADR 0004 guidance so historical publish language points to ADR 0009
  as the current launch target decision.
- Created four Stitch mobile reference screens in existing project
  `projects/15193344340403912205`:
  - Photo Intake:
    `projects/15193344340403912205/screens/c17956e1c218447a81efef322b5b9910`
  - Journey Basics:
    `projects/15193344340403912205/screens/574d80b9cee5408aa2263bbb30901753`
  - Moment Compose:
    `projects/15193344340403912205/screens/7d3e5d4012924d1d9676086c4574f6a3`
  - Review Upload:
    `projects/15193344340403912205/screens/e62b21f457d54b9b9a073ee3a7190229`

### Why

- The product goal is now for users to upload travel photos, manually organize
  a timeline, write moment records, and save that journey privately on the
  server from inside Toss.
- Apps in Toss cannot be assumed to provide EXIF-based clustering, so the flow
  stays manual and fatigue-aware.
- Toss login must remain a client authorization-code step only; token exchange
  and token storage belong on the server.

### Verification

- Stitch `get_screen` succeeded for all four generated screens.
- Each generated screen reported `deviceType: MOBILE` and included screenshot
  and HTML file references.
- Documentation reference checks were run after the edits.

### Risks / TODO

- No app code was changed in this task. The current UI still implements the
  previous private draft simulation until the follow-up code work is done.
- The existing private save API contract was not inspected in this task.
  Endpoint, request shape, response shape, CORS, retry, and failure semantics
  must be confirmed before upload code is implemented.
- The Stitch screens are reference designs and should be manually reviewed
  before translating them into React/TDS implementation details.
