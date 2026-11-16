# Sidebar reference audit and integration

Date: 2026-11-16.

The screenshots show the platform tenant shell, not the simpler `layouts/main-layouts/side-menu.tsx` used in the previous integration. The actual reference is `D:/workspace/codexsun/apps/platform/web/src/desks/tenant/TenantMainLayout.tsx`.

Its sidebar uses:

- `packages/ui/src/blocks/menu/sidemenu/app-sidebar.tsx`
- `packages/ui/src/blocks/menu/sidemenu/sub/sidemenu-section.tsx`
- `packages/ui/src/components/sidebar.tsx`

The previous SideMenu conditionally disappeared on collapse and rendered section headings with indented children. It did not implement the screenshot's icon rail, tooltip behavior, badge cap, inset border or version footer.

Copied the actual reference components and their missing Collapsible, Sheet, Separator, Skeleton and mobile hook dependencies. Only import paths and Radix module references were adapted. The copied components retain their original markup, classes and behavior. Existing theme values were preserved; the missing sidebar ring token and reference scrollbar rules were wired into shared styles.

MainLayout now provides the reference SidebarProvider context, uses the tenant shell's 19rem expanded width / 2.5rem icon-width setting, always mounts the sidebar, and uses the reference container positioning and inset spacing. SideMenu is now an adapter from existing navigation data to AppSidebar. UIUX labels/actions remain its own; no CRM routes or fake CRM counts were introduced. Optional `count` and `children` fields pass through to the source menu. The footer follows TenantMainLayout's version and Settings composition. Top-menu layout and application content were preserved.

Verification: UI and UIUX build/typecheck pass. Existing tests and new reference sidebar tests pass. The browser verified expanded/collapsed desktop states, navigation while collapsed, keyboard-focus tooltips, re-expansion and the footer. Nested items and 101 / 9+ counts were checked by rendering the copied components in tests. The older reference repository was not modified. Existing Vite directive warnings remain.

Screenshots: `devkit/uiux/docs/sidebar-expanded-preview.jpg` and `sidebar-collapsed-preview.jpg` (paths from workspace root for the first file; both images live in the same docs folder).
