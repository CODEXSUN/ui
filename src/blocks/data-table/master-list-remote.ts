/** Optional server-controlled contract. HTTP, authorization and SQL stay in apps. */
export const MASTER_LIST_PAGE_SIZES = [10, 20, 25, 50, 100] as const;
export type MasterListPageSize = typeof MASTER_LIST_PAGE_SIZES[number];
export type MasterListRemoteQuery = {
  page: number;
  pageSize: MasterListPageSize;
  search: string;
  sort: { id: string; direction: 'asc' | 'desc' } | null;
  filters: Readonly<Record<string, string>>;
  filterId: string | null;
};
export type MasterListQueryReason = 'page' | 'pageSize' | 'search' | 'sort' | 'columnFilter' | 'filter' | 'clear';
export type MasterListRemoteFilter = { id: string; label: string; count?: number };
export type MasterListRemoteExport<T> =
  | { scope: 'page'; onExport(rows: readonly T[], query: MasterListRemoteQuery): void | Promise<void> }
  | { scope: 'all-matching'; onExport(query: MasterListRemoteQuery): void | Promise<void> };
export type MasterListRemote<T> = {
  query: MasterListRemoteQuery;
  total: number | null;
  onQueryChange(next: MasterListRemoteQuery, reason: MasterListQueryReason): void;
  filterOptions?: readonly MasterListRemoteFilter[];
  unfilteredTotal?: number;
  export?: MasterListRemoteExport<T>;
};

export function normalizeMasterListRemoteQuery(query: MasterListRemoteQuery): MasterListRemoteQuery {
  const pageSize = MASTER_LIST_PAGE_SIZES.includes(query.pageSize) ? query.pageSize : 100;
  return {
    ...query,
    page: Number.isSafeInteger(query.page) && query.page >= 0 && query.page <= Math.floor((Number.MAX_SAFE_INTEGER - pageSize) / pageSize) ? query.page : 0,
    pageSize,
  };
}

/** No selection, sorting, filtering or slicing of the server page occurs here. */
export function resolveMasterListRemotePage<T>(data: readonly T[], remote: MasterListRemote<T>) {
  const query = normalizeMasterListRemoteQuery(remote.query);
  const validTotal = remote.total === null || (Number.isSafeInteger(remote.total) && remote.total >= 0);
  const total = validTotal ? remote.total : null;
  const pages = total === null ? 0 : Math.max(1, Math.ceil(total / query.pageSize));
  const outOfRange = total !== null && query.page > 0 && query.page >= pages;
  const error = !validTotal ? 'The server returned an invalid total.'
    : data.length > query.pageSize ? 'The server returned too many rows for this page.'
    : total !== null && !outOfRange && data.length > 0 && query.page * query.pageSize + data.length > total
      ? 'The server rows do not match the reported total.' : undefined;
  return { query, total, pages, outOfRange, error, rows: data };
}
