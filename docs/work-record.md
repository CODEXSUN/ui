## 2026-11-18 — Coordinated application release dependency

- Audited current workspace access, registration and storefront changes for the authorized all-app release. Typecheck/build, sixty UI tests and four tool tests passed. Prepared 0.1.8 so consuming container builds can pin these public exports. No deployment or database change is performed by this package.

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

## 2026-11-16 — Chat plan task handoff controls

- Added optional plan-approval and open-task callbacks to AgentChatWorkspace, with message mode and pending/ready task-link metadata. Completed plans show explicit approval; pending creation can retry and ready links open the task. Business validation, database links and coding approval stay app-owned.
- Shared build/34 tests passed; Codeitz browser checks verified the shared controls and separate coding step. Existing UIUX usage demonstrates a labelled demo handoff.

## 2026-11-16 — Reusable master-list search strip

Extracted public MasterListToolbar and MasterListFilterMenu from the table. MasterListV1 retains its existing search/filter behavior through these controls; card collections can consume the same strip without table-only column controls. Added UIUX live preview and usage. Shared build and 34 tests passed; UIUX typecheck passed.

## Slim scrolling and notification feedback — 2026-11-16

Shared styles now use 4px native scrollbars on supporting desktop browsers, Firefox thin fallback, theme-aware thumbs and transparent tracks. Sidebar reuses this rule; ScrollArea uses a 6px track/4px thumb. Coarse pointers retain wider native tracks and forced-colors uses system scrollbar colors. Pixel-perfect native sizing remains OS/browser dependent.

Sonner now has compact neutral surfaces, semantic icons, visible in-card close controls and light/dark support. Defaults: bottom-right, four seconds, three visible, 8px gap. Public components/sonner exports toast; root notify aliases Sonner while legacy root toast/useToast stay compatible. Legacy toast close is labelled and visible; dismissed state is removed after 1s rather than 1,000s, and its subscription no longer restarts per update.

UIUX mounts one Sonner host under the shared provider. Toast Feedback is a dedicated Shared Blocks page with typed usage for success/error/info/warning, promise loading/completion, actions and dismissal. Component Sonner previews cover the same six cases without mounting another host. New app template v18 includes a single root host and optional typed usage. Existing apps were not edited for notification migration; shared stylesheet consumers inherit shared scrollbar changes when rebuilt.

Checks: shared build/full tests plus two focused feedback tests, UIUX typecheck/build/tests and ten generator/routing/release-tool tests passed. Browser checked one host, native canvas/sidebar 4px styles, all notification states/actions, dark/light computed colors, legacy close and copy-success feedback. The appearance setting was restored to Light. Clipboard content could not be independently confirmed through the browser clipboard read API, despite the page reporting Copied. The ScrollArea viewport rendered; auto-hiding custom-bar width was verified in source, not as a visible browser measurement. No new device-wide or backend integration certification. Existing dependency build warnings remain. A transient UIUX server outage recovered during testing; no other process was stopped.

Project Manager was not changed or rebuilt. Concurrent Agent Chat, Master List and server-startup work was preserved.

## 2026-11-17 — Todo composer focus

- Shared TodoWorkspace focuses the composer after initial loading and successful creation, waiting for save completion before restoring focus. Enter can be used to add consecutive todos; existing values and persistence are unchanged.

## 2026-11-17 — Optional Master List row navigation

- Added opt-in openOnRowClick to MasterListV1. Noninteractive row cells invoke the existing onOpen callback; embedded buttons/inputs and action menus remain independent. Existing first-cell keyboard action and default behavior remain unchanged.
- Wired Codeitz Tasks and UIUX preview/usage; updated the public governance contract.

## Uniform single-line controls — 2026-11-17

Added the shared --control-height:44px token and controls.css so text/password/email/number/file inputs, native/shared Select, autocomplete Lookup, date triggers, search/column filters and single-line InputGroup/Combobox surfaces keep the same height. Central styles outrank local Tailwind size utilities; multiline/grouped editor layouts, choice controls and wrapping chips retain their proper dimensions. Updated primitive defaults, centered the Master List search icon and preserved native-select arrow clearance.

Select and Lookup now share semantic border/background/radius, popup surfaces, typography and focus/error states. Added semantic slots to Select and date/lookup markers for shared styling. Invalid fields retain the existing tight light-red 2px ring. Mobile single-line control text remains 16px. Governance and generated forms guidance prohibit per-app height/skin forks.

