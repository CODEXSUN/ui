# Supervisor audit — 2026-11-19

Status: release-ready (shared UI). UIUX follows after this dependency is published.

## Root causes and changes

WorkspaceAccessGate previously requested login context after every session failure, including startup503/network and denied403, with no automatic retry. It now retries transient TypeError/network,408,429 and5xx six times at1/2/4/8/8/8 seconds; only401 opens sign-in.403 stays denied. Connecting/manual retry remain visible, checks coalesce, cleanup cancels timers and ignores late results, and a synchronous latch prevents duplicate login submissions. Client HTTP/auth/permissions stay app-owned; no auth bypass.

The shared shell lacked explicit width/min-width constraints and top-menu long identities could resist shrinking. Shell/canvas now use available width and contain local scrolling; mobile brand text yields to logo and truncated app name while desktop retains full identity. UIUX independently uncaps layout/component/list preview wrappers and bounds Tailwind source discovery; readable form/template widths remain intentional.

Exact UI files: src/blocks/auth/workspace-access-gate.tsx; src/layouts/main-layouts/app-layout.tsx, main-layout.tsx, top-menu.tsx, workspace-canvas.tsx; tests/workspace-access-gate.test.mjs; package.json/package-lock.json (test-only jsdom31.0.1 and version); docs/CHANGELOG.md; docs/work-record.md; this report/evidence.

## Verified evidence

- UI typecheck passed2.09s; build passed2.37s. All71 tests passed sequentially in43.61s, including7 auth tests. Focused auth tests passed1.05s on Node26.13.1. First cold jsdom import was slow (up to143s); warm import completed and no tests were skipped. No DOM dependency downgrade shipped.
- Actual isolated headless Edge used a fresh automation profile, disposable HTTP session fixture and real shared shell/dashboard. No user profile, production credentials or app records were touched.
- Default live UIUX baseline had no document overflow at360/768/1440 (not falsely reported as broken). Stress fixture uses deliberately long brand/app names.
- After: viewport/document widths360/360,768/768,1440/1440,1920/1920,2560/2560. Canvas/content widths360/360,458/458,1130/1130,1610/1610,2250/2250. Top controls fit all five widths. Wide dashboards demonstrably exceed1280px. Mobile screenshot visually reviewed; single column and readable.
- HTTP recovery503,503,200 completed in4111ms including navigation. Three session requests; zero login-context requests.403 stayed denied without a form.401 requested context; two same-tick submits made one login request. Unmount before retry left exactly one session request after1600ms. Unit tests additionally verify bounded retry/manual reset and ignored pending resolutions after unmount.
- Evidence/scripts: docs/supervisor-audit-20261119/browser-evidence.json and after-{360,768,1440,1920,2560}.png. Reusable audit runner lives in the local isolated directory C:/Users/sunda/AppData/Local/Temp/ui-supervisor-20261119/browser/{after,server}.mjs. It serves only a disposable test fixture; individual app flows still need their owner checks. No live app mutations.

## Release and deployment handoff

UI0.1.12 / immutable v-0.1.12 is prepared. Exact published commit is recorded in the follow-up handoff after publication. UI is a library: no standalone container image/manifest or runtime migration. UIUX must pin the published SHA, not a dirty branch. Framework0.2.0 prerequisite51daaa2a7bee32d0a8eca806a2b0e8a765a3e1ac is published; consumers must wait its workflow as appropriate.

No module/database changes, migrations, reset/reseed, data/grant changes or Docker replacements. Existing CommentsThread and other unrelated work excluded. No SDK/Platform/Billing edits. CodeShip alone deploys approved immutable images with the operation lock; source publication is not a live deployment. Future app-owned max-width wrappers remain their owners' responsibility.
