export type MasterListValue = string | number | boolean | null | undefined;
export type MasterListField<T> = { id: string; value: (record: T) => MasterListValue };

export function selectMasterListRows<T>(data: readonly T[], columns: readonly MasterListField<T>[], search: string, filters: Record<string, string>, sort: { id: string; direction: 'asc' | 'desc' } | null) {
  const includes = (value: MasterListValue, query: string) => String(value ?? '').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  const rows = data.filter(row => (!search.trim() || columns.some(column => includes(column.value(row), search))) && columns.every(column => !filters[column.id] || includes(column.value(row), filters[column.id])));
  const column = columns.find(column => column.id === sort?.id);
  if (column && sort) rows.sort((a, b) => {
    const left = column.value(a); const right = column.value(b);
    const result = typeof left === 'number' && typeof right === 'number' ? left - right : String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' });
    return sort.direction === 'asc' ? result : -result;
  });
  return rows;
}