Verification: shared/UIUX builds and UIUX typecheck pass. Shared tests (36), UIUX tests (16) and current governance/generator tests (18) pass. Browser measured 44px across the upsert fields, individual form controls, table search/pagination, Input/NativeSelect/Combobox/InputGroup, auth fields and workspace search dialog. No document overflow on checked routes. Select/Lookup popup backgrounds, borders and radii matched; invalid fields kept 44px and red rings. Screenshot: UIUX docs/uniform-control-height.jpg. Browser checks cover the desktop viewport used, not every device.

Project Manager was not changed or rebuilt; unrelated local work was preserved. Existing apps inherit the shared standard when they rebuild; no business-app rebuild or publication was performed in this task.

## 2026-11-17 — Compact form and keyboard options

- Added opt-in UpsertForm keyboardNavigation and uniformControlHeight; helper text can be omitted without dangling accessibility references. Added Textarea fixedRows for bounded multiline inputs.
- Codeitz Tasks and UIUX upsert preview/usage use the public form options. Browser verified 44px controls, five-line fixed textarea with internal overflow, Enter forward, first Escape text selection and repeated Escape backward, without submission. Other form defaults remain unchanged.

## 2026-11-17 — Created-date filter dropdown

- Added public FormDateRangeFilter with a calendar-range icon, paired shared date inputs, active indication and Clear dates. Codeitz Tasks replaces its exposed date controls with this dropdown; URL filtering is preserved. UIUX includes preview and usage.
- Shared UI build, Codeitz typecheck/build and UIUX typecheck passed. Browser verified popover layout, date selection updating the URL and clearing the filter. No record changes.

## 2026-11-17 — Compact Master List pagination

- Reduced shared pagination padding/gaps and scoped the single-line control token to 32px within the footer. Kept page-size options, navigation and normal form input sizing unchanged.

## 2026-11-17 — Aligned search strip tools

- Added the shared hover/focus tooltip to the created-date filter. Master List toolbar icon buttons now match the search input's control-height token and align evenly at the right with consistent spacing. Popup controls and pagination retain their own sizing.

## 2026-11-17 — Slim task details scrollbar

- Added opt-in shared Textarea slimScrollbar styling and enabled it on task details. Uses a 3px themed scrollbar on Chromium, thin on Firefox and a wider touch fallback; fixed five-line scrolling is preserved. UIUX demonstrates the option.

## 2026-11-17 — Compact task form density

- Added opt-in shared compact form density with 12px form/section padding and gaps. Tasks uses 16px page side margins and 12px vertical spacing; input geometry remains unchanged. UIUX demonstrates the shared option.

## Record Detail v1 and Unsaved Changes Guard — 2026-11-17

Added public blocks/record-detail-v1 (typed sections/fields, status/actions, activity/aside, loading/error/empty/retry) and blocks/unsaved-changes-guard (dirty/busy, app-owned navigation request, Stay/Discard dialog, focus restore and native beforeunload listener). Root exports are also available. Values stay app-owned; zero/missing/escaped text render correctly and stale fields/actions are suppressed while unavailable.

UIUX has distinct Shared Blocks pages with real import paths, live previews and compiled usage. Template v21 includes public-import detail and guarded form adapters plus optional examples. Central record-detail-and-navigation.md defines shell/header placement, save/dirty lifecycle, router integration and browser limits. Existing apps were not migrated.

Verified shared build and 39 tests, UIUX typecheck/build and 16 tests, governance/generator 18 tests. A freshly generated v21 app passed its file audit, TypeScript check and production build using existing shared dependencies; no install or business-app build was performed. Browser checked all detail states/retry/action feedback, separate routes/imports/code, no detail-page horizontal overflow, guard focus on Stay, preserved values/focus return, discard, clean leave and busy-disabled leave. Native reload/tab-close prompts and router history blocking were not browser-certified; history/anchors are explicitly app integration responsibilities. Screenshots are UIUX docs/record-detail-v1.jpg and unsaved-changes-guard.jpg. Existing bundler directive warnings remain nonfatal.

Project Manager was not edited or rebuilt. Other pending work was preserved; no commit/push was performed for this task.

## Shared File Upload — 2026-11-17

