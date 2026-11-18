import { CalendarRange, X } from 'lucide-react';
import { Button } from '../../components/button.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/popover.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/tooltip.js';
import { WorkspaceDatePicker } from './date-picker.js';

export function FormDateRangeFilter({ from, to, onChange, label = 'Created date filters' }: {
  from: string; to: string; onChange: (range: { from: string; to: string }) => void; label?: string;
}) {
  const active = !!(from || to);
  return <Popover><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><PopoverTrigger asChild>
    <Button type="button" variant="outline" size="icon" aria-label={label} className={active ? 'border-primary text-primary' : undefined}>
      <CalendarRange aria-hidden="true"/>{active && <span className="sr-only">Date filter active</span>}
    </Button>
  </PopoverTrigger></TooltipTrigger><TooltipContent side="top">{label}</TooltipContent></Tooltip></TooltipProvider><PopoverContent align="end" className="w-[min(23rem,calc(100vw-2rem))] space-y-3 p-3" aria-label={label}>
    <div className="grid grid-cols-2 gap-2">
      <WorkspaceDatePicker ariaLabel="Created from" allowManualInput value={from} onValueChange={value => onChange({ from: value, to })}/>
      <WorkspaceDatePicker ariaLabel="Created to" allowManualInput value={to} onValueChange={value => onChange({ from, to: value })}/>
    </div>
    <div className="flex justify-end"><Button type="button" variant="ghost" size="sm" disabled={!active} onClick={() => onChange({ from: '', to: '' })}><X aria-hidden="true"/>Clear dates</Button></div>
  </PopoverContent></Popover>;
}
