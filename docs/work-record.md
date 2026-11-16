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

## Upsert Form v1 — 2026-11-16

Added UpsertForm, UpsertFormSave, UpsertFormHeader and UpsertFormSection public blocks with header-associated submit, native validation, Ctrl/Cmd+S, saving guard, error/status and optional related panels. Shared build passes; browser verifies create/edit submits and validation through UIUX.

## CRM form control blocks — 2026-11-16

Added FormLookup, FormSelect, FormDatePicker and FormAnimatedTabs public blocks. Lookup/date/select adapted from Codexsun workspace references; shared theme backgrounds, Select Create/name/required, measured animated underline with reduced motion. Declared existing date-fns dependency. Shared build and two focused form-control tests pass.

## 2026-11-16 — Reference workspace editor

- Added exported WorkspaceEditor adapted from E:/Workspace/codexsun/devkit/packages/ui/src/workspace/editor.tsx at the user's request. MIT attribution is retained in docs/licenses/codexsun-editor.txt. Existing RichTextEditor is preserved.
- Updated imports for this package, matched installed Tiptap 3.34 dependencies, disabled duplicate StarterKit extensions, kept sandboxed HTML preview, and removed an unsupported attachment prompt. Project Manager reuses the public export for notes and modules.
- UI build and all 20 shared UI tests passed; browser verified rich text entry and SQLite save/reload in Project Manager.

## Default form pattern — 2026-11-16

Promoted UpsertFormField, UpsertFormValidationSummary and light-red validation CSS into shared public UI; removed preview-only copies. Field/summary association tests and shared build pass.

## Select creation removed — 2026-11-16

Removed Create from FormSelect API and preview/usage. Fixed choices only; Create new stays in FormLookup. Updated form standard. Shared UI build and UIUX typecheck/build pass. Project Manager untouched.

## Animated tab strip overflow — 2026-11-16

Removed vertical overflow/scrollbar from tab strip and hid scrollbar chrome while retaining horizontal scrolling on narrow screens. Shared UI and UIUX builds pass. Project Manager untouched.

## Named form-control public entries — 2026-11-16

Audited four control pages and added form-lookup, form-select, form-date-picker and form-animated-tabs public exports with TS declarations. Barrel remains compatible. Node import smoke test verifies every named entry equals its barrel export. Shared build passes.

## 2026-11-16 — WorkspaceEditor reader mode

- Added optional readOnly support: render parsed content without the toolbar, disable content editing, and suppress update emission when changing editability. Added Tailwind typography utilities for headings/lists/quotes/code/links.
- Shared UI build and all 20 tests passed; Project Manager browser verification confirmed contenteditable=false in note reader and normal editing/save behavior.

## App UI reuse migration — 2026-11-16

Extracted settings nav, progress/stages, activity feed, check output, master/detail record selector, information panel, preview/code copy and import copy blocks; centralized clipboard hook. Public exports added, shared build and 24 tests pass.

## 2026-11-16 — Shared TodoWorkspace

- Added public blocks/todo-workspace with shared shadcn menus, inputs, checkboxes, badges and confirmation dialog; compact themed composition, project initials, inline draft handling and async save feedback.
- Includes pointer-capture drag ordering and Alt+Arrow keyboard movement; persistence and business data remain app-owned. Added documented props and a typed UIUX preview/usage. Shared build and Codeitz consumer checks pass; browser ordering and metadata flows verified against isolated SQLite records.

## 2026-11-16 — Todo category and edit stability

- Category typing applies to the todo draft without an extra check click; selected categories remain visible in the menu. Save controls persistence and Cancel retains saved data.
- Stabilized status spacing and row height, and prevented edit autofocus scrolling. Verified category Save/refresh and unchanged row position in an isolated Codeitz browser session. Shared build and 27 tests passed.

## Shared auth and frontend delivery — 2026-11-16

Added public Codexsun-derived auth pages, AsyncState/ContentBoundary, ConfirmAction and early theme initializer. Fixed Progress value/max forwarding and accessible code panels. Shared build and 27 tests passed; UIUX verified consuming routes. Apps own auth/persistence callbacks. See central frontend-delivery.md and UIUX frontend-audit-2026-11-16.md. Project Manager excluded.


## 2026-11-16 — Category menu and timer

- TodoWorkspace lists saved categories and shows + Add category at the bottom with inline Save/Cancel and async error handling. Added optional onCreateCategory adapter.
- Added a separate shared timer popover for local date/time scheduling, draft-safe submission and saved-row callbacks. Scheduled/due display reads supplied app data; SQLite and reminder delivery remain Codeitz-owned. Shared build, 27 tests and consuming browser checks passed.

## Password lifecycle templates — 2026-11-16

