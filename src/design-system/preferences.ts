import type { DesignPreferences } from '../../contracts/design-system.js';

export const defaultPreferences: DesignPreferences = {
  componentDefaults: {},
  mode: 'light', accent: 'green', palette: 'default', button: 'default', badge: 'default', card: 'default',
};
const choices = {
  palette: ['default', 'compact', 'clear', 'shadcn', 'neutral', 'orange', 'green', 'blue', 'purple', 'graphite'],
  mode: ['light', 'dark', 'system'], accent: ['green', 'blue', 'violet'],
  button: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'success', 'danger'],
  badge: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'studio-success', 'studio-warning'],
  card: ['default', 'outline', 'soft'],
};

export function validatePreferences(value: unknown): DesignPreferences {
  const result = { ...defaultPreferences };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  const stored = value as Record<string, unknown>;
  if (stored.componentDefaults && typeof stored.componentDefaults === 'object' && !Array.isArray(stored.componentDefaults)) {
    result.componentDefaults = Object.fromEntries(Object.entries(stored.componentDefaults).filter(([key, variant]) => /^[a-z][a-z0-9-]*$/.test(key) && typeof variant === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(variant)));
  }
  if (!('palette' in stored) && typeof stored.accent === 'string' && choices.accent.includes(stored.accent)) {
    result.palette = stored.accent === 'violet' ? 'purple' : stored.accent as 'green' | 'blue';
  }
  for (const key of Object.keys(choices) as (keyof typeof choices)[]) {
    const candidate = (value as Record<string, unknown>)[key];
    if (typeof candidate === 'string' && choices[key].includes(candidate)) {
      Object.assign(result, { [key]: candidate });
    }
  }
  return result;
}
