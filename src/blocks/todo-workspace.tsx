import { useCallback, useRef, useState, type ReactNode } from 'react';
import { CalendarDays, Check, Eye, Folder, GripVertical, ListTodo, Lock, Pencil, Plus, Save, Tag, Timer, Trash2, X } from 'lucide-react';
import { TodoSchedule } from './todo-schedule.js';
import { Button } from '../components/button.js';
import { Input } from '../components/input.js';
import { Checkbox } from '../components/checkbox.js';
import { Badge } from '../components/badge.js';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/dropdown-menu.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/dialog.js';
export type TodoValues = { title: string; priority: 'low' | 'medium' | 'high' | 'urgent'; category: string; dueDate: string; scheduledAt?: string; status: 'open' | 'in-progress' | 'done'; projectId: string; visibility: 'private' | 'public' };
export type TodoItem = TodoValues & { id: string; remindedAt?: string };
export type TodoProjectOption = { id: string; name: string; icon?: string };
export type TodoWorkspaceProps = {
  items: readonly TodoItem[]; projects: readonly TodoProjectOption[]; categories?: readonly string[];
  loading?: boolean; error?: string; onRetry?: () => void;
  visibility?: 'all' | 'private' | 'public'; project?: string;
  onVisibilityChange: (value: 'all' | 'private' | 'public') => void; onProjectChange: (id: string) => void;
  onCreateCategory?: (name: string) => Promise<void>;
  onCreate: (input: TodoValues) => Promise<void>; onUpdate: (id: string, changes: Partial<TodoValues>) => Promise<void>;
  onDelete: (id: string) => Promise<void>; onReorder: (ids: string[]) => Promise<void>;
};
function values(item: TodoValues): TodoValues { const { title, priority, category, dueDate, scheduledAt = '', status, projectId, visibility } = item; return { title, priority, category, dueDate, scheduledAt, status, projectId, visibility }; }
const defaults: TodoValues = { title: '', priority: 'medium', category: '', dueDate: '', scheduledAt: '', status: 'open', projectId: '', visibility: 'private' };
const tones = { low: 'bg-blue-500', medium: 'bg-amber-500', high: 'bg-orange-500', urgent: 'bg-red-500' };
function Dot({ priority }: { priority: TodoValues['priority'] }) { return <span aria-hidden="true" className={`inline-block size-2.5 shrink-0 rounded-full ring-4 ring-current/10 ${tones[priority]}`}/>; }
function ProjectIcon({ project }: { project?: TodoProjectOption }) { return project ? <span aria-hidden="true" className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold uppercase text-primary">{project.icon || project.name.slice(0, 2)}</span> : <Folder className="size-4"/>; }
function OptionMenu({ label, icon, children, disabled }: { label: string; icon: ReactNode; children: ReactNode; disabled?: boolean }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button type="button" variant="outline" size="icon" aria-label={label} title={label} disabled={disabled}>{icon}</Button></DropdownMenuTrigger><DropdownMenuContent align="end">{children}</DropdownMenuContent></DropdownMenu>;
}
function TodoOptions({ value, onChange, projects, categories, busy, onCreateCategory }: { value: TodoValues; onChange: (changes: Partial<TodoValues>) => void; projects: readonly TodoProjectOption[]; categories: readonly string[]; busy: boolean; onCreateCategory?: (name: string) => Promise<void> }) {
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const categoryInput = useCallback((element: HTMLInputElement | null) => { element?.focus({ preventScroll: true }); }, []);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryOptions = [...new Set([...categories, value.category].filter(Boolean))];
  function chooseCategory(category: string) { onChange({ category: categoryOptions.find(option => option.toLowerCase() === category.toLowerCase()) ?? category }); setNewCategory(''); setCategoryOpen(false); setAddingCategory(false); }
  async function addCategory() {
    if (!newCategory.trim() || categorySaving) return; setCategorySaving(true); setCategoryError('');
    try { await onCreateCategory?.(newCategory.trim()); chooseCategory(newCategory.trim()); }
    catch (reason) { setCategoryError(reason instanceof Error ? reason.message : 'Category could not be saved.'); }
    finally { setCategorySaving(false); }
  }
  return <>
    <OptionMenu label={`Priority: ${value.priority}`} icon={<Dot priority={value.priority}/>} disabled={busy}>{(['low','medium','high','urgent'] as const).map(priority => <DropdownMenuItem key={priority} onSelect={() => onChange({ priority })}><Dot priority={priority}/><span className="capitalize">{priority}</span>{value.priority === priority && <Check className="ml-auto size-4"/>}</DropdownMenuItem>)}</OptionMenu>
    <DropdownMenu open={categoryOpen} onOpenChange={open => { if (categorySaving) return; setCategoryOpen(open); if (!open) { setNewCategory(''); setAddingCategory(false); setCategoryError(''); } }}><DropdownMenuTrigger asChild><Button type="button" variant="outline" size="icon" aria-label={value.category ? `Category: ${value.category}` : 'Choose category'} title={value.category ? `Category: ${value.category}` : 'Choose category'} disabled={busy}><Tag className="size-4"/></Button></DropdownMenuTrigger><DropdownMenuContent align="end">
      <DropdownMenuItem onSelect={() => chooseCategory('')}>No category</DropdownMenuItem>
      {categoryOptions.map(category => <DropdownMenuItem key={category} onSelect={() => chooseCategory(category)}>{category}{value.category === category && <Check className="ml-auto size-4"/>}</DropdownMenuItem>)}
      <div className="border-t border-border pt-1">
        {addingCategory ? <div className="space-y-2 p-2"><div className="flex gap-1"><Input ref={categoryInput} aria-label="New category" placeholder="Category name" maxLength={80} disabled={categorySaving} value={newCategory} onChange={event => setNewCategory(event.target.value)} onKeyDown={event => { event.stopPropagation(); if (event.key === 'Enter') { event.preventDefault(); void addCategory(); } if (event.key === 'Escape') { event.preventDefault(); setAddingCategory(false); } }}/><Button type="button" variant="ghost" size="icon" aria-label="Save category" disabled={categorySaving || !newCategory.trim()} onClick={() => void addCategory()}><Check className="size-4"/></Button><Button type="button" variant="ghost" size="icon" aria-label="Cancel new category" disabled={categorySaving} onClick={() => { setAddingCategory(false); setNewCategory(''); }}><X className="size-4"/></Button></div>{categoryError && <p role="alert" className="text-xs text-destructive">{categoryError}</p>}</div> : <DropdownMenuItem onSelect={event => { event.preventDefault(); setAddingCategory(true); }}><Plus className="size-4"/>Add category</DropdownMenuItem>}
      </div>
    </DropdownMenuContent></DropdownMenu>
    <OptionMenu label={value.dueDate ? `Due date: ${value.dueDate}` : 'Choose due date'} icon={<CalendarDays className="size-4"/>} disabled={busy}><div className="p-2"><Input aria-label="Due date" type="date" onKeyDown={event => event.stopPropagation()} value={value.dueDate} onChange={event => onChange({ dueDate: event.target.value })}/><Button variant="ghost" type="button" size="sm" onClick={() => onChange({ dueDate: '' })}>Clear date</Button></div></OptionMenu>
    <TodoSchedule value={value.scheduledAt} disabled={busy} onSave={async scheduledAt => { onChange({ scheduledAt }); }}/>
    <OptionMenu label={`Project: ${projects.find(project => project.id === value.projectId)?.name ?? 'No project'}`} icon={<ProjectIcon project={projects.find(project => project.id === value.projectId)}/>} disabled={busy}>
      <DropdownMenuItem onSelect={() => onChange({ projectId: '' })}><Folder className="size-4"/>No project</DropdownMenuItem>{projects.map(project => <DropdownMenuItem key={project.id} onSelect={() => onChange({ projectId: project.id })}><ProjectIcon project={project}/>{project.name}{value.projectId === project.id && <Check className="ml-auto size-4"/>}</DropdownMenuItem>)}
    </OptionMenu>
    <Button type="button" variant="outline" size="icon" disabled={busy} aria-label={value.visibility === 'private' ? 'Make public' : 'Make private'} title={value.visibility === 'private' ? 'Private' : 'Public'} onClick={() => onChange({ visibility: value.visibility === 'private' ? 'public' : 'private' })}>{value.visibility === 'private' ? <Lock className="size-4"/> : <Eye className="size-4"/>}</Button>
  </>;
}
export function TodoWorkspace({ items, projects, categories = [], loading = false, error, onRetry, visibility = 'all', project = '', onVisibilityChange, onProjectChange, onCreateCategory, onCreate, onUpdate, onDelete, onReorder }: TodoWorkspaceProps) {
  const focusEdit = useCallback((element: HTMLInputElement | null) => { element?.focus({ preventScroll: true }); }, []);
  const [draft, setDraft] = useState<TodoValues>({ ...defaults });
  const [editing, setEditing] = useState(''); const [edit, setEdit] = useState<TodoValues>({ ...defaults });
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const [dragged, setDragged] = useState(''); const [target, setTarget] = useState<{ id: string; after: boolean } | null>(null);
  const pointerDrag = useRef<{ id: string; startY: number; target: { id: string; after: boolean } | null } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TodoItem | null>(null);
  const visible = items.filter(item => (visibility === 'all' || item.visibility === visibility) && (!project || item.projectId === project));
  const disabled = busy || loading || !!error;
  async function run(work: () => Promise<void>, success: string) {
    if (disabled) return false; setBusy(true); setMessage('Saving…');
    try { await work(); setMessage(success); return true; } catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Save failed. Please retry.'); return false; }
    finally { setBusy(false); }
  }
  function move(id: string, targetId: string, after: boolean) {
    if (id === targetId || disabled || editing) return;
    const ids = items.map(item => item.id).filter(itemId => itemId !== id);
    const index = ids.indexOf(targetId); if (index < 0) return;
    ids.splice(index + (after ? 1 : 0), 0, id);
    void run(() => onReorder(ids), 'Order saved.');
  }
  return <section className="space-y-5" aria-label="Todos">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">Todos</h1><p className="mt-2 text-sm text-muted-foreground">Private by default. Visibility stays in this local workspace.</p></div><div className="flex flex-wrap items-center gap-3"><span className="text-xs text-muted-foreground">{visible.filter(item => item.status !== 'done').length} open</span><div className="inline-flex rounded-lg bg-muted p-1" role="group" aria-label="Visibility filter">{(['all','private','public'] as const).map(filter => <Button key={filter} type="button" size="sm" variant={visibility === filter ? 'secondary' : 'ghost'} aria-pressed={visibility === filter} onClick={() => onVisibilityChange(filter)}>{filter === 'all' ? <ListTodo className="size-3.5"/> : filter === 'private' ? <Lock className="size-3.5"/> : <Eye className="size-3.5"/>}<span className="capitalize">{filter}</span></Button>)}</div><OptionMenu label="Filter by project" icon={<ProjectIcon project={projects.find(item => item.id === project)}/>}><DropdownMenuItem onSelect={() => onProjectChange('')}>All projects</DropdownMenuItem>{projects.map(item => <DropdownMenuItem key={item.id} onSelect={() => onProjectChange(item.id)}><ProjectIcon project={item}/>{item.name}{project === item.id && <Check className="ml-auto size-4"/>}</DropdownMenuItem>)}</OptionMenu></div></header>
    <form className="flex flex-wrap items-center gap-2" onSubmit={event => { event.preventDefault(); if (!draft.title.trim()) return; void run(async () => { await onCreate(draft); setDraft({ ...defaults }); }, 'Todo saved.'); }}>
      <Input className="min-w-48 flex-1" aria-label="New todo" placeholder="Add a todo" maxLength={500} value={draft.title} disabled={disabled} onChange={event => setDraft({ ...draft, title: event.target.value })}/>
      <TodoOptions value={draft} onChange={changes => setDraft({ ...draft, ...changes })} projects={projects} categories={categories} busy={disabled} onCreateCategory={onCreateCategory}/>
      <Button type="submit" size="icon" disabled={disabled || !draft.title.trim()} aria-label="Add todo"><Plus className="size-4"/></Button>
    </form>
    <p className="sr-only">Drag a handle to reorder. Focus a handle and press Alt+ArrowUp or Alt+ArrowDown to move it.</p>
    <div role="status" className="flex min-h-5 items-center gap-2 text-sm text-muted-foreground">{error || message}{error && onRetry && <Button variant="link" size="sm" onClick={onRetry}>Retry</Button>}</div>
    {loading ? <p role="status" className="py-12 text-center text-sm text-muted-foreground">Loading todos…</p> : !visible.length ? <div className="grid justify-items-center gap-3 py-16 text-sm text-muted-foreground"><ListTodo className="size-6"/><p>{items.length ? 'No matching todos.' : 'No todos yet.'}</p></div> : <ul className="space-y-1" aria-label="Todo list">{visible.map((item, index) => {
      const isEditing = editing === item.id; const assigned = projects.find(option => option.id === item.projectId);
      return <li key={item.id} className={`flex min-h-[4.5rem] flex-wrap items-center gap-3 rounded-lg border border-transparent border-b-border px-2 py-3 ${isEditing ? 'border-border bg-muted/30' : ''} ${target?.id === item.id ? target.after ? 'border-b-primary' : 'border-t-primary' : ''} ${dragged === item.id ? 'opacity-50' : ''}`} data-todo-id={item.id}>
        <Button type="button" variant="ghost" size="icon" className="size-6 shrink-0 touch-none cursor-grab active:cursor-grabbing" disabled={disabled || !!editing} aria-label={`Reorder ${item.title}`} title="Drag to reorder; Alt+ArrowUp / Alt+ArrowDown"
          onPointerDown={event => { if (disabled || editing || event.button !== 0) return; pointerDrag.current = { id: item.id, startY: event.clientY, target: null }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={event => {
            const drag = pointerDrag.current; if (!drag || Math.abs(event.clientY - drag.startY) < 5) return;
            setDragged(drag.id);
            const row = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-todo-id]');
            const id = row?.dataset.todoId;
            if (row && id && id !== drag.id) { const bounds = row.getBoundingClientRect(); drag.target = { id, after: event.clientY > bounds.top + bounds.height / 2 }; setTarget(drag.target); }
            else { drag.target = null; setTarget(null); }
          }}
          onPointerUp={event => { const drag = pointerDrag.current; pointerDrag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setDragged(''); setTarget(null); if (drag?.target) move(drag.id, drag.target.id, drag.target.after); }}
          onPointerCancel={() => { pointerDrag.current = null; setDragged(''); setTarget(null); }} onKeyDown={event => { if (!event.altKey || !['ArrowUp','ArrowDown'].includes(event.key)) return; event.preventDefault(); const next = visible[index + (event.key === 'ArrowUp' ? -1 : 1)]; if (next) move(item.id, next.id, event.key === 'ArrowDown'); }}><GripVertical className="size-4 text-muted-foreground"/></Button>
        <Checkbox aria-label={`Complete ${item.title}`} checked={item.status === 'done'} disabled={disabled || !!editing} onCheckedChange={checked => void run(() => onUpdate(item.id, { status: checked ? 'done' : 'open' }), 'Status saved.')}/>
        <span title={`${item.priority} priority`}><Dot priority={item.priority}/></span>
        {isEditing ? <form className="flex min-w-48 flex-1 flex-wrap items-center gap-2" onSubmit={event => { event.preventDefault(); if (edit.title.trim()) void run(async () => { await onUpdate(item.id, edit); setEditing(''); }, 'Changes saved.'); }}>
          <Input ref={focusEdit} aria-label="Edit todo title" maxLength={500} className="min-w-40 flex-1" value={edit.title} disabled={disabled} onChange={event => setEdit({ ...edit, title: event.target.value })} onKeyDown={event => { if (event.key === 'Escape') setEditing(''); }}/>
          <TodoOptions value={edit} onChange={changes => setEdit({ ...edit, ...changes })} projects={projects} categories={categories} busy={disabled} onCreateCategory={onCreateCategory}/>
          <OptionMenu label={`Status: ${edit.status}`} icon={<span className="size-2.5 rounded-full bg-primary"/>} disabled={disabled}>{(['open','in-progress','done'] as const).map(status => <DropdownMenuItem key={status} onSelect={() => setEdit({ ...edit, status })}>{status === 'in-progress' ? 'In progress' : status === 'done' ? 'Done' : 'Open'}</DropdownMenuItem>)}</OptionMenu>
          <Button type="submit" size="icon" variant="ghost" aria-label="Save todo" disabled={disabled || !edit.title.trim()}><Save className="size-4"/></Button><Button type="button" size="icon" variant="ghost" aria-label="Cancel editing" disabled={busy} onClick={() => setEditing('')}><X className="size-4"/></Button>
        </form> : <><div className="min-w-0 flex-1"><button type="button" disabled={disabled} className={`block max-w-full truncate text-left text-sm font-medium ${item.status === 'done' ? 'text-muted-foreground line-through' : ''}`} onClick={() => { setEditing(item.id); setEdit(values(item)); setMessage(''); }}>{item.title}</button><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Badge variant="secondary">{item.status === 'done' ? 'Done' : item.status === 'in-progress' ? 'In progress' : 'Open'}</Badge>{assigned && <span className="inline-flex items-center gap-1"><ProjectIcon project={assigned}/>{assigned.name}</span>}{item.scheduledAt && <span className={`inline-flex items-center gap-1 ${item.remindedAt && item.status !== 'done' ? 'font-medium text-primary' : ''}`}><Timer className="size-3"/><time dateTime={item.scheduledAt}>{new Date(item.scheduledAt).toLocaleString()}</time>{item.remindedAt && item.status !== 'done' ? ' · Reminder due' : ''}</span>}{item.category && <span className="inline-flex items-center gap-1"><Tag className="size-3"/>{item.category}</span>}{item.dueDate && <time dateTime={item.dueDate} className="inline-flex items-center gap-1"><CalendarDays className="size-3"/>{item.dueDate}</time>}</div></div>
          <TodoSchedule value={item.scheduledAt} disabled={disabled || !!editing} onSave={scheduledAt => run(() => onUpdate(item.id, { scheduledAt }), scheduledAt ? 'Reminder scheduled.' : 'Schedule cleared.')}/>
          <Button type="button" variant="ghost" size="icon" disabled={disabled || !!editing} aria-label={`${item.visibility === 'private' ? 'Make public' : 'Make private'}: ${item.title}`} onClick={() => void run(() => onUpdate(item.id, { visibility: item.visibility === 'private' ? 'public' : 'private' }), 'Visibility saved.')}>{item.visibility === 'private' ? <Lock className="size-4"/> : <Eye className="size-4"/>}</Button>
          <Button type="button" variant="ghost" size="icon" disabled={disabled || !!editing} aria-label={`Edit ${item.title}`} onClick={() => { setEditing(item.id); setEdit(values(item)); setMessage(''); }}><Pencil className="size-4"/></Button></>}
        <Button type="button" variant="ghost" size="icon" disabled={disabled || !!editing} aria-label={`Delete ${item.title}`} onClick={() => setPendingDelete(item)}><Trash2 className="size-4"/></Button>
      </li>;
    })}</ul>}
    <Dialog open={!!pendingDelete} onOpenChange={open => { if (!open && !busy) setPendingDelete(null); }}><DialogContent><DialogHeader><DialogTitle>Delete todo?</DialogTitle><DialogDescription>{pendingDelete?.title} will be removed from this list.</DialogDescription></DialogHeader><DialogFooter><Button type="button" variant="outline" disabled={busy} onClick={() => setPendingDelete(null)}>Cancel</Button><Button type="button" variant="destructive" disabled={busy} onClick={() => { if (pendingDelete) void run(async () => { await onDelete(pendingDelete.id); setPendingDelete(null); }, 'Todo deleted.'); }}>Delete todo</Button></DialogFooter></DialogContent></Dialog>
  </section>;
}
