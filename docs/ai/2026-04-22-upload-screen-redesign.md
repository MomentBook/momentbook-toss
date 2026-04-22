## UploadScreen redesign

- Date: 2026-04-22
- Stitch reference: `projects/4834941523510891029/screens/203c4aa560b5434c8d71a3ef917bd191`

### What changed

- Reworked `UploadScreen` around four practical states: empty, full-screen loading, selected, and recoverable error.
- Added inline loading/error feedback for re-pick attempts so existing selections stay visible instead of disappearing behind toast-only feedback.
- Reduced preview density for larger selections by showing up to five thumbnails plus a summary tile.
- Collapsed the upload preview grid to two columns on narrow phones to match the rest of the flow more closely.

### Why

- The previous screen only expressed empty and selected states, which made the first step feel under-specified compared with the rest of the product.
- The redesign prioritizes task completion and low cognitive load: one clear next action, compact metadata, and minimal explanatory copy.

### Verification

- `npm run lint`
- `npm run build:web`

### Intentional deviations from Stitch

- Kept the existing no-chrome upload entry pattern instead of introducing a new top app bar, to stay aligned with the current app flow.
- Used the existing `FixedBottomCTA` as the primary next-step action, with the in-card button handling photo picking or retry only.

### Risks / TODO

- Upload still does not support per-photo removal or add-vs-replace semantics on this step.
- Runtime badge visibility on the upload step is still implicit through copy rather than explicit chrome.
