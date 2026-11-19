import { useEffect, useRef, useState } from 'react';
import {
  MasterListV1,
  type MasterListColumn,
  type MasterListRemoteFilter,
  type MasterListRemoteExport,
  type MasterListRemoteQuery,
} from '@workspace/ui/blocks/data-table';

export type RemoteListResult<T> = {
  rows: readonly T[];
  total: number;
  filterOptions?: readonly MasterListRemoteFilter[];
  unfilteredTotal?: number;
};

/** Keep loadPage stable (module function/useCallback); it owns HTTP and permissions. */
export function RemoteRecordsExample<T>({ label, columns, getRowId, loadPage, exportRecords }: {
  label: string;
  exportRecords?: MasterListRemoteExport<T>;
  columns: readonly MasterListColumn<T>[];
  getRowId(row: T): string;
  loadPage(query: MasterListRemoteQuery, signal: AbortSignal): Promise<RemoteListResult<T>>;
}) {
  const [query, setQuery] = useState<MasterListRemoteQuery>({
    page: 0, pageSize: 100, search: '', sort: null, filters: {}, filterId: null,
  });
  const [result, setResult] = useState<RemoteListResult<T>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessFailure, setAccessFailure] = useState(false);
  const [revision, setRevision] = useState(0);
  const generation = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);

  // Clear old rows and invalidate the old request in the same event as new intent.
  function beginRequest() {
    generation.current++;
    activeRequest.current?.abort();
    setResult(undefined); setLoading(true); setError(''); setAccessFailure(false);
  }
  useEffect(() => {
    const controller = new AbortController();
    activeRequest.current = controller;
    const request = ++generation.current;
    let active = true;
    const current = () => active && !controller.signal.aborted && generation.current === request;
    // The consumer owns debounce and cancellation, not the shared table.
    const timer = setTimeout(async () => {
      try {
        const next = await loadPage(query, controller.signal);
        if (current()) setResult(next);
      } catch (cause) {
        if (!current()) return;
        const status = (cause as { statusCode?: number } | null)?.statusCode;
        setAccessFailure(status === 401 || status === 403);
        setError(status === 401 ? 'Sign in to view these records.' : status === 403
          ? 'You do not have access to these records.' : 'Records could not load. Try again.');
      } finally {
        if (current()) setLoading(false);
      }
    }, 200);
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [query, revision, loadPage]);

  return <MasterListV1
    label={label} data={result?.rows ?? []} columns={columns} getRowId={getRowId}
    loading={loading} error={error}
    {...(!accessFailure ? { onRetry: () => { beginRequest(); setRevision(value => value + 1); } } : {})}
    remote={{
      query, total: result?.total ?? null,
      ...(exportRecords ? { export: exportRecords } : {}),
      onQueryChange: next => { beginRequest(); setQuery(next); },
      ...(result?.filterOptions ? { filterOptions: result.filterOptions } : {}),
      ...(result?.unfilteredTotal !== undefined ? { unfilteredTotal: result.unfilteredTotal } : {}),
    }}
  />;
}
