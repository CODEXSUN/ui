# Supervisor audit — 2026-11-19

Status: done (shared UI0.1.12 published and verified). UIUX publication and deployment are separate owner stages.

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

Published UI release: version0.1.12, immutable annotated tag v-0.1.12, exact commit e88945f101313051ded3557e14b0363a0a6ca906. Status: done (library publication and tests); UIUX/application deployments remain separate. No UI standalone workflow/image manifest. Consumers may pin this published SHA now.

## Current supervision checkpoint — 2026-11-19

Approved owned releases are published and verified. UI is a library: no standalone Docker service/image/CI is fabricated.

| Scope | Exact published code / tag | Verification / current runtime |
| --- | --- | --- |
| UI shell/auth recovery | 0.1.12 / v-0.1.12 / e88945f101313051ded3557e14b0363a0a6ca906 | 71 tests and actual360–2560px HTTP/browser recovery audit passed |
| UI controlled remote list | 0.1.13 / v-0.1.13 / 984a9d2afd4dcfdc80bd1f940c9a94cb0dff298b | 80 tests, strict usage and five-width/cancellation/export tests passed |
| UI Comments Thread | 0.1.14 / v-0.1.14 / 9e386a2e8523f17a271f5e44a458f27e4fcecadf | 91 UI tests,7 isolated consumer tests, packed strict imports and ten light/dark width cases passed |
| UI Whiteboard tag observed separately | 0.1.15 / v-0.1.15 / 52111984ab80918242f86da27fc6eb9d5d4b1f52 | Remote tag/source inspection identifies Whiteboard scene preview/safe loading; AttachmentList is a separate unpublished native draft, not this tag |
| UIUX approved live app | 0.1.11 / v-0.1.11 / a3e8c565bf7bb516c1046f9e395805355525e9df | Hosted workflow44432981397 reconfirmed success; currently healthy on127.0.0.1:14315:4315, bundled UI0.1.12 |

Current UIUX running image matches its approved manifest: sha256:146e9e3d2eb533df1fe21b0bcada72ec2f37b9bc67fd2a11b2c8f508a042049f. Fresh live/ready/health/frontend/login-template200, same-origin200 and foreign Origin/Host403. No replacement/rebuild needed. Fresh shared-adapter verification was attempted but its exclusive operation.lock already existed (EEXIST); it was left untouched and remained present after a short wait. Previous app-owned adapter verification passed. This is a temporary re-verification coordination hold, not a failed health check or a reason to replace the app.

The native UI checkout remains dirty on baselinea8d1e1f8ebc50905f13f12b14b1af41f0f4f5933 with version0.1.15 metadata; that whole working tree is NOT an immutable published source identity. Likewise native UIUX baseline7aa864a021a5a43e1d0cf950e6baaddd51384d11 retains approved-release mirrors and concurrent preview edits. Releases above were constructed in isolated reviewed checkouts; no reset/stash or broad staging was used.

Pending concurrent contribution: Zetro owner reports assistant-sidecar.tsx, MainLayout assistant/search action wiring, optional Sheet overlay and FileUpload compact/selectionOnly plus UIUX SDK/example changes. Source owner final report is now ready at docs/assistant-sidecar-20261119.md; UI owner isolated review is in progress. SDK0.1.7 exact ede6b4e4effcb84f5838223f67d7b0aba64a1811 is published. These edits, attachment work and related previews are preserved. Independent review/tests and a fresh immutable UI release are the next prerequisite for assistant/UIUX; do not claim them released in0.1.14 or adopt a dirty branch. Existing small apps and already-approved UI0.1.12/0.1.13 consumers need no forced repin. No new functionality was added during this status checkpoint.

Current owned release reports: this file, supervisor-audit-20261119-pagination.md, supervisor-audit-20261119-comments.md; app runtime report: devkit/uiux/docs/supervisor-audit-20261119.md. No business SQL, app/infra restart, data/grant changes, migrations/reset/seed, public deployment or whole-stack rollout at this checkpoint.

Repository reconciliation: public main is UI0.1.16 at87f82393904777775b40922139740e070dd6bd20 (Whiteboard hydration regression), based on0.1.15 Whiteboard preview52111984ab80918242f86da27fc6eb9d5d4b1f52. Native AttachmentList version15 metadata is an unpublished draft and conflicts with that existing version; it is preserved, not relabelled or blindly included. The isolated assistant candidate is based on published0.1.16 and will use the next unused patch version, preserving Comments and Whiteboard releases.

## Latest reviewed capability stage — 2026-11-19

UI0.1.17 additive release is ready from public0.1.16, including reviewed assistant and AttachmentList.103 tests/strict installed SDK0.1.7 and generated-adapter checks pass. Saved AttachmentList draft0.1.15 is superseded by this release plan, not published over the existing Whiteboard tag. Exact source SHA and final status follow publication in supervisor-audit-20261119-capabilities.md. UIUX approved0.1.11 remains healthy; no library-only forced app replacement. Dashboard owners use existing full-width canvas with w-full min-w-0 p-4 sm:p-6 lg:p-8; retain workspace-list-content90% only for real Master Lists and their action alignment. No global CSS override or app-local margin patch is required.
