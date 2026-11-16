# Workspace structure and wiring audit

Date: 2026-11-16. Scope: targeted source review of E:/codexsun/ui and E:/codexsun/uiux, compared with packages/ui and devkit/uiux. The older repositories were read only; their runtime was not tested.

## Comparison

| Area | Older project | Current project before this change |
| --- | --- | --- |
| Structure | Components, blocks, layouts, templates, theme and design-system registries exist. It is structured, but workspace responsibilities overlap across these layers. | Clear components, contracts, theme provider and styles. No shared workspace blocks. |
| Main shell | layouts/main-workspace/index.ts redirects to layouts/mdi-main/mdi-main.tsx. That implementation combines app catalogs, nested ThemeProvider, navigation, agent workspace, feature settings, notifications and topology inspection. This makes the shell harder to reuse independently. | Gallery owns its own sidebar and header directly in page.tsx. |
| MDI | layouts/mdi/mdi.tsx is a labelled content section, not a document manager. MainWorkspace is a separate, much larger shell. | No document workspace, selection or close behavior. |
| Gallery wiring | uiux/web/src/app.tsx uses public MainWorkspace, with component/block/template navigation and query links. Useful separation, but many hand-maintained catalogs and documentation modules need coordination. | Public @workspace/ui imports and app-specific preference key; five component families previewed, four form families missing. |
| Styling | globals.css scans components, blocks, features, layouts, templates and theme. Shared ownership is present; a large global file carries many roles. | Shared imports-only CSS entry and semantic tokens. No duplicated theme provider. |

## Implemented boundary

- Public contracts: contracts/workspace.ts.
- Shared reusable blocks: src/blocks/main-workspace.tsx, workspace-bars.tsx and mdi-workspace.tsx; exported through @workspace/ui.
- MainWorkspace composes caller-supplied top menu, side menu, document area and status bar. It has no app catalog, theme provider, backend or business defaults.
- MdiWorkspace is a controlled tabbed multiple-document interface using existing Radix Tabs; consumers own unique document IDs, valid active selection and close policy. It does not implement floating desktop windows.
- UIUX modules/gallery/workspace-demo.tsx owns sample documents, active selection, drafts and status. It imports shared blocks through the public package and uses the existing provider/storage key.

Wiring: UIUX main.tsx -> existing DesignSystemProvider -> Gallery -> WorkspaceDemo -> MainWorkspace -> top/side/status blocks + MdiWorkspace -> existing Button/Tabs/Input.

## Verification and next work

Package and gallery builds/typechecks pass. Existing tests plus workspace contract/markup tests pass. Browser verified create/select/close, last-document empty state/recovery, draft retention across tabs, arrow-key navigation, system dark appearance/reset and 390px responsive layout. The running gallery on port 4311 served the rebuilt assets; an additional server was not started because preflight correctly reported the port busy. Build directive warnings remain.

Next: fill the four missing form-control gallery sections, then add durable browser regression coverage. Document drafts are demo-only in memory; persistence, unsaved-change prompts, floating/resizable windows and production routing are outside this task.
