## Apple-inspired UI refresh

- Date: 2026-06-10

### What changed

- Created a Stitch project for the refresh direction:
  `projects/15193344340403912205`.
- Generated a Stitch Discover reference screen and design system:
  `projects/15193344340403912205/screens/491e2a62b7454da9b1e91158b80d5e8d`.
- Generated additional Stitch references for the remaining flow direction:
  `projects/15193344340403912205/screens/11d6d444088e4a8e9d79b32bd9a02a84`
  and `projects/15193344340403912205/screens/ca02a81f5a00437da2257b5852a1d078`.
- Reworked Discover to start with a photo-led hero instead of a text-only card.
- Reworked public journey detail moment rows so each moment opens with a
  prominent image and supporting photo strip.
- Reworked upload intake into a quiet photo tray empty state and grouped
  selected-photo surface.
- Reordered featured moment detail so the lead photo carries the title,
  summary, and date context.
- Added guided chrome descriptions for draft-building screens using existing
  screen metadata.
- Reworked the organizing body so the selected cover photo and active moment
  photos use larger artifact previews.
- Added organizing progress feedback for assigned photos without changing the
  reducer or screen access rules.
- Reworked private timeline preview into cover-led, flat artifact strips instead
  of nested preview grids.
- Reworked the private draft review state so the cover photo and draft metrics
  are visible before completion.
- Added a cover-photo result area to the private draft completion screen.
- Updated global and screen-level CSS toward a bright neutral gallery surface,
  restrained material layers, stronger artifact-first hierarchy, and reduced
  motion/transparency fallbacks.

### Why

- `docs/DESIGN.md` asks for Apple-inspired clarity without Apple brand copying:
  photos and timelines should lead, UI should stay calm, and public publishing
  must not be implied.
- ADR 0002 keeps TDS Mobile as the interaction baseline, so the refresh stays in
  presentation and composition layers and preserves existing TDS CTA/Button/input
  semantics.
- ADR 0003 and ADR 0006 keep reducer/hash navigation and private manual draft
  semantics unchanged.

### Verification

- `yarn lint`
- `yarn build:web`
- `yarn dev:web --host 0.0.0.0 --port 5173`
- `curl -I http://127.0.0.1:5173/`

### Risks / TODO

- `yarn build:web` still reports the existing large main chunk warning.
- No browser screenshot automation tool is available in this session, so compact
  mobile overflow and visual hierarchy should still be manually reviewed in the
  running Vite preview.
