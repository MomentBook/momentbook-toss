## Private draft flow redesign

- Date: 2026-05-10

### What changed

- Reframed the Toss mini app as a MomentBook acquisition flow: public journey examples first, private journey draft creation second.
- Replaced the `publish` screen route with `privateDraft` and changed completion copy to avoid implying server upload or public URL creation.
- Added editable journey title, description, cover photo, moment title, and moment memo fields to the organizing step.
- Updated product and ADR docs. ADR 0004 is now superseded by ADR 0006.
- Removed `src/screens/PublishScreen.tsx` and added `src/screens/PrivateDraftScreen.tsx`.

### Why

- The current Apps in Toss stage should not depend on Toss login, public server publish, or EXIF/GPS parsing.
- The native MomentBook product keeps public artifacts and private/local draft work separate, so the Toss mini app now mirrors that boundary.

### Verification

- `yarn lint`
- `yarn build:web`
- `yarn tsc --noEmit`
- `yarn dev:web --host 127.0.0.1` with elevated local server permission, followed by `curl -I http://127.0.0.1:5173/`

### Risks / TODO

- Browser visual automation was not available because the required in-app Browser Node REPL tool was not exposed in this session.
- The private draft is still in-memory only and is not restored after refresh.
- Moment count is still fixed to four slots. If users need add/delete moment controls, that should be a focused follow-up.
- Native app handoff/deep link is not implemented because no URL contract exists yet.
