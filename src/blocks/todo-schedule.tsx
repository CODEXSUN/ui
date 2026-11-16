import { useState } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '../components/button.js';
import { Input } from '../components/input.js';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover.js';
function localValue(value: string) {
  if (!value) return ''; const date = new Date(value); if (Number.isNaN(date.getTime())) return '';
  const pad = (number: number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export function TodoSchedule({ value = '', disabled, onSave }: { value?: string; disabled?: boolean; onSave: (value: string) => Promise<boolean | void> }) {
  const [open, setOpen] = useState(false); const [draft, setDraft] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  async function save(value: string) {
    if (saving) return; setSaving(true); setError('');
    try { if (await onSave(value) !== false) setOpen(false); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Schedule could not be saved.'); }
    finally { setSaving(false); }
  }
  return <Popover open={open} onOpenChange={next => { if (saving) return; if (next) { setDraft(localValue(value)); setError(''); } setOpen(next); }}><PopoverTrigger asChild><Button type="button" variant="outline" size="icon" disabled={disabled} aria-label={value ? 'Edit scheduled reminder' : 'Schedule reminder'} title={value ? `Reminder: ${new Date(value).toLocaleString()}` : 'Schedule reminder'} className={value ? 'text-primary' : ''}><Timer className="size-4"/></Button></PopoverTrigger><PopoverContent align="end" className="w-80 space-y-3">
    <h3 className="text-sm font-medium">Schedule reminder</h3><p className="text-xs text-muted-foreground">Local time · {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
    <form className="space-y-3" onSubmit={event => { event.preventDefault(); event.stopPropagation(); const date = new Date(draft); if (!draft || Number.isNaN(date.getTime()) || localValue(date.toISOString()) !== draft) { setError('Choose a valid local date and time.'); return; } void save(date.toISOString()); }}>
      <label className="grid gap-2 text-sm">Date and time<Input type="datetime-local" aria-label="Reminder date and time" required disabled={saving} value={draft} onChange={event => setDraft(event.target.value)}/></label>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      <div className="flex justify-end gap-2"><Button type="button" variant="ghost" size="sm" disabled={saving} onClick={() => void save('')}>Clear</Button><Button type="submit" size="sm" disabled={saving || !draft}>{saving ? 'Saving…' : 'Save schedule'}</Button></div>
    </form>
  </PopoverContent></Popover>;
}
