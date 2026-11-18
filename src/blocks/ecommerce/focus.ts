import { useRef } from 'react';

/** Controlled dialogs may open without a primitive Trigger (including direct URLs). */
export function useStorefrontReturnFocus(fallback: string) {
  const previous = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus() { previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; },
    onCloseAutoFocus(event: Event) {
      event.preventDefault();
      const target = previous.current?.isConnected && previous.current !== document.body ? previous.current : document.querySelector<HTMLElement>(fallback);
      target?.focus({ preventScroll: true });
    },
  };
}
