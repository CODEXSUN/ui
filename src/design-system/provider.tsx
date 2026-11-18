import * as React from 'react';
import type { DesignPreferences } from '../../contracts/design-system.js';
import { defaultPreferences, validatePreferences, readDesignPreferences, persistDesignPreferences } from './preferences.js';

const Context = React.createContext({
  preferences: defaultPreferences,
  update: (_patch: Partial<DesignPreferences>) => {},
  reset: () => {},
});

export function DesignSystemProvider({ children, storageKey = 'workspace.ui.preferences', migrateToSilver = false }: {
  children: React.ReactNode; storageKey?: string; migrateToSilver?: boolean;
}) {
  const [preferences, setPreferences] = React.useState<DesignPreferences>(() => {
    if (typeof window === 'undefined') return { ...defaultPreferences };
    return readDesignPreferences(storageKey, migrateToSilver);
  });
  React.useEffect(() => {
    setPreferences(readDesignPreferences(storageKey, migrateToSilver));
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) {
        try { setPreferences(validatePreferences(JSON.parse(event.newValue ?? 'null'))); }
        catch { setPreferences({ ...defaultPreferences }); }
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [storageKey, migrateToSilver]);
  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = preferences.mode === 'dark' || (preferences.mode === 'system' && media.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.documentElement.dataset.accent = preferences.accent;
      document.documentElement.dataset.designSystem = 'default';
      document.documentElement.dataset.designVariant = preferences.palette;
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    };
    apply(); media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [preferences]);
  const update = (patch: Partial<DesignPreferences>) => setPreferences(current => {
    const palette = patch.palette ?? (patch.accent ? (patch.accent === 'violet' ? 'purple' : patch.accent) : current.palette);
    const next = validatePreferences({ ...current, ...patch, palette });
    persistDesignPreferences(storageKey, next, migrateToSilver);
    return next;
  });
  return <Context.Provider value={{ preferences, update, reset: () => update(defaultPreferences) }}>{children}</Context.Provider>;
}

export const useDesignSystem = () => React.useContext(Context);
