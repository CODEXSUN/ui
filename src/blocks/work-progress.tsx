import { Check, Circle, LoaderCircle } from 'lucide-react';
import { cn } from '../lib/utils.js';
export function ProgressMeter({ label, value, max, className }: { label: string; value: number; max: number; className?: string }) {
  return <progress aria-label={label} className={cn('h-2 w-full overflow-hidden rounded-full accent-primary [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary', className)} value={value} max={Math.max(1, max)}/>;
}
export function StageProgress({ stages, completed, activeIndex, running = false, label = 'Completed stages' }: { stages: readonly string[]; completed: number; activeIndex?: number; running?: boolean; label?: string }) {
  return <div className="space-y-3"><ProgressMeter label={label} value={completed} max={stages.length}/><ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, stages.length)}, minmax(0, 1fr))` }}>{stages.map((stage, index) => {
    const active = running && index === activeIndex;
    const Icon = index < completed ? Check : active ? LoaderCircle : Circle;
    return <li key={`${stage}-${index}`} aria-current={active ? 'step' : undefined} className={`flex items-center gap-2 text-xs ${index < completed || active ? 'text-primary' : 'text-muted-foreground'}`}><Icon size={15} aria-hidden="true" className={active ? 'animate-spin motion-reduce:animate-none' : ''}/>{stage}</li>;
  })}</ol></div>;
}
