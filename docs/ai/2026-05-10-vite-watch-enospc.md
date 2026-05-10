# Vite watcher ENOSPC mitigation

- Date: 2026-05-10
- Scope: local development server reliability

## What changed

- Configured Vite dev server watch options to ignore non-runtime directories.
- Switched Vite dev watching to polling so `yarn dev` and `yarn dev:web` do not depend on the host's shared inotify watcher limit.

## Why

The local dev server failed with `ENOSPC: System limit for number of file watchers reached` while Vite was trying to watch `docs`. This repository is small, and polling avoids the shared watcher limit with low practical overhead.

## Verification

- Passed: `yarn tsc --noEmit`
- Passed: `yarn lint`
- Passed: `yarn build:web`
- Passed: `yarn dev:web --host 127.0.0.1` startup check, then stopped
- Passed: `yarn dev` startup check for Granite and Vite, then stopped

## Risks

- Polling can use more CPU than native file watching, but the app source tree is small and non-runtime directories are ignored.