Added public blocks/file-upload with typed app-owned upload callback/result, manual file queue, browse/drag-drop selection, duplicate/type/size/count validation, safe local raster preview, real progress reports or indeterminate wait, cancel, retry, local removal and disabled states. Reuses shared Attachment/Button/Dialog/Progress. Default accept PNG/JPEG/PDF, five files, 5 MB each. Rejected files never upload; completed results require a nonblank saved ID. Aborted/unmounted/removed attempts suppress late results; preview URLs revoke on cleanup. Apps still own actual storage, permissions, idempotency, record links and server content checks.

UIUX File Upload is a distinct Shared Blocks page with real import path, compiled callback adapter and a labelled local-only simulation. Initial failure demonstrates retry. Template v22 adds records/file-upload.tsx without enabling an API or simulated persistence. Central file-upload-standard.md and generated forms guidance document state/default/security/navigation boundaries.

Checks: shared/UIUX builds and UIUX typecheck passed; 41 shared UI tests, 16 UIUX tests and 18 governance/generator/tool tests passed (75 total). A fresh v22 generated app passed its file audit, typecheck and production build with existing shared dependencies. Browser exercised synthetic PNG/PDF selection, type/size errors, duplicate and five-file limits, loaded blob-image preview, reported progress, failure/retry to completion, cancellation/retry, local removal, real import path and usage panel; no document overflow at the checked desktop size. Screenshot: UIUX docs/file-upload-retry.jpg. Native drag/drop gesture, noncooperative backend cancellation and URL lifecycle were reviewed in source but not independently browser-certified; no production transport/storage was tested. Existing dependency directive warnings remain nonfatal.

Project Manager was not changed or rebuilt. Other pending work was preserved; no publication was performed in this task.

## 2026-11-17 — Reusable ecommerce storefront blocks

- Added public @workspace/ui/blocks/ecommerce and contracts/ecommerce.ts: scoped Neutral layout, header/search/mobile menu, hero, collection/product card, editorial feature, values/footer, controlled product details and bag. Reused Button/Input/Dialog/Sheet and the existing DesignSystemProvider/palette. Shared styles stay in src/styles/ecommerce.css.
- Catalog records, price calculation, transactions, API calls and fixture data stay outside the package. Apps may handle same-store links through the optional navigation callback. Preview mode keeps checkout unavailable.
- Added UIUX preview and typed usage at /blocks/shared-patterns/ecommerce, then wired apps/ecommerce at /storefront. Light/dark/system modes and portal surfaces verified without rewriting saved palette preferences.
- Shared build and 44 tests passed. App typecheck/build/11 tests and UIUX typecheck/build/16 tests passed. Browser checks covered desktop, 390px mobile, history, search, keyboard focus, product details, bag totals/removal and gallery preview. No captured browser warnings/errors.
- Preserved all pre-existing package/UIUX/app work. No version bump, commit, push or deployment in this task. UIUX retains its existing dependency directive/config build warnings; ecommerce build is warning-free.

## 2026-11-17 — Expanded storefront sections

- Added reusable hero/product carousels using the existing Carousel primitive, benefit strip, category tiles, journal and guide dialog, FAQs using Accordion, closing CTA, light/dark logo slots and grouped footer.
- Hero has manual controls, selector dots and pause/play; reduced motion, hover/focus and open overlays prevent automatic rotation as applicable. Inactive slides are inert. Pointer selection pauses autoplay.
- Codexsun app passes original brand assets and content; shared blocks own no sample catalog or commerce persistence. App retains sample-only/disabled checkout boundaries.
- Build and 46 shared tests passed; focused five ecommerce tests rechecked after final carousel changes. App typecheck/build/14 tests and UIUX typecheck/build/16 tests passed. Fixed mobile journal intrinsic sizing after browser inspection. No unrelated work, version or Git publication changed.

## 2026-11-17 — Compact white hero carousel

- Reduced shared hero carousel to a 460px desktop content area plus 60px control bar (520px total at 1920px), with smaller headings, spacing and contained 400px product imagery. Mobile uses smaller type/spacing and 250px imagery.
- Switched the carousel surface to the existing background token: white in light mode while retaining dark-mode support. Interpreted the user's "backend white based" as background styling; no backend code changed.
- Shared UI, ecommerce and UIUX builds passed. Browser verified white rgb(255,255,255), 520px desktop hero, about 640px mobile hero and no horizontal overflow at 390px. No captured browser warnings/errors. Snapshot: apps/ecommerce/docs/storefront-compact-white-hero.jpg. No commit/push.

## 2026-11-17 — Customer journey views

