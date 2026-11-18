import { choices, defaultPreferences, persistDesignPreferences, readDesignPreferences, validatePreferences } from './preferences.js';

/** Run in head before styles/body paint. Shares validation and migration with the provider. */
export function createThemeInitScript(storageKey: string, options: { migrateToSilver?: boolean } = {}) {
  const json = (value: unknown) => JSON.stringify(value).replaceAll('<', '\\u003c');
  return `(function(){try{
var choices=${json(choices)};var defaultPreferences=${json(defaultPreferences)};
var validatePreferences=${validatePreferences.toString()};
var persistDesignPreferences=${persistDesignPreferences.toString()};
var readDesignPreferences=${readDesignPreferences.toString()};
var p=readDesignPreferences(${json(storageKey)},${!!options.migrateToSilver});
var d=p.mode==='dark'||(p.mode==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';r.dataset.designSystem='default';r.dataset.designVariant=p.palette;r.dataset.accent=p.accent;
}catch(e){}})();`;
}
