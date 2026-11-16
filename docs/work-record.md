## Shared accordion

Added the shadcn/Radix accordion through public @workspace/ui exports. Reuses shared semantic tokens, Tailwind animation utilities, and existing reduced-motion rules. Verified package build, typecheck, and 5 tests, including single/multiple open states, disabled semantics, and accessible relationships. UIUX files were not changed.

## Shared Input

Added shadcn Input for Project Manager forms through public @workspace/ui exports, reusing existing utilities and tokens. Build and 5 tests pass.

## Workspace blocks and comparison audit — 2026-11-16

Reviewed the older E:/codexsun UI/UIUX workspace wiring without changing it. Added src/blocks MainWorkspace, MdiWorkspace and top/side/status bars with public workspace contracts and exports. UIUX owns the example state; shared blocks own composition only. See docs/workspace-audit.md. Package build and typecheck pass; all 8 tests pass. Browser verification covered document lifecycle, keyboard selection, draft retention, system dark appearance/reset and 390px layout. Next: missing form gallery sections and durable browser regression checks.


## Copied reference layout integration — 2026-11-16

Integrated the user-copied main-layouts, main-workspace and agent-workspace from D:/workspace/codexsun/packages/ui/src/layouts. Layout comparison confirms no markup, class or behavior changes beyond import adaptation and relocating notification CSS loading to the shared stylesheet. Added missing reference Avatar, Breadcrumb, Command, Dialog, DropdownMenu and Tooltip components; adapted their imports to existing Radix primitives and installed cmdk 1.1.1. Added missing popover/sidebar semantic aliases without changing existing theme values.

Public layout entry points are @workspace/ui/layouts/main-layouts, /layouts/main-workspace and /layouts/agent-workspace. Existing block MainWorkspace remains available; copied MainWorkspace is available through its layout entry or root LayoutMainWorkspace alias. UIUX now uses MainLayout as its app shell, preserving gallery specimens and existing provider. A host-only canvas minimum-height class enables the gallery to scroll inside the fixed shell. No reference repository files were changed and no staged work was removed.

Verification: UI build/typecheck and 8 existing tests pass; UIUX typecheck/build pass. Browser checked search filtering/selection, app launcher, notifications empty state, user menu, sidebar toggle, scrolling, dark theme and reset. Existing Vite module-directive warnings remain. Profile/sign-out remain disabled without host callbacks, as in the reference. Preview: devkit/uiux/docs/main-layout-preview.jpg from workspace root.

## Exact tenant sidebar reference — 2026-11-16

Traced the supplied expanded/collapsed CRM screenshots to platform TenantMainLayout, AppSidebar, SidemenuSection and Sidebar primitives in D:/workspace/codexsun. Replaced the earlier simplified SideMenu wiring with the actual reference components and tenant inset/provider settings; source comparison confirms only import adaptation in copied components. UIUX keeps its own labels and actions. Added missing dependencies, shared sidebar scrollbar rules and ring alias. Sidebar now collapses to icons instead of unmounting; version/settings footer follows the tenant source. See packages/ui/docs/sidebar-audit.md from workspace root.

Verification: UI/UIUX builds and typechecks pass; all 10 tests pass, including reference nested items and count badge coverage. Browser checked expanded/collapsed navigation, tooltip, footer and re-expansion. Previews saved in devkit/uiux/docs/sidebar-expanded-preview.jpg and sidebar-collapsed-preview.jpg. Reference repo unchanged. Existing module-directive build warnings remain.

## Layouts submenu and live previews — 2026-11-16

Added the requested Layouts sidebar parent with Main Layout, Main Workspace and Agent Workspace submenu entries. Each entry opens a live isolated frame using the public shared implementation and sample navigation/actions. Frames reuse the existing design provider and app preference key; no shared layout markup/styles were redesigned. Sidebar adapters recognize active descendants so the submenu remains expanded, and command search now includes nested navigation actions.

Validation: UI build and all 10 tests pass; UIUX typecheck/build pass. Browser verified submenu expansion, all three preview frames and Agent Workspace Chat selection. Screenshot: devkit/uiux/docs/layouts-submenu-preview.jpg. Existing build directive warnings remain.

## Reference appearance settings — 2026-11-16

