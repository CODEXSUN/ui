import { useEffect, useState } from 'react';
import { useDesignSystem } from '../../design-system/provider.js';

/** Use the selected shared palette in storefront previews, including system dark mode. */
export function useStorefrontTheme() {
  const { preferences } = useDesignSystem();
  const [systemDark, setSystemDark] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemDark(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return {
    'data-design-system': 'default',
    'data-design-variant': preferences.palette,
    className: preferences.mode === 'dark' || (preferences.mode === 'system' && systemDark) ? 'dark' : '',
  };
}
