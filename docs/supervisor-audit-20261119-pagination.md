# Master List remote-pagination audit — 2026-11-19

Status: done (shared UI contract, implementation, tests and immutable publication). UI0.1.13 / v-0.1.13 exact commit984a9d2afd4dcfdc80bd1f940c9a94cb0dff298b. Existing local mode remains default; consumers may now pin this published SHA.

## Public contract (from @workspace/ui/blocks/data-table)

```ts
export const MASTER_LIST_PAGE_SIZES: readonly [10, 20, 25, 50, 100];
export type MasterListPageSize = 10 | 20 | 25 | 50 | 100;
export type MasterListRemoteQuery = {
  page: number; // zero-based, nonnegative safe integer
  pageSize: MasterListPageSize;
  search: string;
  sort: { id: string; direction: 'asc' | 'desc' } | null;
  filters: Readonly<Record<string, string>>; // column ID -> text
  filterId: string | null;
};
export type MasterListQueryReason =
  | 'page' | 'pageSize' | 'search' | 'sort'
  | 'columnFilter' | 'filter' | 'clear';
export type MasterListRemoteFilter = { id: string; label: string; count?: number };
export type MasterListRemoteExport<T> =
  | { scope: 'page'; onExport(rows: readonly T[], query: MasterListRemoteQuery): void | Promise<void> }
  | { scope: 'all-matching'; onExport(query: MasterListRemoteQuery): void | Promise<void> };
export type MasterListRemote<T> = {
  query: MasterListRemoteQuery;
  total: number | null; // matching total for the entire current query; null=unknown
  onQueryChange(next: MasterListRemoteQuery, reason: MasterListQueryReason): void;
  filterOptions?: readonly MasterListRemoteFilter[];
  unfilteredTotal?: number; // optional server facet total ignoring filterId only
  export?: MasterListRemoteExport<T>;
};
// Additive prop on existing MasterListV1Props<T>:
// remote?: MasterListRemote<T>
export function normalizeMasterListRemoteQuery(query: MasterListRemoteQuery): MasterListRemoteQuery;
```

## Semantics owners can implement now

- In remote mode data is one authoritative server page, already searched/sorted/filtered. UI never runs local predicates, text filtering, sorting or page slicing on that page. `columns.value` still provides cell display; `filterOptions.matches` is local-only. Serial = page*pageSize+rowIndex+1.
- Query is fully controlled. Page changes preserve other intent. Search/sort/page-size/column/preset-filter changes atomically reset page to0. Clear resets preset/column filters while retaining search/sort; badge removal clears only preset. Parent must accept the emitted query and issue its HTTP request.
- Page sizes are10/20/25/50/100, max100. Invalid runtime page/size normalizes to0/100. Backend independently validates bounds, permitted column/filter IDs, authorization and stable sort+ID tie-breaker. UI contains no SQL or transport.
- `total` is server count matching every query constraint, never data.length. Unknown total is shown as unknown and disables speculative next/last navigation. Filter counts are optional, server-calculated facets for current search/column filters ignoring filterId; omit unavailable counts rather than inventing page counts. `unfilteredTotal` follows the same facet scope.
- Empty or out-of-range responses never silently clamp and relabel the returned page. They show an explicit empty/unavailable state; an out-of-range page offers a first-page intent. Oversized/invalid page metadata is a protocol error, not a reason to render an unbounded dataset.
- Existing loading/error/onRetry props apply. During loading/error no previous rows can be opened/exported. Query controls emit intent; consumers own debounce, AbortController and response-generation checks, clear stale totals/facets as needed, and prevent late request writes. Do not fetch/render the entire dataset merely to feed this contract.
- Export is absent by default. A page export is labelled “Export this page” and receives exactly supplied rows; all-matching export is labelled “Export all matching” and delegates the query to an authorized app/server export that must ignore page/pageSize and export the full matching authorized dataset. Neither is silently represented as whole-dataset CSV. No CSV generation or business download endpoint lives in UI.

## Required consumer request lifecycle

See the typed docs/master-list-remote.example.tsx. Keep query in state; synchronously clear old rows/totals/facets, mark loading and invalidate/abort the previous request in the same query-change event (not only a later effect); create an AbortController and request-generation token per query; mark loading and clear error; request only {limit:pageSize, offset:page*pageSize, search, sort, filters, filterId}; only the still-current, non-aborted request may update rows/total/facets/error/loading. Abort and invalidate generation on query changes/unmount. Retry repeats current query. Use an allowlisted deterministic backend ordering. Do not retry401/403 as ordinary list transport errors. Do not change applied migrations or grants to make results appear.

