import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table.js';
export type DetailTableColumn<T> = { id: string; label: string; render: (row: T, index: number) => ReactNode };
/** Read-only related rows inside a detail view. Record-list pages use MasterListV1. */
export function DetailTable<T>({ rows, columns, getRowId, caption, emptyMessage = 'No items.' }: {
  rows: readonly T[]; columns: readonly DetailTableColumn<T>[];
  getRowId: (row: T, index: number) => string | number; caption: string; emptyMessage?: string;
}) {
  return <Table aria-label={caption}><TableHeader><TableRow>{columns.map(column => <TableHead key={column.id}>{column.label}</TableHead>)}</TableRow></TableHeader><TableBody>
    {rows.length ? rows.map((row, index) => <TableRow key={getRowId(row, index)}>{columns.map(column => <TableCell key={column.id}>{column.render(row, index)}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={Math.max(1, columns.length)} className="py-6 text-center text-muted-foreground">{emptyMessage}</TableCell></TableRow>}
  </TableBody></Table>;
}