Added separate Reset Password, Change Password and Email Verification pages with public shared auth imports, helper text, busy/error state and typed usage. Password confirmation blocks mismatches and uses the shared light-red invalid ring. Verification supports app-owned resend and cooldown. Gallery callbacks only demonstrate behavior; no real credentials, tokens or accounts are changed.

Shared build and 28 tests passed. UIUX typecheck/build and 15 tests passed. Browser checked all three direct routes and usage panels, mismatch prevention, successful sample submissions and resend feedback. Generator v13 passed four tests including generated examples for all six distinct auth blocks. Production builds retain existing dependency directive warnings. Project Manager was not edited or rebuilt.

## 2026-11-16 — Inline record editing

- Added public blocks/inline-edit exports InlineEdit and InlineDetails, with shared inputs/selects, explicit async Save/Cancel, error feedback, keyboard cancellation and named edit actions.
- Added UIUX catalog preview/usage and semantic rendering tests. Shared UI build and 32 tests passed; UIUX typecheck/build passed. Project Manager modules consume the public controls.

## Page Template consistency audit — 2026-11-16

Unified shared auth helpers/inline validation, required indicators, unique IDs, autocomplete and primary button tone. Added registration confirmation and configurable login/register password length. Fixed role/variant usage, embedded landmarks and preview error/loading/clear controls. New app template v14 mirrors the compiled examples; governance documents the full matrix. Shared build/32 tests, UIUX typecheck/build/16 tests and four generator tests pass. All nine desktop template routes and supported split variants checked. See UIUX docs/page-template-audit.md. Project Manager not edited/rebuilt.

## App logo and auth role badges — 2026-11-16

All nine Page Templates now show the app logo used by the shell, with fixed image dimensions and light/dark sources. Shared AuthBrandProps exposes logoSrc/logoDarkSrc/logoAlt/role across all six auth blocks. User access uses a person badge, Admin access a shield and Super admin access a crown, each labelled accessibly with a distinct tone. Classic and split variants share the branding. Usage and new app v15 examples pass real logo paths and explicit roles; governance documents visual-only role identity.

Verified shared build/tests, UIUX typecheck/build/16 tests and four generator tests. Browser checked loaded logos, expected badges and usage on all nine routes, plus all five split configurations. No desktop document overflow. Evidence: UIUX docs/auth-role-branding.jpg. Project Manager not changed or rebuilt.

## 2026-11-16 — Shared AgentChatWorkspace

- Added public blocks/agent-chat with a bottom composer, starter prompts, project/mode controls, Markdown messages, copy feedback, live activity and Stop, plus a saved-history drawer. Uses existing shared controls, MarkdownContent, RecordList, ActivityFeed and clipboard hook.
- Apps own connection, read-only policy, context and SQLite records. UIUX includes a labelled demo and typed usage; Codeitz uses the actual local Codex session. Shared build and 33 tests passed; consumer browser checks covered a real reply, activity and restored saved messages.

## Slim scrolling and notification feedback — 2026-11-16

Shared styles now use 4px native scrollbars on supporting desktop browsers, Firefox thin fallback, theme-aware thumbs and transparent tracks. Sidebar reuses this rule; ScrollArea uses a 6px track/4px thumb. Coarse pointers retain wider native tracks and forced-colors uses system scrollbar colors. Pixel-perfect native sizing remains OS/browser dependent.

Sonner now has compact neutral surfaces, semantic icons, visible in-card close controls and light/dark support. Defaults: bottom-right, four seconds, three visible, 8px gap. Public components/sonner exports toast; root notify aliases Sonner while legacy root toast/useToast stay compatible. Legacy toast close is labelled and visible; dismissed state is removed after 1s rather than 1,000s, and its subscription no longer restarts per update.

UIUX mounts one Sonner host under the shared provider. Toast Feedback is a dedicated Shared Blocks page with typed usage for success/error/info/warning, promise loading/completion, actions and dismissal. Component Sonner previews cover the same six cases without mounting another host. New app template v18 includes a single root host and optional typed usage. Existing apps were not edited for notification migration; shared stylesheet consumers inherit shared scrollbar changes when rebuilt.

Checks: shared build/full tests plus two focused feedback tests, UIUX typecheck/build/tests and ten generator/routing/release-tool tests passed. Browser checked one host, native canvas/sidebar 4px styles, all notification states/actions, dark/light computed colors, legacy close and copy-success feedback. The appearance setting was restored to Light. Clipboard content could not be independently confirmed through the browser clipboard read API, despite the page reporting Copied. The ScrollArea viewport rendered; auto-hiding custom-bar width was verified in source, not as a visible browser measurement. No new device-wide or backend integration certification. Existing dependency build warnings remain. A transient UIUX server outage recovered during testing; no other process was stopped.

Project Manager was not changed or rebuilt. Concurrent Agent Chat, Master List and server-startup work was preserved.