- Added public image rail/story, Shop, Product, Cart, Checkout, Receipt and Tracking lookup views plus shared quantity, cart-line and summary composition under blocks/ecommerce. Delivery and receipt contracts remain in contracts/ecommerce.ts.
- Simplified carousel copy/actions and optional description rendering; app home now prioritizes pictures. Reused existing Carousel, Button, Input, NativeSelect and UpsertForm/field mechanisms. Shared UI owns no catalog data, payment execution, receipt storage or carrier status.
- Shared build/49 tests passed, including empty-cart checkout protection, accessible inline errors, absence of card/password inputs and honest unstarted shipping stages. Final focused eight ecommerce tests passed after quantity accessibility wording adjustment. App/UIUX builds and 19/16 tests passed. Browser checks covered desktop/mobile customer journey, validation, totals, refresh and recovery.
- All unrelated work preserved; no version bump or Git publication.


## 2026-11-17 — Workspace login presentation

- Added opt-in LoginPage workspace branding, Corporate ID/domain-name context and
  disabled state, preserving existing template defaults and other ongoing UI work.
  Reused shared AuthField validation; visually hidden helpers remain accessible.
- Package build and three focused SSR checks passed: shared form/role-choice
  absence, fixed-domain tenant escaping/no Corporate ID input, disabled submit.
- UIUX adds both host-context previews and typed usage. Platform owns host lookup,
  membership checks and authentication; no business rules moved into shared UI.

## 2026-11-17 — Compact Master List search strip

- Scoped the shared Master List toolbar to 36px search and icon controls with 4px padding (46px overall). Form controls elsewhere retain 44px.
- UI build and UIUX typecheck/build passed. Live UIUX measurement confirmed aligned 36px controls and a 46px strip. Governance and new-app guidance document this approved exception. Project Manager was not changed or rebuilt.


## 2026-11-17 — Consistent list header construction

- Shared AppHeader now keeps actions at 32px inside a 40px rail, uses the Tasks hover/focus lift with reduced-motion support, and makes the current breadcrumb semibold. MainLayout defaults to workspace action alignment; gallery import actions explicitly retain edge alignment. Shared workspace-list-content aligns list/table right edges with the header.
- Existing list shells and duplicate list headings were audited and adapted, including Billing financial lists, Codeship operations lists and Codeitz Todo Categories. UIUX live preview and typed usage use the shared content class. Governance and new-app template capture the construction rule. No Project Manager changes/builds.
- Shared UI build, nine app typechecks/builds, 13 governance tests and two Master List tests passed. UIUX browser measured header 40px and New 32px with table outer-edge alignment. UIUX suite has 15 passes and one unrelated Login example parity failure from ongoing auth-template work; those auth files were preserved.

## 2026-11-17 — Codeitz list audit support

- MainLayout measures the canvas scrollbar gutter with ResizeObserver so workspace-aligned header actions stay aligned as overflow changes; no hardcoded per-app offsets. TodoWorkspace now offers opt-in showHeading=false for breadcrumb-owned page naming, preserving standalone defaults.
- Shared UI build and Codeitz typecheck/build passed. Browser measurements on Projects and Tasks matched content/header action right edges within 0.02px.

- 2026-11-18: Added opt-in Calm light/dark palette with neutral surfaces and blue emphasis; wired Appearance, ThemeSelector, preference validation and first-paint bootstrap. Existing palettes/defaults preserved. Project Manager untouched.


- 2026-11-18: Added separate Workspace palette at user request, including four-colour swatches, pale shell/white content hierarchy, light/dark tokens and all theme selection/persistence entry points.


- 2026-11-18: Replaced Calm/Workspace trials with Silver: white canvas, muted grey chrome and graphite accents; migrated saved trial preferences including first paint. Other themes preserved.


- 2026-11-18: Made Silver/light the shared fresh/reset default; brightened selection accent to a restrained cool-grey, preserving white content and muted chrome. Updated first-paint fallback (including blocked storage), UIUX/template HTML, governance and generated-app guidance. Verified UI build, UIUX typecheck/build, 3 Appearance/default-persistence tests and 3 template route tests. Project Manager untouched and not rebuilt.

- 2026-11-18: Audited component/block/layout and UIUX rendering sources for Silver consistency. Fixed editor neutral literals, dark code surface, fixed green switch/login tint, loader pastels, invalid HSL token composition and forced Neutral storefront palette. Muted top/status bars added through shared slots. Shared one-time Silver migration keeps later selections and form/component preferences. UI build and 14 focused tests passed; 9 consumer typechecks/builds and 13 UIUX route/validation tests passed. Seven representative Chrome previews inspected.

