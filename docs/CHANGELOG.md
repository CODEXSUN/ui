# ui Changelog

## Version State

Current version: 0.1.20

Release tag: v-0.1.20

Changelog label: v 0.1.20

Published source release; immutable tags identify their reviewed commits. Application deployment is a separate verified stage.

## v-0.1.20

### [v 0.1.20] 2026-11-20 - Preserve privileged sign-in for management workspaces

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.20.
- Allow management workspaces to opt in to administrator and super-admin sign-in routes while preserving the default denial for ordinary apps.

## v-0.1.19

### [v 0.1.19] 2026-11-19 - Tab-aware app launcher and explicit sign-in routes

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Add optional session-authorized launcher catalogue wiring through MainLayout and TopMenu, current SDK tab header, same-origin/URL validation, cancellation and new-tab/no-opener links. Static items and callbacks remain supported.
- Exact /login prepares a fresh ordinary-app sign-in by delegating current-tab logout to the client; success normalizes the route and notifies parent routers before workspace content mounts. Ordinary /sa/login and /admin/login clearly reject unsupported realms.
- Preserve published drawing resolutions and all other UI18 features. Verified117UI tests,4release-tool tests, build/type checks and strict packed SDK0.1.10 consumer/browser fixtures; no deployment or DB changes.

## v-0.1.18

### [v 0.1.18] 2026-11-19 - Patched drawing dependency resolutions

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Patched producer drawing dependency resolution: Nanoid3.3.20 (editor), Nanoid5.1.16 (converter), lodash-es4.18.1 and KaTeX0.18.10; retain Excalidraw0.18.1, converter2.2.2 and Mermaid11/12 contracts.
- Added an actual-resolution security regression and documented the required standalone-consumer root override policy.
- Verified clean install/build, producer and configured packed-consumer audit zero, and production browser drawing/math/conversion/PNG tests. This is scoped dependency remediation, not a general security certification. No app deployment or DB changes.

## v-0.1.17

### [v 0.1.17] 2026-11-19 - Shared assistant sidecar and saved attachment capabilities

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.17.
- Add optional lazy assistant sidecar/chat panel and saved AttachmentList with public contracts. Preserve default FileUploadProps normal-upload compatibility; add FileSelectionProps/compact local selection and opt-out Sheet overlay. Fix demonstrated stale dictation/pending-send issues, verify103 tests, strict installed SDK0.1.7/adapter consumption and actual responsive/theme checks. No new runtime dependency or database changes.

## v-0.1.16

### [v 0.1.16] 2026-11-19 - Verify whiteboard hydration before serialization

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.16.
- Add the passing hydration regression: premature saves reject, loaded elements survive, edits trigger dirty state and intentional clear remains allowed.
- No runtime changes from 0.1.15.

## v-0.1.15

### [v 0.1.15] 2026-11-19 - Whiteboard scene previews and safe loading

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.15.
- Export WhiteboardPreview through the existing public whiteboard entry: PNG scene previews, loading/empty/error states and object URL cleanup.
- Guard serialization until initial scene hydration completes; keep editor and preview lazy-loaded.
- Verified TypeScript build and browser drawing/draft/status/refresh/card navigation in Codeitz.

## v-0.1.14

### [v 0.1.14] 2026-11-19 - Publish reusable Comments Thread and scope-safe interactions

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.14.
- Publish CommentsThread and public types/exports with scope-safe UI state, escaped text, revision snapshots, current capability checks and accessible cancellation/error handling. Verify91 UI tests,7 consuming browser tests, strict packed declarations and ten light/dark viewport checks. No backend/auth/data ownership or runtime dependency changes.

## v-0.1.13

### [v 0.1.13] 2026-11-19 - Add controlled server pagination to Master List

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.13.
- Add optional controlled server pagination/search/sort/filters with server totals/facets, bounded sizes and honest export scopes; retain local mode. Verify80 tests, strict typed usage, actual360–2560px layout and stale-request cancellation in the consumer example. No runtime dependencies or database changes.

## v-0.1.12

