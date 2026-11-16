# Shared UI

One default design system provides tokens, shadcn Button, Badge, Card, Checkbox, Tabs, Input, Textarea, NativeSelect, Accordion, and a shared theme selector. Keep product logic and app-specific styles outside this package.

## Defaults and variants

- A fresh app starts in light mode with green accents and default component variants.
- `DesignSystemProvider` enables light, dark, or system appearance and optional green, blue, or violet accents.
- `ThemeSelector` lets a user change button, badge, and card defaults. Preferences stay in browser storage under an app-supplied key; invalid values fall back safely.
- A component's explicit `variant` prop wins over user defaults. This preserves important action styles.
- Begin with the default system only. Future alternative component implementations should use separate optional exports or lazy imports, not a startup registry importing every design system.

## Ownership

Public preference types belong in `contracts/`; components, tokens, and provider code belong in `src/`. Use public package exports, never another repository's source paths.

shadcn source components live here. Add new components to this package using its `components.json`, keep utility imports local, and build before updating a consumer.

## Local development

From this repository: `npm ci`, `npm run build`, `npm test`.

Codeitz declares `@workspace/ui` using `file:../../packages/ui` as a local folder link. After shared changes, rebuild UI and rebuild Codeitz. Both repositories keep their own dependencies, lockfiles, and build output. React is a peer dependency; Codeitz also deduplicates React during bundling.

Consumers import `@workspace/ui` and `@workspace/ui/styles.css`. The stylesheet supplies tokens and scans only its own compiled components; it does not list consuming app folders. The app supplies Tailwind's import and its own layout styles.

`src/styles/index.css` contains imports only. Shared tokens, themes, Tailwind setup, and essential component rules have separate files. Prefer Tailwind utilities for component and layout styling; keep custom CSS only for shared rules or app-specific details that need it. Codeitz keeps its own typography and font settings under its `src/styles/`.

The built package can later use a Git or registry dependency without changing component imports. Publication and remote repositories are not configured.

Accordion exports: `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent` from `@workspace/ui`. Supports Radix single/multiple, controlled/default values, collapsible single mode, disabled items, and keyboard interaction. Uses shared border, ring, muted text, animation, and reduced-motion styles; no separate theme or app styles.

## Workspace blocks

Public exports: MainWorkspace, WorkspaceTopMenu, WorkspaceSideMenu, WorkspaceStatusBar, MdiWorkspace, WorkspaceNavigationItem and MdiDocument. Implementation lives in src/blocks; public document/navigation contracts live in contracts/workspace.ts. The shell takes topMenu, sideMenu, statusBar and children slots. MDI takes documents, activeId, onSelect and optional onClose; IDs must be unique, activeId must name an open document, and the consuming app chooses the next active document after closing. closable: false suppresses a document close control. An empty list renders emptyState. Uses the consumer's existing DesignSystemProvider. No nested provider, application catalog or product defaults.


## Copied layout entry points

Import MainLayout and its shell parts from @workspace/ui/layouts/main-layouts. The copied MainWorkspace compatibility wrapper is exported from @workspace/ui/layouts/main-workspace (also LayoutMainWorkspace at the package root); AgentWorkspace is exported from @workspace/ui/layouts/agent-workspace. The earlier block MainWorkspace retains its existing root export. Layouts reuse the existing provider and shared stylesheet. Missing reference support components are publicly exported from @workspace/ui.

## Appearance settings and palettes

AppearanceSettings is the shared card-based mode/palette control used by UIUX Settings. It reads and updates the existing DesignSystemProvider. DesignPreferences now includes palette: default, compact, clear, shadcn, neutral, orange, green, blue, purple or graphite. designPalettes supplies the reference metadata/swatches; src/styles/palettes.css supplies reference token rules, scoped to the current design-system marker and active palette. These are token palettes of the existing system, not alternate component implementations. Fresh preferences retain light mode; reset restores light/default. Stored accent-only preferences migrate to matching palettes (violet to purple); explicit legacy accent updates select a corresponding palette. ThemeSelector exposes these same choices.

## Component catalog preferences

Public component modules are available at @workspace/ui/components/<file>. The package root retains existing exports and adds the imported reference components; ToastToaster disambiguates the Radix delivery component from Sonner Toaster, and StatusToneBadge is an alias for the tone-based StatusBadge.

DesignPreferences.componentDefaults stores stable component/flavor IDs under each consuming app's existing provider key. useDesignSystemComponentDefault reads a saved composition preference. Gallery setters update this map, with Button/Badge also updating their existing typed defaults. Accordion accepts variant="default" or "contained"; an explicit prop takes priority over the stored Accordion default. A flavor such as a disabled input or a multi-panel layout is a gallery composition preference, not a global prop change. Reset restores the empty preference map.

## Shared scrolling and feedback

The shared stylesheet owns slim native scrollbars and ScrollArea dimensions; avoid app overrides. Native size support is browser/OS dependent. Use Toaster and toast from @workspace/ui/components/sonner, mounting one host below DesignSystemProvider. Defaults: bottom-right, 4s, 3 visible, close button and 8px gap. Root notify is the Sonner alias; legacy root toast/useToast retain their Radix contract. See UIUX Shared Blocks / Toast Feedback for typed usage and central frontend-design-system.md for ownership/error-content rules.