Added the requested Settings page and connected the sidebar Settings action plus Open settings command. Settings opens Appearance first and supports reload at /?page=settings. Application shows only the real UIUX workspace details. Reference: D:/workspace/codexsun/apps/platform/web/src/desks/tenant/ApplicationSettings.tsx. Reused its appearance panel markup, mode cards, palette cards and navigation styling; tenant/Zetro business integrations were not copied into the gallery.

Shared AppearanceSettings and ten design palettes are public @workspace/ui exports. Palette definitions and scoped light/dark token rules come from the reference UI package; the shared provider persists palette with existing preferences and migrates legacy accent-only values. Existing ThemeSelector now offers the same palette choices and reset. No second theme provider or app-specific theme CSS was added.

Validation: UI build and 12 tests pass; UIUX typecheck/build pass. Browser verified sidebar navigation, Application/Appearance tabs, blue/orange palette changes, dark mode, settings page and preference persistence across reload, and reset to light/default. Screenshot: devkit/uiux/docs/appearance-settings-preview.jpg. Existing Vite directive warnings remain.

## Optional Overview navigation — 2026-11-16

Added optional showOverview to MainLayout/SideMenu, defaulting to true. UIUX sets false so Layouts is first while other consumers keep their existing Overview item. Shared build and 12 tests pass.

## Complete reference component catalog support — 2026-11-16

Added 52 missing component source modules from D:/workspace/codexsun/packages/ui/src/components, preserving existing implementations. Added required dependency declarations/lock entries and public component subpath exports. Copied the shared Mermaid renderer dependency and loader styles/assets needed by Markdown/Global Loader specimens. Sonner uses the existing DesignSystemProvider rather than introducing another theme provider. Extended existing Button with icon/render support and success/danger styles, Badge with reference success/warning tones, Card with reference title/description/action/small composition, and Accordion with an explicit contained variant. Existing variants/exports remain available.

Added validated componentDefaults to the existing app preference store and a shared default-reading hook. Button/Badge selections update their existing supported defaults; Accordion consumes its saved variant when no explicit variant is supplied. Other catalog choices remain saved gallery composition preferences because they describe examples/interaction states, not universal component props. Settings reset clears these preferences. Explicit variant specimens stay labelled and fixed.

Verification: UI build/typecheck and 15 tests pass, including every public component entry, persisted preference validation and extended variants. UIUX browser traversal verified all 73 reference component pages (148 previews). Browser additionally verified persistent Accordion defaults, actual Button default application, code/example loading, copy actions and Previous/Next navigation. No older reference files were modified.

## Consolidated block app header — 2026-11-16

Moved the block-page breadcrumb and import-path copy action into the shared app header. Block routes now show Blocks > App Layout > selected page (the composition page stops at App Layout), replacing the user-name label on the right. Removed the extra content header above Live preview. Added optional MainLayout header breadcrumb/action/name/class overrides; existing consumers retain previous defaults. Added the requested public @workspace/ui/layouts/main-layout alias to the existing main-layouts entry, and updated block usage snippets to that valid import path. Side Menu continues to identify its actual @workspace/ui export. Header wraps at narrow widths to keep breadcrumb labels readable.

Validation: UI/UIUX builds and UIUX typecheck pass; Node verified the singular public layout entry. Browser verified the breadcrumb pattern, absence of duplicate header, clipboard success feedback and responsive header wrapping. Screenshot: devkit/uiux/docs/consolidated-app-header-preview.jpg from workspace root. Existing Vite directive warnings remain.

## Version in status bar — 2026-11-16

Moved MainLayout's versionLabel from SideMenu to StatusBar. StatusBar accepts an optional versionLabel and aligns it at the far right. Settings stays in the sidebar footer. Shared build passes.


## MainLayout brand identity — 2026-11-16

Added optional companyBrand forwarding from MainLayout to the existing TopMenu branding contract. Existing consumers keep prior behavior unless branding is supplied. Shared build passes.

## Shared interactive cursors — 2026-11-16

Added a shared base rule for pointer cursors on enabled buttons, links, menus, selection controls, and custom data-clickable surfaces, with disabled cursor handling. Recorded the convention in the shared frontend guide.


## Cursor audit — 2026-11-16

Removed cursor-default overrides in seven menu/selection components and resize cursors on the click-only sidebar rail. Corrected data-disabled=false handling in shared base CSS. Browser checked all 73 component pages (7,053 enabled controls), five block pages, both layout pages and both isolated layout previews: no computed pointer gaps. Open dropdown items also verified. UI and UIUX builds passed.

