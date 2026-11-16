# Master List v1

Public import: `@workspace/ui/blocks/data-table` (also exported from `@workspace/ui`).

Based on Codexsun's `workspace/table.tsx`, CRM `enquiry/enquiry.list.tsx`, and shared table toolbar. Keeps the visual pattern without CRM services, user lookups, topology infrastructure, or database dependencies.

Pass `data`, stable `getRowId`, `label`, and `columns` with `id`, `label`, and `value(record)`. Optional `render(record)` customizes cells; `value` remains the searchable/sortable representation. Supply `onOpen` and `actions` for app-owned actions. A column can disable sorting or filtering.

The block owns local search, text filters, column visibility, three-state sorting, pagination, loading/empty/error views, and accessible row action menus. At least one column stays visible. Hiding a column clears its filter. Filters combine with global search. Numeric values sort numerically. Supply `loading`, `error`, and `onRetry` for asynchronous data. Keep the primary New button in the app header.

`MasterListStatus` supplies compact outlined status styling. Choose success, warning, danger, or neutral tone; keep business status labels in the owning app.

This version paginates and filters the supplied records locally. For large/server-paginated datasets, add a controlled server-data contract in the shared block before claiming these controls cover all server records. The block never fetches data or invents permissions. Apps supply authorized data and enforce actions on their backend.

UIUX: `/blocks/data-table/master-list-v1` includes a live example and copyable usage code. Project Manager demonstrates the same block with actual project records.

Pass `filterOptions` as `{ id, label, matches(record) }` choices and `allFilterLabel` for the reference-style filter menu. Counts reflect the supplied dataset before search/column filters. Selection intersects with search/column filters and resets pagination. The active badge shows its label/count; its remove action clears the selected option. Clear resets the selected option and inline column filters.
