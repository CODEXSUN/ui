import { useDesignSystem } from './provider.js';

/** Named gallery composition defaults share the app's existing preference store. */
export function useDesignSystemComponentDefault(componentId: string, fallback: string) {
  const { preferences } = useDesignSystem();
  return preferences.componentDefaults[componentId] ?? fallback;
}
