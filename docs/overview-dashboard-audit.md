# Shared overview dashboard

Public exports from @workspace/ui: OverviewDashboard, OverviewModulePanel and their prop/metadata types. Apps own modules, metrics, permissions, data connections and route callbacks. No records are fetched or saved by these blocks.

- OverviewDashboard composes shared cards, badges and buttons with an accessible metric section, module actions and app-supplied activity/guidance. Null metrics render an unavailable dash; a measured zero remains zero.
- OverviewModulePanel shows scope, future measures and honest disconnected status with a return callback. These initial panels describe modules; they are not CRUD implementations.
- UIUX example and usage: /previews/overview-dashboard, documented in devkit/uiux/docs/overview-dashboard.md. Sample data appears only in the labelled UIUX preview.

## Verification — 2026-11-16

Shared UI build/typecheck and 32 tests passed. UIUX build/typecheck and 16 tests passed. All five apps passed builds/typechecks and eight tests each. No dependencies were added.

Browser verified all five dashboards and all 20 module pages: card links, direct refresh, Back/Forward, Settings/Records regressions, unknown-module recovery, command navigation, dark-mode reload and original theme restoration. At 390px, all module headings remain visible after navigation, pages stay within viewport width and mobile drawers close after selection. No captured browser console errors.

Workspace governance audit passed: 10 products, 24 owners, no violations. That audit verifies structure rather than implemented business behavior.

Metrics/activity stay unavailable until real business data is connected. No business writes, authentication or tenant claims, migrations, runtime MCP execution or cloud publishing were introduced. Other in-progress shared UI/UIUX work is excluded from this commit.

## 2026-11-16 — Dashboard re-audit

- Updated module action names to include the visible Open module label and its destination, supporting speech and screen-reader navigation.
- Replaced the fixed module heading ID with React useId so multiple dashboards have distinct, correctly referenced headings. Added a composition regression test.
- Shared UI build and 34 tests passed; current UIUX typecheck/build and 16 tests passed. Five app typecheck/build suites and eight tests each passed (90 tests total across these owners).
- Rechecked all dashboard/module routes, Settings, Records, recovery, direct refresh, history, breadcrumbs, keyboard commands, cursors, app switching and dark reload. At 390px, all 20 module pages retain visible headings and no page overflow; Records/Settings and drawer dismissal passed in every app. No captured console errors.
- Refreshed app lockfiles to record installed local UI 0.1.1. All five dependency audits report zero vulnerabilities. Structural governance audit: 10 products, 24 owners, zero violations.
- Disconnected business data and existing client-directive build warnings remain. No business operations or cloud publication were introduced. Unrelated agent-chat work was preserved.