- 2026-11-18: User refinement: top menu uses shared card surface (white in Silver light mode); removed muted top-menu override. App header/status bar retain muted surfaces.

- 2026-11-18: User refinement: Silver app header now blends 75% card with 25% muted for a very light tint; table thead uses previous app-header muted tone. White top menu and existing toolbar/status tones retained. Shared styling covers Master List and other tables.

- 2026-11-18: Silver Master List data-row hover and focus-within use exactly the table-header muted tone via one shared CSS rule; empty/filter rows are excluded.

- 2026-11-18: Published scoped Silver release 0.1.5 using GitHub helper from an isolated checkout; origin/main verified at 3b7b835. Release metadata mirrored locally without replacing pending product work. Project Manager excluded.

- 2026-11-18: Added public ecommerce presentation options (3–6 columns, card style/spacing), soft-bordered product cards and StorefrontMerchandisingSection for product grids, offer labels, image-led promotions and accessible carousels. Data and publishing stay app-owned. UIUX typed usage/live preview added; shared UI build and all 60 tests passed; ecommerce typecheck/build and 29 tests passed.

- 2026-11-18: Added opt-in StorefrontShop sidebar layout with full-width results, sticky filters, shared responsive filter sheet and trigger focus restoration. Ecommerce and UIUX journey adopt the public prop. Shared UI build and 12 ecommerce tests passed; desktop/mobile browser filtering and refresh verified.
- 2026-11-18: Extended public StorefrontHeader with opt-in search layout and onSearchSubmit callback. Full-width inline search uses local input until submit; hamburger Sheet navigation works at all widths and the mobile search occupies a separate row. Standard layout remains available. UIUX typed usage updated; shared UI build/12 ecommerce tests and consuming app/gallery checks passed.
- 2026-11-18: Added opt-in editorial carouselStyle to StorefrontMerchandisingSection: responsive image-led rail using existing product cards, side arrows, Shop all and See more. Shared UI build and 12 ecommerce tests, app build/typecheck and 29 tests, UIUX typecheck passed. Live product links/navigation and 390px mobile verified.
- 2026-11-18: Added public StorefrontAnnouncementBanner and merchandising announcement kind with 80% desktop width, responsive stacked image/copy layout and app-owned action. Exported through blocks/ecommerce and added UIUX usage. Shared UI build/12 ecommerce tests, app typecheck/build/29 tests and gallery typecheck passed; browser measured exactly 80% desktop width and verified mobile/CTA.
- 2026-11-18: Added public StorefrontHeaderMenu/MenuItem contracts and optional account/More dropdown content to the search header; Cart displays its label on desktop and uses an accessible compact icon on phones. Shared dropdown primitives own interactions. Apps own destinations and disabled capabilities. UIUX usage updated; UI build/12 ecommerce tests and app/gallery checks passed, with desktop/mobile browser verification.


## 2026-11-18 — Shared controls, Silver theme and release support

- Prepared 0.1.6 with the user-authorized current changes after audit.
- Shared Silver defaults, form/navigation/card/ring components, file upload and ecommerce presentation updates. Typecheck/build, 60 component/behavior tests and four repository-tool tests passed.
- GitHub helper publication/tag and tagged CI/runtime outcomes are recorded by their actual later stages; no unexecuted deployment is claimed here.


## 2026-11-18 — Release portability correction

- Prepared 0.1.7 after identifying Windows CRLF bytes in the earlier source release. Canonical LF attributes and a staged whitespace check prevent recurrence; scoped publishing and commit-tree safeguards are retained. Earlier tags were not moved. No database changes or running app replacement.
- 2026-11-18: Added opt-in StorefrontLayout contentWidth=aligned with one bounded responsive content rail, equal home-section spacing, consistent image sizing and inset carousel controls. Ecommerce storefront/designer and UIUX examples adopt the public prop. Verified 11 viewport sizes (320–2560px), matched section/header/footer edges, uniform desktop gaps and no horizontal overflow. Shared UI build/12 ecommerce tests and app/gallery checks passed.


## 2026-11-18 — Customer storefront integration props

