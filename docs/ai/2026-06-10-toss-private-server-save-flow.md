## Toss private server save flow

- Date: 2026-06-10

### What changed

#### Design and documentation

- Reframed the launch target from private draft simulation to Toss login based
  private server save.
- Updated `docs/DESIGN.md` so product scope, flow, current implementation
  state, and high-risk invariants match the new target.
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

#### Code implementation follow-up

- Added the `journeyBasics` route and wired the primary flow as photo intake,
  journey basics, moment compose, review timeline, then private save review.
- Moved journey title, description, and cover selection out of moment compose
  into the dedicated journey basics screen.
- Changed the default moment set to three slots and added an explicit add
  moment action.
- Preserved selected photos that are not assigned to a moment as
  `unassignedPhotos` on the draft, and surfaced them in review/save screens.
- Removed the private draft completion timer. Save now attempts the Toss login
  and server auth boundary, then stops with an explicit pending-private-save-API
  message instead of calling public publish or faking success.

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
- `yarn lint` passed.
- `yarn build:web` passed. Vite emitted a non-failing large chunk warning.

### Risks / TODO

- The app now avoids the previous completion simulation, but it still does not
  upload photos or create a private journey record because the private save API
  contract is not present in the inspected server code.
- The installed `@apps-in-toss/web-framework` package did not expose a typed
  `appLogin` export, so the client uses a runtime capability check. This should
  be revisited when the Toss SDK version is aligned with the official docs.
- The Stitch screens are reference designs and should be manually reviewed
  before translating them into React/TDS implementation details.
