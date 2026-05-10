## UI tone alignment

- Date: 2026-05-10

### What changed

- Simplified Discover copy and changed the journey list into a horizontal carousel.
- Reduced explanatory UI copy across upload, organizing, timeline, and private draft screens.
- Kept the existing reducer/hash navigation and private draft flow unchanged.
- Adjusted custom CSS toward a quieter mobile UI: neutral background, smaller custom-card radii, less shadow, stable font sizes, and MomentBook green accent.

### Why

- MomentBook's native/product language emphasizes a calm photo-to-journey timeline.
- Apps in Toss guidance keeps TDS as the primary interaction system, so this change stays in the presentation layer and continues using existing TDS CTA/Button/TextField components.

### Files changed

- `src/App.tsx`
- `src/App.css`
- `index.html`
- `src/lib/momentbook.ts`
- `src/screens/DiscoverScreen.tsx`
- `src/screens/FeaturedJourneyScreen.tsx`
- `src/screens/FeaturedTimelineDetailScreen.tsx`
- `src/screens/UploadScreen.tsx`
- `src/screens/OrganizingScreen.tsx`
- `src/screens/TimelineScreen.tsx`
- `src/screens/PrivateDraftScreen.tsx`

### Verification

- `yarn eslint src/App.tsx src/screens/DiscoverScreen.tsx src/screens/FeaturedJourneyScreen.tsx src/screens/FeaturedTimelineDetailScreen.tsx src/screens/UploadScreen.tsx src/screens/OrganizingScreen.tsx src/screens/TimelineScreen.tsx src/screens/PrivateDraftScreen.tsx src/lib/momentbook.ts`
- `yarn tsc --noEmit`
- `yarn lint`
- `yarn build:web`
- `yarn dev:web --host 127.0.0.1 --port 5174`
- `curl -I http://127.0.0.1:5174/`

### Risks / TODO

- Browser screenshot automation is not available in this repo/session, so responsive visual review should be done manually on the running Vite server.
- `yarn build:web` still reports the existing large main chunk warning.