- Added optional storefront header account label and app-supplied checkout/receipt notices/tracking hint, preserving existing defaults. Added optional registration description/name/email helper copy so customer storefronts can reuse the shared auth template without workspace-specific text. No authentication or domain rules moved into UI; Ecommerce owns callbacks and security. Shared UI build and ecommerce compatibility tests are checked in the owning app task.

- Customer storefront integration validation: UI build and all 18 shared auth/ecommerce tests passed; Ecommerce typecheck/build and 41 app/tool tests passed. Existing public defaults stay compatible.

## 2026-11-18 — Shared workspace access verification

- Verified WorkspaceAccessGate with central session/login/password/logout callbacks, neutral wording, current page titles, honest recovery and tenant-resolved context. UI build and sixty tests passed; disposable CRM browser flow verified dashboard, logout and mandatory password update without changing real credentials. Existing UI changes/release work were preserved.

## 2026-11-18 — Ecommerce checkout composition

- Added optional checkout extra fields, payment content, disabled/submit labels and server-total summary rows; receipt supports app-owned financial confirmation copy. Existing defaults preserved.
- Shared UI build and all 18 auth/ecommerce tests passed. UIUX owns a typed usage example; provider and financial rules remain in ecommerce.

## 2026-11-18 - Password gate compatibility release

Released the existing reviewed eight-character password-form correction so Platform's single-entry build can pin a published compatible UI commit. Build and all 60 UI tests passed. No authentication or permission bypass; Platform remains authoritative for password policy.

- 2026-11-18: Prepared scoped release for shared blocks and new-app template v25; includes latest imports/examples and extraction verification. User authorized GitHub helper publication and UIUX-only CodeShip update to 127.0.0.1:14315:4315. CI/deployment readiness will be recorded from actual outcomes; no database change or excluded-app update.

- Release verification: shared UI build, clean-install dry run and 64 tests passed. Initial parallel test execution had transient local worker/Git-fixture errors; sequential verification passed without source changes.

- 2026-11-19: Audited shared shell/access recovery,71 tests pass, headless Edge360/768/1440/1920/2560 plus HTTP recovery/denial/login/cancellation pass. Prepared immutable0.1.12; no migrations or Docker operation. See docs/supervisor-audit-20261119.md.

- 2026-11-19: Added optional controlled remote Master List mode for heavy lists;80 tests, strict usage compilation and headless HTTP/layout/cancellation audit pass. Prepared additive0.1.13; no app/Docker/database changes. Contract and consumer prerequisites: docs/supervisor-audit-20261119-pagination.md.

- 2026-11-19: Reviewed/published pending CommentsThread presentation contract for0.1.14; added scope-safe lifecycle, current permission/revision/cancel handling.91 shared tests,7 isolated Comments browser tests, packed strict imports and ten actual light/dark width cases pass. No host/auth/database/Docker changes. See docs/supervisor-audit-20261119-comments.md.

## 2026-11-19 — Whiteboard preview

Added public WhiteboardPreview with static PNG thumbnails and safe loading/cleanup. Serialization rejects an editor still hydrating. Codeitz browser audit created and retrieved Excalidraw text scenes as draft/active; card navigation and refresh passed. Build passed. No database changes.

Verification: all 91 UI tests passed with zero skips. Isolated release preserves concurrent UI owner edits.

- 2026-11-19: Reconciled owned UI0.1.12/13/14 releases, separate attachment0.1.15 tag and current UIUX0.1.11 image/health. Preserved in-flight assistant contribution; release awaits final owner report. Shared UIUX reverify deferred by live lock, direct checks pass; no redeploy. See supervisor-audit-20261119.md.

- 2026-11-19: Reviewed frozen assistant and saved AttachmentList contributions atop published UI0.1.16, retained prior Comments/Whiteboard, fixed demonstrated stale speech/pending send and normal-upload adapter compatibility.103 shared tests, strict installed SDK0.1.7/consumer checks and responsive/theme cases pass. Prepared0.1.17; no app/database/Docker changes. See supervisor-audit-20261119-capabilities.md.

- 2026-11-19 final status: UI0.1.17/v-0.1.17 published at7a6bbfee17b8775b3a5140041e8aa2da0cc37fc0, preserving Whiteboard0.1.15/16 and Comments0.1.14.103 tests, strict installed SDK0.1.7/consumer checks and responsive tests pass. Assistant/AttachmentList consumers can pin this source; details in supervisor-audit-20261119-capabilities.md. Docker engine subsequently unavailable per supervisor: runtime attempts paused, old UIUX0.1.11 health is historical only, no partial deployment/replacement by this owner and existing lock preserved.

