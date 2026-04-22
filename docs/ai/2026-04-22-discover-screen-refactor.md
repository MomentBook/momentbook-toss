## DiscoverScreen refactor

- Date: 2026-04-22

### What changed

- Replaced the Embla-based Discover carousel with a simple list of journey cards.
- Rebuilt the Discover layout on top of existing shared card patterns instead of slide-specific state and transform rules.
- Removed the unused `embla-carousel-react` dependency from `package.json` and `package-lock.json`.

### Why

- The previous implementation depended on JS-driven active slide state plus tightly coupled CSS transforms, which made the screen harder to reason about and more fragile to maintain.
- The new structure keeps the same navigation behavior while reducing moving parts and making the UI easier to verify.

### Verification

- `npm run lint`
- `npm run build:web`

### Risks / TODO

- The Discover screen no longer has carousel-style browsing behavior; it now optimizes for stability and readability over motion-heavy presentation.
- The web build still reports the existing large bundle warning, which is unrelated to this refactor.
