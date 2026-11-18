import { useRef, type KeyboardEvent, type RefObject } from 'react';

export function useUpsertFormNavigation(form: RefObject<HTMLFormElement | null>, enabled: boolean) {
  const escaped = useRef<HTMLElement | null>(null);
  function move(target: HTMLElement, direction: number) {
    const fields = [...(form.current?.querySelectorAll<HTMLElement>('input:not([type="hidden"]),textarea,select,[role="combobox"]') ?? [])]
      .filter(field => !field.matches(':disabled,[aria-disabled="true"]') && field.tabIndex >= 0 && field.getClientRects().length > 0);
    const index = fields.indexOf(target);
    if (index < 0 || !fields.length) return;
    escaped.current = null;
    fields[(index + direction + fields.length) % fields.length].focus();
  }
  function onKeyDownCapture(event: KeyboardEvent<HTMLFormElement>) {
    if (!enabled || event.nativeEvent.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (!form.current?.contains(target) || !target.matches('input,textarea,select,[role="combobox"]')) return;
    const editable = target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement && ['text', 'search', 'tel', 'url', 'password'].includes(target.type);
    const expanded = target.getAttribute('aria-expanded') === 'true';
    if (event.key !== 'Escape') escaped.current = null;
    if (event.key === 'Enter') {
      if (event.shiftKey && target instanceof HTMLTextAreaElement) return;
      if (expanded) {
        // Let the lookup commit its highlighted option before advancing.
        if (editable) requestAnimationFrame(() => {
          if (target.isConnected && document.activeElement === target && !document.querySelector('[role="dialog"]')) move(target, 1);
        });
        return;
      }
      event.preventDefault(); event.stopPropagation(); move(target, 1);
    } else if (event.key === 'Escape') {
      if (expanded) {
        // Menus retain their native dismiss behavior; then select editable text.
        if (editable) requestAnimationFrame(() => { if (target.isConnected) { target.select(); escaped.current = target; } });
        return;
      }
      event.preventDefault(); event.stopPropagation();
      if (editable && escaped.current !== target) { target.select(); escaped.current = target; }
      else move(target, -1);
    }
  }
  return { onKeyDownCapture, onFocusCapture: () => { escaped.current = null; }, onPointerDownCapture: () => { escaped.current = null; } };
}
