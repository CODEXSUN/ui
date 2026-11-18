# Todo Workspace

Public import: `@workspace/ui/blocks/todo-workspace`.

`TodoWorkspace` follows the compact todo pattern: title composer, priority/category/date/project options, private/public controls, project initials, completion checkbox, inline editing and deletion confirmation. It uses shared shadcn components and semantic theme tokens; it owns no API or database.

Apps supply `items`, `projects`, optional `categories`, loading/error/retry, controlled `visibility`/`project` filters and their callbacks. Required async callbacks are `onCreate(input)`, `onUpdate(id, changes)`, `onDelete(id)` and `onReorder(orderedIds)`.

Callbacks must resolve only after persistence succeeds and update the supplied records from the saved server response. Reject failures; the block retains an unsuccessful edit and displays the error. Only unsaved form drafts and interaction state are local to the component. New drafts default to medium priority, open status and private visibility.

Drag a handle to place a row before or after another row. Touch uses pointer capture. Keyboard users focus a handle and press Alt+ArrowUp/Alt+ArrowDown. Ordering passes the full supplied ID list, even when visibility/project filters hide rows. Apps must validate scope, completeness, revisions and atomic persistence.

UIUX → Blocks → Shared Patterns → Todo Workspace provides a live preview and typechecked usage. Its clearly labelled demo records reset on reload; Codeitz uses SQLite. Public/private labels describe supplied metadata; the block does not publish content or implement authorization.

## Categories and scheduling

Supply onCreateCategory(name) to persist an independent category. The menu lists existing categories, then + Add category, which opens an inline name field, Save and Cancel. Failed creation retains the field and displays its error. Codeitz supplies a SQLite-backed callback; UIUX supplies a labelled demo callback.

TodoValues supports optional scheduledAt (UTC ISO string or empty), and TodoItem supports optional remindedAt. A separate timer icon uses the shared popover, date/time input and actions. The composer/editor sets draft values; an existing row calls onUpdate directly. The block displays Reminder due from supplied delivery metadata. Apps own scheduling, persistence, revision conflicts and refresh; shared UI never runs background jobs.

The composer receives focus once initial loading completes and after successful creation, including Enter submission. Focus waits until the input is enabled and does not scroll the page. Background refreshes and unrelated saves do not repeatedly focus it.

`showHeading` defaults to true. Apps displaying Todos in their app-header breadcrumb pass `showHeading={false}` to avoid duplicating the page title and description; visibility/project filters and the inline composer remain available.