## Verification / handoff

Before: supervisor reported CRM5000-row response1,093,901 bytes, above Platform1MiB budget; whole-dataset client mode is inappropriate there. This UI owner did not mutate or remeasure CRM/Texlinks business endpoints.

Changes: src/blocks/data-table/master-list-v1.tsx adds optional remote processing and truthful footer/facets/export scopes; src/blocks/data-table/master-list-remote.ts owns exported types, bounded query normalization and response metadata checks. No transport or SQL in UI. tests/master-list-remote.test.mjs adds9 behavioral tests. docs/master-list-remote.example.tsx is an independently strict-compiled usage/controller example with synchronous stale-state clearing,200ms consumer debounce, abort/generation guards and auth-error retry distinction. package.json/package-lock.json/docs/CHANGELOG.md version0.1.13; docs/work-record.md and this report/evidence updated.

Verification:
- Clean isolated shared UI build passed4.132s. All80 tests passed sequentially48.778s (includes9 new remote tests plus unchanged local model/component compatibility and auth suites). Focused11 remote/local tests passed1.783s. No skipped tests.
- Typed public-import example passed TypeScript7 strict+exactOptionalPropertyTypes with --ignoreConfig in0.532s. No new runtime dependency.
- Actual isolated headless Edge at360/768/1440/1920/2560: document width equals viewport at all five sizes. Mobile table remains640px inside its own horizontal scroll area; footer and toolbar wrap within canvas. Wide toolbar/content expands to2025px at2560. Screenshot360px visually reviewed.
- Disposable HTTP fixture has5000 synthetic records but each request returns at most100 rows. Largest fixture response5352 bytes; this is fixture evidence, NOT a claimed production CRM/Texlinks payload measurement.
- Actual Next requests page1 and serial starts101; selecting25 emits page0/size25; sort, text, column and preset-filter/Clear intents round-trip to fixture HTTP. Server total5000/2500/1/0 is displayed without page-only inference. Unknown facet counts are omitted in DOM tests.
- DOM tests cover unchanged server page order despite incompatible local search/filter/sort, no local predicate execution, controlled intents, unknown totals, invalid/oversized metadata, empty/out-of-range first-page recovery, loading/error/retry, exact page versus all-matching export callbacks, duplicate export and safe rejection feedback.
- Browser deliberately superseded a delayed search; its HTTP request was aborted and late response never replaced current rows. Unmount cancelled a pending consumer debounce with no additional request.503 retry cleared stale rows and recovered. Page export received1 displayed record; all-matching export received the criteria/query with no pretend row count.

Evidence: docs/supervisor-audit-20261119-pagination/browser-evidence.json and pagination-{360,768,1440,1920,2560}.png. Reusable isolated browser runner/server: C:/Users/sunda/AppData/Local/Temp/ui-supervisor-20261119/browser/pagination{,-server}.mjs plus pagination-fixture.tsx. It uses fresh headless Edge profile and ephemeral loopback HTTP; no user profile or production data.

Migration/data/deployment: no module or database files changed, no migrations/reset/reseed, no grants/credential/business-record changes, no Docker operation. CommentsThread and other pending owner work are excluded. UI is a library with no standalone image/manifest/workflow; downstream app owners must pin its published commit, ship their bounded HTTP/SQL/count/export implementation and let CodeShip deploy approved app images. Already-correct small local lists need no repin or conversion.

Limitations and consumer prerequisites: this library release alone does not resolve CRM/Texlinks oversized API responses. Owners must enforce100-row maximum server-side, authorization, allowlisted sort/filter IDs, stable ordering+ID tie-breaker, server totals/facets, bounded full-export transport, request cancellation/generation checks and actual gateway-budget measurements. The optional mode is local-only when remote is omitted. No arbitrary business SQL, tRPC/GraphQL, batch-selection behavior or app-specific policy was introduced. Governance/template owners should add this optional controlled contract for heavy lists; this task does not edit sibling-owned guides.

Published through GitHub helper --release --yes: https://github.com/CODEXSUN/ui/commit/984a9d2afd4dcfdc80bd1f940c9a94cb0dff298b ; immutable annotated tag v-0.1.13. No standalone library workflow/image/manifest. App integration, API payload measurements and CodeShip deployment remain consuming-owner stages. Task-owned temporary server was stopped and test fixture removed from UIUX source; reusable copy retained at the documented TEMP path.
