# ADR 0009: Use Toss Login Private Server Save Flow

- Status: Accepted
- Date: 2026-06-10
- Scope: product flow, Toss login boundary, private server save, manual moment grouping
- Read when: changing journey creation, login, upload, save completion, photo grouping, or publish/private copy
- Supersedes: [0006](0006-keep-toss-v1-private-and-manual.md)

## Decision

MomentBook Toss launch target is a Toss login based private server save flow.

- Users select travel photos, enter journey basics, manually compose moments,
  review the timeline, then save the journey privately to the server.
- The flow uses Toss login to obtain an `authorizationCode` in the client and
  sends that code to the server.
- Token exchange, access token issuance, refresh token storage, and user lookup
  are server responsibilities.
- Public URL creation, public publishing, and native MomentBook account
  auto-linking are out of scope for this Toss mini app flow.
- EXIF/GPS automatic clustering is not required. Users can organize photos
  manually even when metadata is unavailable.

## Context

The earlier Toss v1 decision kept user-created journeys as private in-memory
draft simulations because business, auth, and upload contracts were not ready.
The launch goal has changed: users should be able to finish meaningful work in
Toss by saving their organized travel record privately to the server.

Apps in Toss can fetch album photos in WebView and can request Toss login. Toss
login documentation states that `appLogin` returns an authorization code in the
client, and that token exchange and token storage must be handled by the server.
This repository already has public API/Web origins in client-visible Vite env
vars, but it does not currently implement the private save API client.

## Operating Rules

- Keep the flow short: photo intake, journey basics, moment compose, review
  upload.
- Start moment composition with three default moments and allow users to add
  more when needed.
- Do not require every selected photo to be assigned to a moment. Save
  unassigned photos as unorganized photos with the private journey.
- Keep `photos: read` permission aligned across code, Granite config, and the
  Toss console when photo behavior changes.
- Keep Toss SDK calls behind the local runtime adapter boundary.
- Do not perform token exchange or store access/refresh tokens in the WebView
  client.
- Confirm the existing private save API endpoint, request shape, response shape,
  CORS behavior, retry semantics, and failure copy before implementing upload
  code.
- Use private save language in product copy. Do not imply public publishing or
  public URL creation.

## Consequences

- The mini app becomes a completion-oriented creation flow instead of only an
  acquisition preview.
- Backend auth and private upload contracts become required before code can
  complete the launch behavior.
- Manual organization remains resilient when EXIF/GPS data is missing.
- The UI must support login, upload progress, recoverable upload failure, and
  private save completion states.
- Server-side content safety, ownership, and deletion policies remain outside
  this WebView client decision but must be handled by the backend product.

## Revisit When

- Public publishing or public share URLs enter the Toss mini app scope.
- Native MomentBook account linking becomes part of the launch flow.
- Server-backed draft recovery or cross-device editing is required.
- Toss changes login, photo permission, or WebView upload constraints.

## Alternatives Considered

- Keep the Toss mini app as a private local draft simulation.
- Publish directly from Toss and create a public URL at completion.
- Send users to the native MomentBook app for all upload and save behavior.
- Require every selected photo to be assigned to a moment before upload.

## References

- Apps in Toss appLogin:
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EB%A1%9C%EA%B7%B8%EC%9D%B8/appLogin.html
- Apps in Toss fetchAlbumPhotos:
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EC%82%AC%EC%A7%84/fetchAlbumPhotos.html
- Apps in Toss permissions:
  https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B6%8C%ED%95%9C/permission.html