## Shared shell and master lists — 2026-11-16

Added public MasterListV1 and MasterListStatus, based on Codexsun workspace/table and CRM enquiry list. Shared search, inline/popover filters, column visibility, numeric sorting, pagination, loading/error/empty states, and action menus. Added pure selection/sorting tests; shared build and all 17 tests pass.

## Master list contrast — 2026-11-16

Darkened MasterListV1 header from muted/50 to muted and increased row hover from muted/20 to muted/50, preserving theme tokens. Shared UI, UIUX and Project Manager builds pass.

## Default compact master list — 2026-11-16

Changed shared header to bg-accent, row hover to accent/80, header padding to 10px and data cell padding to 8px vertically. UI, UIUX and Project Manager rebuilt successfully. Browser confirmed semantic header color and compact cell padding.

## Columns dropdown — 2026-11-16

Matched reference with 224px menu, Visible columns header, Show all action, divider, and spaced checkmark items. Browser verified hiding Phone and restoring all six columns with Show all. UI, UIUX, Project Manager builds pass.

## Reference filter choices and badge — 2026-11-16

Referenced Codexsun workspace/filters.tsx. Replaced text popover with spaced Filter options menu, Clear, All records choice, app-defined predicates, counts, selected checkmark and removable active badge. Inline column text filters remain. UIUX supplies Active/Needs attention options; Project Manager supplies project states. Builds/typechecks pass. Browser verified counts (24/18/6), filtering, badge removal, and Clear.

## Icon toolbar actions — 2026-11-16

Filters and Columns now use icon-only buttons with accessible labels and shared shadcn/Radix tooltips on hover/focus. Menu behavior retained. Browser verified filter menu and keyboard-focus Columns tooltip. Shared UI, UIUX and Project Manager builds pass.

## Column filter toggle tooltip — 2026-11-16

Added shared tooltip to the search-bar column-filter toggle, showing Hide column filters or Show column filters based on its state. UI, UIUX and Project Manager builds pass.

## Row action menu — 2026-11-16

Added spaced icon actions, separators and destructive hover styling. Action contracts accept custom icons with sensible view/edit/delete defaults. UIUX demonstrates View, Edit, Suspend and Force delete using sample-only callbacks. Existing apps retain their own action permissions and callbacks. Builds and UIUX typecheck pass; browser verified four labels and sample suspension.

## Column filters default — 2026-11-16

Inline column filters start hidden and appear through the existing toggle. Shared UI, UIUX and Project Manager builds pass.

## Serial column — 2026-11-16

Added first # column with sequential row numbers across pagination. Updated filter-row alignment and loading/empty/error column spans. Shared UI, UIUX and Project Manager builds pass.

## Reference pagination — 2026-11-16

Matched Codexsun data-table-pagination: bordered footer with total/rows per page on left, showing range/Previous/numbered pages/Next on right. Added 20-row option and ellipsis for large page counts. All three builds pass.

## Unified pagination selector — 2026-11-16

MasterListV1 now uses shared shadcn Select and defaults to 100 rows. UIUX verified selection, next-page range and serial continuation. Project Manager excluded by user direction; its build restored to prior native 10-row selector and its source left unchanged.

## 2026-11-16 — Repository tools

- Adapted GitHub helper, version consistency, patch preview/update, changelog, optional SSH utility, and fixture tests from the governance app template (also used by Codeitz).
- Added npm commands and extended verify while preserving existing checks and versions.
- Verification: typecheck, build, existing tests, four tool tests, version checks, GitHub dry-run, version preview, and SSH help passed. No keys generated or Git publication performed.
- Workspace governance audit passed: 10 products, 24 owners, zero violations. This checks structure rather than domain behavior or tenant isolation.
- Before publishing: review changes and release details; explicitly authorize publication and configure the intended remote/upstream.

## 2026-11-16 — Local commit verification

- Re-ran verify: typecheck, build, existing tests, tool tests, and version consistency passed.
- GitHub helper audit and patch dry-run passed; current version remains 0.1.0 and preview is 0.1.1.
- User requested local-only work; GitHub repository creation and push are deferred. The helper combines commit/push, so local Git commit uses its audited subject directly.