## Drawing advisory assessment — 2026-11-19

Frozen UI0.1.17 audit and production Whiteboard graph completed.12 affected package entries / eight unique GHSAs; packed consumer14 propagation entries, same underlying drawing advisories. Nanoid browser copies and nested KaTeX are emitted; named lodash vulnerable functions were tree-shaken from the representative build. No exploit claimed, no omit-dev browser certification. No demonstrated compatible complete upgrade within pinned constraints; no runtime patch, version/tag change or forced app repin. Exact affected/patched ranges, graph evidence and implementation blockers: docs/security-drawing-20261119.md and associated evidence directory. Remediation remains OPEN for consumers retaining these dependency versions. UI17/Whiteboard, native pending changes and siblings preserved.

## UI0.1.18 — scoped drawing dependency remediation — 2026-11-19

Implemented deliberate producer-root overrides and resolved lock: editor Nanoid3.3.20, converter Nanoid5.1.16, lodash-es4.18.1, KaTeX0.18.10. Excalidraw0.18.1/converter2.2.2 and Mermaid11/12 retained. No public/source component changes. Normal fresh install and npm ci/build;104/104 shared UI tests (44.166s),4/4 release-tool tests, version check passed. Actual resolved dependency regression added. Producer and standalone packed consumer with explicit same root override policy each audit zero. Production browser tests exercised hydration, pointer drawing/dirty/save, PNG preview/export, six converter diagram cases, direct math and nested Mermaid11 KaTeX rendering, no page errors. See drawing-dependency-policy.md and security-drawing-20261119/fix-0.1.18 evidence.

A UI package pin alone does not propagate npm overrides into standalone consumers; documented producer and final host graph/lock obligations are mandatory for the scoped remediation claim. No unchanged app/deployed artifact is claimed fixed. No UIUX/app repin, database/migration, container operation, lock removal, project-manager/ecommerce change or whole-stack deployment. Existing17 tag remains immutable. Original frozen17 assessment preserved with follow-up link. Release publication uses GitHub helper after explicit staged review.

Published using GitHub helper --release: UI0.1.18 / immutable v-0.1.18 /6bd08d1c5dd555f01cabae70b19af492f6abe29a. Source dependency consumers may pin that exact commit and follow drawing-dependency-policy.md for producer/standalone root resolution. No runtime image/service exists for shared UI and no app deployment was performed. Task-owned browser preview servers stopped after verification. Native shared node_modules and unrelated pending source were left untouched; source acceptance/rebuild must use the new immutable producer checkout and lock, not infer that an old native installation was upgraded.

## UI0.1.19 tab-session compatibility source — 2026-11-20

Isolated atop published18, only four auth/launcher runtime files plus focused tests/docs/version changed. Current-tab /login preparation, router-safe successful navigation, stale completion suppression and explicit unsupported ordinary-app privileged paths; optional authorized catalogue/current-tab selector/new-tab behavior wired through MainLayout/TopMenu. No role/grant or session implementation in UI.117UI+4tool tests, strict packed SDK10 consumer and two-tab disposable browser fixture pass. Drawing overrides/locks and all18 features retained. Native unrelated work untouched. See auth-compatibility-20261120.md. Local Docker deployment STOP and Ubuntu STOP apply; source publication is separate, no runtime changes made. UIUX auth candidate ownership is resolved separately and its existing source will be preserved for pin preparation.

## 2026-11-20 — Management workspace sign-in

Prepared v-0.1.20 from v-0.1.19. Management workspaces may opt in to administrator and super-admin sign-in routes; ordinary apps continue to reject those routes. Explicit management sign-in keeps an existing session until successful replacement and submits the requested realm. Focused tests cover both realms, failed credentials and stale route changes; typecheck, build, shared-component tests, tool tests and version checks passed. No database or deployment changes.

2026-11-20: Portal recovery. Public login routes include /login, /admin and /sa aliases, /admin/login, /sa/login and fresh /sa/refresh. Workspace denial remains on form with a message; denied credentials never render workspace children. prepareLogin is optional for compatibility and uses the published SDK capability when present. Existing privilegedLogin prop remains accepted but no longer hides public login pages. Build and all 17 focused gate tests passed, including denied verification, portal history, wrong credentials and stale responses. A broader unrelated UI run was stopped after slow imports; no all-suite success is claimed. No deployment or other chat messages.
