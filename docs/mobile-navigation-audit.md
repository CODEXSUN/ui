# Mobile shell navigation audit

Checked 2026-11-16 against the live five-app workspaces and UIUX reference.

## Corrections

- MainLayout closes its mobile drawer when a page is selected, including reselecting the current page. Command navigation uses the same selection handler.
- The top-menu search button has an accessible Search workspace name even when its visual text is hidden, plus advertised Control+K and Meta+K shortcuts.

## Verification

- Shared UI build and all 27 tests passed. UIUX reference build and all 15 tests passed.
- Billing, CRM, Ecommerce, HRMS and Platform passed typecheck/build and six app/tool tests each.
- Browser checked Overview, Records, Settings, missing-page recovery, direct URLs, refresh, Back/Forward, list controls, appearance persistence, sidebar collapse, keyboard command navigation and app switching in all five apps.
- At a measured 390px viewport, Records and Settings page widths stayed 390px; selecting Records and Settings closed the drawer, and the named search action navigated back to Overview in every app. The table keeps its shared internal horizontal scroll.
- No browser console errors were captured in the audited sessions.

Only the two shared shell source files and this audit record belong to this fix. Other in-progress shared UI and UIUX changes were preserved and excluded from its commit.
