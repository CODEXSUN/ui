import type { ReactNode } from 'react';
export type SettingsNavItem = { id: string; label: string; icon?: ReactNode };
export function SettingsNav({ items, value, onValueChange, label = 'Settings sections' }: { items: readonly SettingsNavItem[]; value: string; onValueChange: (value: string) => void; label?: string }) {
  return <nav aria-label={label} className="rounded-md border border-border bg-card p-1.5">{items.map(item => <button key={item.id} aria-current={value === item.id ? 'page' : undefined} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${value === item.id ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'}`} onClick={() => onValueChange(item.id)} type="button">{item.icon}{item.label}</button>)}</nav>;
}
