# Yarn runtime alignment

- Date: 2026-05-10
- Scope: package manager/runtime workflow only

## What changed

- Switched the project package manager from npm to Yarn 4.9.2 via `packageManager`.
- Added `.yarnrc.yml` with `nodeLinker: node-modules` to preserve the current Vite/Granite/node_modules execution model.
- Pinned direct dependencies to the versions previously resolved by `package-lock.json` so the package-manager migration does not also upgrade the Apps in Toss SDK or build tooling.
- Replaced npm-oriented documentation and agent verification commands with Yarn commands.
- Removed npm-only install artifacts in favor of a generated `yarn.lock`.

## Why

Apps in Toss WebView documentation supports Yarn install/dev/build flows, and Yarn recommends Corepack-managed per-project package manager versions. The sibling MomentBook project also uses Yarn Modern, so this keeps local operation closer across projects without moving this app to PnP.

## Verification

- Passed: `yarn install`
- Passed: `yarn lint`
- Passed: `yarn tsc --noEmit`
- Passed: `yarn build:web`
- Passed: `yarn build`
- Passed: `yarn dev:web --host 127.0.0.1` startup check, then stopped
- Passed: `yarn dev` startup check for Granite and Vite, then stopped

## Risks

- `yarn install` reports peer dependency warnings from upstream Apps in Toss/React Native compatibility packages; lint, typecheck, web build, AIT build, and dev startup still pass.
- Real Sandbox/Toss device behavior still depends on Apps in Toss runtime behavior and console-aligned `granite.config.ts` values.
