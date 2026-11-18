import { useId } from 'react';
import { useDesignSystem } from './provider.js';
import { Button } from '../components/button.js';
import type { DesignPreferences } from '../../contracts/design-system.js';

export function ThemeSelector() {
  const { preferences, update, reset } = useDesignSystem();
  const id = useId();
  const fields: { key: Exclude<keyof DesignPreferences, "componentDefaults">; label: string; values: string[] }[] = [
    { key: 'mode', label: 'Appearance', values: ['light', 'dark', 'system'] },
    { key: 'palette', label: 'Design theme', values: ['default', 'compact', 'clear', 'shadcn', 'neutral', 'orange', 'green', 'blue', 'purple', 'graphite', 'silver'] },
    { key: 'button', label: 'Buttons', values: ['default', 'secondary', 'outline', 'ghost'] },
    { key: 'badge', label: 'Badges', values: ['default', 'secondary', 'outline', 'ghost'] },
    { key: 'card', label: 'Cards', values: ['default', 'outline', 'soft'] },
  ];
  return <details className="my-5 shrink-0 text-xs text-foreground"><summary className="cursor-pointer py-2.5 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">Theme & components</summary><div className="grid gap-3 pt-2.5">
    <p className="text-[11px] text-muted-foreground">Default design system</p>
    {fields.map(({ key, label, values }) => <label className="grid gap-1" key={key} htmlFor={`${id}-${key}`}>{label}
      <select className="w-full rounded-md border border-input bg-card p-2 text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2" id={`${id}-${key}`} value={preferences[key]} onChange={event => update({ [key]: event.target.value })}>
        {values.map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}
      </select></label>)}
    <Button variant="outline" size="sm" onClick={reset}>Reset defaults</Button>
  </div></details>;
}
