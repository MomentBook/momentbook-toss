# ADR 0006: Keep Toss V1 Private And Manual

- Status: Accepted
- Date: 2026-05-10
- Scope: Toss v1 product flow, private draft semantics, manual moment grouping
- Read when: changing journey creation, publish/private copy, photo grouping,
  completion screens, or server/account assumptions

## Decision

Toss v1 remains a private, manual journey draft composition flow.

- Public journey browsing is an example/acquisition surface.
- User-created journeys are limited to photo selection, title/description,
  cover photo selection, manual moment grouping, notes, private timeline
  preview, and private draft completion.
- Completion is not real publish.
- Server storage, public URL creation, Toss login token exchange, and native
  account linking are not implemented.
- EXIF/GPS-based automatic grouping is not implemented.

## Context

MomentBook Toss shifted from an automatic organization prototype to an Apps in
Toss acquisition mini app. The current goal is to let users understand the
MomentBook artifact model before installing or signing in: a journey is not
just a photo pile, but a sequence of moments.

Apps in Toss can fetch album photos, but tying product value to EXIF/GPS quality
is risky for this stage. Manual moment grouping works across browser, sandbox,
and Toss contexts without assuming complete metadata.

Real public publishing, Toss login integration, account linking, uploads, and
moderation should wait until business registration and backend/auth contracts
are ready.

## Operating Rules

- Use private draft language in product copy and code semantics.
- Do not imply that a public journey has been created.
- Do not add server write/publish behavior without a new ADR.
- Do not add Toss login token exchange or native account linking without a new
  ADR.
- Keep manual moment grouping usable even when photo metadata is missing.
- Keep `photos: read` permission aligned when changing photo selection.

## Consequences

- Users can try MomentBook's structure without public exposure or login
  pressure.
- The mini app can be validated without upload, auth, CORS, moderation, or
  publish contracts.
- Metadata quality does not block the core flow.
- Legacy `publish` naming must not leak into user-facing copy.
- Real publishing requires future authentication, storage, upload, and content
  safety decisions.

## Revisit When

- Business and platform prerequisites allow real public publishing.
- Toss login and token exchange contracts are ready.
- Native MomentBook account linking becomes part of the product.
- Server-backed draft recovery or public journey mutation enters scope.

## Alternatives Considered

- Publish directly from the Toss mini app.
- Add Toss login and server storage first.
- Keep EXIF/GPS automatic grouping.
- Show only native-app conversion without an in-Toss creation experience.

## References

- Apps in Toss fetchAlbumPhotos:
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%82%AC%EC%A7%84/fetchAlbumPhotos.html
- Apps in Toss permissions:
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B6%8C%ED%95%9C/permission.html
- Apps in Toss appLogin:
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EB%A1%9C%EA%B7%B8%EC%9D%B8/appLogin.html
- TDS TextArea:
  https://tossmini-docs.toss.im/tds-mobile/components/TextField/text-area/
