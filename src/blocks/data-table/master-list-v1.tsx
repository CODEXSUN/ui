import { Fragment, useId, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUpDown, ArrowUp, CheckCircle2, ChevronLeft, ChevronRight, Columns3, Filter, MoreHorizontal, Search, SlidersHorizontal, X, Eye, Pencil, Trash2, MoreHorizontal as ActionIcon } from 'lucide-react';
import { Button } from '../../components/button.js';
import { Input } from '../../components/input.js';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/select.js';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '../../components/dropdown-menu.js';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../components/tooltip.js';
import { cn } from '../../lib/utils.js';
import { selectMasterListRows, type MasterListField } from './master-list-model.js';

export type MasterListColumn<T> = MasterListField<T> & {
  label: string;
  render?: (record: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
};
export type MasterListAction<T> = { id: string; label: string; onSelect: (record: T) => void; disabled?: (record: T) => boolean; destructive?: boolean; icon?: ReactNode };
export type MasterListFilter<T> = { id: string; label: string; matches: (record: T) => boolean };
export type MasterListV1Props<T> = {
  filterOptions?: readonly MasterListFilter<T>[];
  allFilterLabel?: string;
  data: readonly T[];
  columns: readonly MasterListColumn<T>[];
  getRowId: (record: T) => string;
  label: string;
  itemLabel?: string;
  actions?: readonly MasterListAction<T>[];
  onOpen?: (record: T) => void;
  openOnRowClick?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  error?: string;
  onRetry?: () => void;
  defaultPageSize?: number;
  toolbarActions?: ReactNode;
  className?: string;
};

/** CRM-style master list. Apps provide records, column definitions, and action callbacks. */
export function MasterListV1<T>({ data, columns, getRowId, label, actions = [], onOpen, openOnRowClick = false, searchPlaceholder = 'Search records', loading = false, emptyMessage = 'No records found.', error, onRetry, defaultPageSize = 100, toolbarActions, className, filterOptions = [], allFilterLabel = 'All records', itemLabel = label.toLocaleLowerCase() }: MasterListV1Props<T>) {
  const id = useId();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [hidden, setHidden] = useState<string[]>([]);
  const [inlineFilters, setInlineFilters] = useState(false);
  const [pageSize, setPageSize] = useState(Math.max(1, defaultPageSize));
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ id: string; direction: 'asc' | 'desc' } | null>(null);
  const visible = columns.filter(column => !hidden.includes(column.id));
  const activeOption = filterOptions.find(option => option.id === selectedFilter);
  const scopedData = activeOption ? data.filter(activeOption.matches) : data;
  const filtered = selectMasterListRows(scopedData, columns, search, filters, sort);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * pageSize, (current + 1) * pageSize);
  function clearFilters() { setSelectedFilter(null); setFilters({}); setPage(0); }
  function setFilter(column: string, value: string) { setFilters(current => ({ ...current, [column]: value })); setPage(0); }
  return <section aria-label={label} aria-busy={loading} className={cn('w-full space-y-4', className)}>
    <MasterListToolbar label={label} search={search} onSearchChange={value=>{setSearch(value);setPage(0);}} placeholder={searchPlaceholder}>
        {toolbarActions}
        <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><Button type="button" size="icon-sm" variant={inlineFilters ? 'default' : 'outline'} aria-label="Toggle column filters" aria-pressed={inlineFilters} aria-controls={`${id}-table`} onClick={() => setInlineFilters(value => !value)}><SlidersHorizontal className="size-4"/></Button></TooltipTrigger><TooltipContent side="top">{inlineFilters ? 'Hide column filters' : 'Show column filters'}</TooltipContent></Tooltip></TooltipProvider>
        <MasterListFilterMenu options={filterOptions.map(option=>({id:option.id,label:option.label,count:data.filter(option.matches).length}))} selected={selectedFilter} onChange={value=>{setSelectedFilter(value);setPage(0);}} onClear={clearFilters} allLabel={allFilterLabel} total={data.length}/>
        <DropdownMenu><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><DropdownMenuTrigger asChild><Button type="button" variant="outline" size="icon-sm" aria-label="Columns"><Columns3 aria-hidden="true" className="size-4"/></Button></DropdownMenuTrigger></TooltipTrigger><TooltipContent side="top">Columns</TooltipContent></Tooltip></TooltipProvider><DropdownMenuContent align="end" className="w-56 p-0">
          <div className="flex items-center justify-between gap-3 px-4 py-3"><span className="text-sm font-medium">Visible columns</span><DropdownMenuItem className="p-0 text-xs text-muted-foreground focus:bg-transparent focus:text-foreground" onSelect={event => { event.preventDefault(); setHidden([]); }}>Show all</DropdownMenuItem></div>
          <DropdownMenuSeparator className="mx-0 my-0"/>
          <div className="py-3">{columns.map(column => <DropdownMenuCheckboxItem className="rounded-none py-3 pl-11 pr-4 [&>span:first-child]:left-4" key={column.id} checked={!hidden.includes(column.id)} disabled={visible.length === 1 && !hidden.includes(column.id)} onSelect={event => event.preventDefault()} onCheckedChange={checked => { setHidden(current => checked ? current.filter(id => id !== column.id) : [...current, column.id]); if (!checked) setFilter(column.id, ''); }}>{column.label}</DropdownMenuCheckboxItem>)}</div></DropdownMenuContent></DropdownMenu>
    </MasterListToolbar>
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-sm"><div className="overflow-x-auto"><table id={`${id}-table`} className="w-full min-w-[640px] border-collapse text-sm"><caption className="sr-only">{label}</caption>
      <thead className="bg-accent"><tr><th scope="col" aria-label="Serial number" className="w-12 border-b border-border px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">#</th>{visible.map(column => <th scope="col" key={column.id} aria-sort={sort?.id === column.id ? sort.direction === 'asc' ? 'ascending' : 'descending' : 'none'} className={cn('border-b border-border px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground', column.className)}>{column.sortable === false ? column.label : <button type="button" className="flex items-center gap-1 text-left uppercase" onClick={() => { setSort(current => current?.id !== column.id ? { id: column.id, direction: 'asc' } : current.direction === 'asc' ? { id: column.id, direction: 'desc' } : null); setPage(0); }}>{column.label}{sort?.id === column.id ? sort.direction === 'asc' ? <ArrowUp className="size-3"/> : <ArrowDown className="size-3"/> : <ArrowUpDown className="size-3 opacity-50"/>}</button>}</th>)}{actions.length > 0 && <th scope="col" className="border-b border-border px-4 py-2.5 text-right text-xs font-medium uppercase text-muted-foreground">Action</th>}</tr></thead>
      <tbody>
        {inlineFilters && <tr className="border-b border-border"><td/>{visible.map(column => <td key={column.id} className="px-4 py-2">{column.filterable !== false && <Input className="h-7" aria-label={`Column filter ${column.label}`} value={filters[column.id] ?? ''} onChange={event => setFilter(column.id, event.target.value)}/>}</td>)}{actions.length > 0 && <td/>}</tr>}
        {loading || error || !rows.length ? <tr><td colSpan={1 + visible.length + (actions.length ? 1 : 0)} className="p-10 text-center text-muted-foreground"><div role={error ? 'alert' : 'status'}>{loading ? 'Loading records…' : error || emptyMessage}{error && onRetry && <Button className="ml-3" variant="outline" size="sm" onClick={onRetry}>Retry</Button>}</div></td></tr> : rows.map((row, rowIndex) => <tr key={getRowId(row)} data-slot="master-list-row" data-clickable={openOnRowClick && !!onOpen || undefined} onClick={event => { if (openOnRowClick && onOpen && !(event.target as HTMLElement).closest('button,a,input,select,textarea,[role="button"],[role="menuitem"]')) onOpen(row); }} className="border-b border-border transition-colors duration-150 last:border-b-0 hover:bg-accent/80 focus-within:bg-accent/80"><td className="px-4 py-2 text-xs tabular-nums text-muted-foreground">{current * pageSize + rowIndex + 1}</td>{visible.map((column, index) => <td key={column.id} className={cn('px-4 py-2 text-foreground', column.className)}>{index === 0 && onOpen ? <button type="button" className="text-left font-medium hover:underline" onClick={() => onOpen(row)}>{column.render ? column.render(row) : String(column.value(row) ?? '—')}</button> : column.render ? column.render(row) : String(column.value(row) ?? '—')}</td>)}{actions.length > 0 && <td className="px-4 py-2 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="outline" size="icon-sm" aria-label={`Actions for ${getRowId(row)}`}><MoreHorizontal className="size-4"/></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 p-0.5">{actions.map((action, index) => <Fragment key={action.id}>{index > 0 && <DropdownMenuSeparator className="mx-0 my-0"/>}<DropdownMenuItem disabled={action.disabled?.(row)} className={cn('gap-2 rounded-none px-4 py-3', action.destructive && 'text-destructive focus:bg-destructive/10 focus:text-destructive')} onSelect={() => action.onSelect(row)}><span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">{action.icon ?? (action.id === 'view' || action.id === 'open' ? <Eye/> : action.id === 'edit' ? <Pencil/> : action.destructive ? <Trash2/> : <ActionIcon/>)}</span>{action.label}</DropdownMenuItem></Fragment>)}</DropdownMenuContent></DropdownMenu></td>}</tr>)}
      </tbody>
    </table></div></div>
    <footer className="flex flex-col gap-2 rounded-md border border-border bg-card px-3 py-1 text-xs shadow-sm [--control-height:2rem] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-muted-foreground"><span>Total {itemLabel}: <strong className="font-semibold text-foreground">{filtered.length}</strong></span><label htmlFor={`${id}-size`}>Rows per page</label><Select value={String(pageSize)} onValueChange={value => { setPageSize(Number(value)); setPage(0); }}><SelectTrigger id={`${id}-size`} className="h-8 w-20" aria-label="Rows per page"><SelectValue/></SelectTrigger><SelectContent side="top">{[...new Set([10, 20, 25, 50, 100, pageSize])].sort((a,b) => a-b).map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div>
      <nav aria-label={`${label} pagination`} className="flex flex-wrap items-center gap-1 lg:justify-end"><span role="status" className="mr-2 whitespace-nowrap text-muted-foreground">{loading ? 'Loading…' : `Showing ${filtered.length ? current * pageSize + 1 : 0} to ${Math.min((current + 1) * pageSize, filtered.length)} of ${filtered.length}`}</span><Button type="button" size="sm" variant="ghost" className="px-2 text-muted-foreground" disabled={loading || current === 0} onClick={() => setPage(current - 1)}><ChevronLeft className="size-4"/>Previous</Button>
        {buildPageItems(current + 1, pages).map((item, index) => item === 'ellipsis' ? <span key={`ellipsis-${index}`} className="px-1.5 text-muted-foreground">…</span> : <Button type="button" key={item} size="sm" className="min-w-8 px-2" variant={item === current + 1 ? 'default' : 'ghost'} aria-label={`Page ${item}`} aria-current={item === current + 1 ? 'page' : undefined} disabled={loading} onClick={() => setPage(item - 1)}>{item}</Button>)}
        <Button type="button" size="sm" variant="ghost" className="px-2 text-muted-foreground" disabled={loading || current >= pages - 1} onClick={() => setPage(current + 1)}>Next<ChevronRight className="size-4"/></Button></nav>
    </footer>
  </section>;
}

export function MasterListStatus({ children, tone = 'success' }: { children: ReactNode; tone?: 'success' | 'warning' | 'neutral' | 'danger' }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs', tone === 'success' ? 'border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : tone === 'warning' ? 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : tone === 'danger' ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-border bg-muted text-muted-foreground')}><CheckCircle2 aria-hidden="true" className="size-3"/>{children}</span>;
}

function buildPageItems(page: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
  const candidates = [...new Set([1, page - 1, page, page + 1, total].filter(item => item >= 1 && item <= total))];
  const result: Array<number | 'ellipsis'> = [];
  candidates.forEach((item, index) => {
    if (index > 0 && item - candidates[index - 1]! > 1) result.push('ellipsis');
    result.push(item);
  });
  return result;
}

/** Shared table search strip, also usable above card collections. */
export function MasterListToolbar({label,search,onSearchChange,placeholder='Search records',children}:{label:string;search:string;onSearchChange:(value:string)=>void;placeholder?:string;children?:ReactNode}){
 return <div data-slot="master-list-toolbar" className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-1.5 shadow-sm"><div className="relative min-w-48 flex-1 sm:max-w-xl"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/><Input aria-label={`Search ${label}`} value={search} onChange={event=>onSearchChange(event.target.value)} placeholder={placeholder} className="h-8 pl-9"/></div><div className="ml-auto flex flex-wrap items-center justify-end gap-2 [&_[data-slot=button][data-size=icon-sm]]:size-[var(--control-height)] [&_[data-slot=button][data-size=icon]]:size-[var(--control-height)]">{children}</div></div>;
}
export function MasterListFilterMenu({options,selected,onChange,onClear,allLabel='All records',total}:{options:readonly {id:string;label:string;count:number}[];selected:string|null;onChange:(value:string|null)=>void;onClear:()=>void;allLabel?:string;total:number}){
 const active=options.find(option=>option.id===selected);
 return <>{active&&<span className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-accent px-2.5 text-xs text-accent-foreground"><span>{active.label}</span><span className="rounded-full bg-background/70 px-1.5 text-[11px] tabular-nums">{active.count}</span><button type="button" aria-label={`Remove ${active.label} filter`} className="rounded-sm p-0.5 hover:bg-background/70 focus-visible:outline-2 focus-visible:outline-ring" onClick={()=>onChange(null)}><X className="size-3"/></button></span>}
 <DropdownMenu><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><DropdownMenuTrigger asChild><Button type="button" variant="outline" size="icon-sm" aria-label="Filters"><Filter aria-hidden="true" className="size-4"/></Button></DropdownMenuTrigger></TooltipTrigger><TooltipContent side="top">Filters</TooltipContent></Tooltip></TooltipProvider><DropdownMenuContent align="end" className="w-60 p-0"><div className="flex items-center justify-between gap-3 px-4 py-3"><span className="text-sm font-medium">Filter options</span><DropdownMenuItem className="p-0 text-xs text-muted-foreground focus:bg-transparent focus:text-foreground" onSelect={event=>{event.preventDefault();onClear();}}>Clear</DropdownMenuItem></div><DropdownMenuSeparator className="mx-0 my-0"/><div className="py-3"><DropdownMenuCheckboxItem checked={!active} className="rounded-none py-3 pl-11 pr-4 [&>span:first-child]:left-4" onSelect={event=>event.preventDefault()} onCheckedChange={onClear}><span>{allLabel}</span><span className="ml-auto rounded-full bg-accent px-1.5 text-[11px] tabular-nums">{total}</span></DropdownMenuCheckboxItem>{options.map(option=><DropdownMenuCheckboxItem key={option.id} checked={active?.id===option.id} className="rounded-none py-3 pl-11 pr-4 [&>span:first-child]:left-4" onSelect={event=>event.preventDefault()} onCheckedChange={()=>onChange(option.id)}><span>{option.label}</span><span className="ml-auto rounded-full bg-accent px-1.5 text-[11px] tabular-nums">{option.count}</span></DropdownMenuCheckboxItem>)}</div></DropdownMenuContent></DropdownMenu></>;
}