### [v 0.1.12] 2026-11-19 - Recover workspace access and contain responsive shell

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.12.
- Recover transient workspace access failures with bounded retry/cancellation; distinguish401 and403 and prevent duplicate login submissions. Contain responsive shell widths and truncate long mobile identities. Verified71 tests and actual360–2560px Edge dashboard/recovery fixtures.

## v-0.1.11

### [v 0.1.11] 2026-11-18 - Shared application blocks and reusable templates

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.11.
- Extract shared Detail Table, Diagram Editor, Schema Fields Editor, lazy Whiteboard and static Public Site Controls.
- Add separate UIUX previews and current public-import usage; new app template v25 reuses shared blocks and controls.
- Keep app data, permissions, validation and persistence app-owned.
- UIUX Docker update target: loopback 14315 to internal 4315; requires successful tagged CI and CodeShip verification.
- No database migration, Ecommerce change or Project Manager rebuild.
- Verified 64 UI tests, shared build and clean-install lock consistency.

## v-0.1.10

### [v 0.1.10] 2026-11-18 - Align workspace password form with Platform eight-character policy

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.10.
- Align the workspace password-change form with the reviewed Platform minimum of eight characters. Preserve session and submission guards.

## v-0.1.9

### [v 0.1.9] 2026-11-18 - Publish server-priced checkout presentation inputs

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.9.
- Add optional app-owned checkout fields, payment content, summary rows, disabled/submit labels and receipt confirmation copy while preserving existing defaults. Business/provider decisions remain in Ecommerce. Full typecheck/build, sixty UI tests and four tool tests passed. No database changes.

## v-0.1.8

### [v 0.1.8] 2026-11-18 - Shared workspace access and storefront refinements

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.8.
- Publish the shared workspace access gate and current registration/storefront presentation refinements for coordinated app releases. Typecheck, build, sixty UI tests and four release-tool tests passed. No database changes.

## v-0.1.7

### [v 0.1.7] 2026-11-18 - Canonical release files and guarded tagged publishing

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.7.
- Normalize release source line endings across Windows/Linux, preserve scoped publishing safeguards, and reject staged whitespace errors or hook-modified release trees. Earlier tags remain unchanged. No database/schema or application behavior changes.

## v-0.1.6

### [v 0.1.6] 2026-11-18 - Shared controls, Silver theme and release support

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.6.
- Shared Silver defaults, form/navigation/card/ring components, file upload and ecommerce presentation updates. Typecheck/build, 60 component/behavior tests and four repository-tool tests passed.

## v-0.1.5

### [v 0.1.5] 2026-11-18 - Silver visual consistency and shared app defaults

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.5.
- White top menu, barely tinted app header, muted table header and matching Master List row hover.
- Shared Silver rollout preserves user mode/component choices and later Appearance selections.
- Updated shared colour guidance, verification logs and future-app defaults.
- Verification: shared UI build and focused tests, UIUX route/form checks, and nine consumer builds passed in the development workspace. Project Manager excluded.

## v-0.1.2

### [v 0.1.2] 2026-11-16 - Slim scrollbars and clean notification feedback

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.2.
- Add shared 4px native scrollbars and slimmer ScrollArea styling.
- Refine Sonner surfaces, theme support and public toast API; preserve legacy exports and fix toast dismissal cleanup.
- Verify shared builds, feedback lifecycle tests and repository release checks.

## v-0.1.1

### [v 0.1.1] 2026-11-16 - Shared app blocks and branded authentication templates

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Bumped @workspace/ui version to 0.1.1.
- Added reusable form controls, upsert fields, shared app blocks and role-branded authentication templates.
- Added early theme initialization, accessible progress values and copyable preview/source blocks.
- Verified typecheck, production build, component tests, release-tool tests and version consistency.

## v-0.1.0

### [v 0.1.0] 2026-11-16 - Add repository tools

#### Database Changes

- Database update: No (manual).

#### App Codebase Changes

- Wire template GitHub audit, patch preview/update, version consistency, and tool tests.
- Preserve the existing package and dependency versions.
