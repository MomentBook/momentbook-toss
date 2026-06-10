# ADR 0002: Adopt TDS Mobile And Mobile-First UI

- Status: Accepted
- Date: 2026-04-18
- Scope: UI language, mobile layout, Toss-native interaction patterns
- Read when: changing UI components, CTAs, inputs, loading states, layout, or
  mobile interaction behavior

## Decision

MomentBook Toss uses TDS Mobile as the default UI language and keeps the app
mobile-first.

- Prefer TDS Mobile components for interactive controls.
- Keep custom CSS focused on layout, composition, and MomentBook brand tone.
- Maintain a single-column mobile-first flow unless a new product decision says
  otherwise.

## Context

The app runs in a Toss WebView, so its UI should feel native to the Toss
environment while still carrying MomentBook's calm, artifact-first tone.

The current code already follows this direction:

- `src/main.tsx` wraps the app in `TDSMobileAITProvider`.
- Main actions use TDS components such as `Button`, `FixedBottomCTA`, and
  `Loader`.
- Layout and branding live mostly in `src/App.css`.
- Screen width, safe area padding, and bottom CTA behavior assume mobile use.

## Operating Rules

- Check TDS Mobile before adding custom buttons, loaders, bottom CTAs, input
  fields, or common controls.
- Preserve bottom CTA and safe-area behavior when changing screens.
- Avoid copy or CTA states that imply public publishing has happened.
- Test compact mobile widths for Korean text overflow.
- Do not incidentally rewrite unrelated Korean mojibake while doing UI work.

## Consequences

- Users get a Toss-appropriate interaction model.
- The app avoids maintaining a complete custom component system.
- React and TDS version upgrades must be checked together.
- Heavy custom interaction patterns increase maintenance cost and should be
  justified by a product need.

## Revisit When

- TDS Mobile no longer supports the required React/runtime version.
- MomentBook Toss needs a UI pattern that TDS cannot reasonably express.
- The app moves out of Toss and needs a different design system.

## Alternatives Considered

- Fully custom HTML/CSS component system
- React Native-only TDS surface
- Page-by-page design without a shared UI language

## References

- TDS overview:
  https://developers-apps-in-toss.toss.im/design/components.html
- Apps in Toss WebView design:
  https://developers-apps-in-toss.toss.im/design_tutorials/webview.html
- TDS Mobile Button:
  https://tossmini-docs.toss.im/tds-mobile/components/button/
- TDS Mobile FixedBottomCTA:
  https://tossmini-docs.toss.im/tds-mobile/components/BottomCTA/fixed-bottom-cta/
- TDS Mobile Loader:
  https://tossmini-docs.toss.im/tds-mobile/components/loader/
