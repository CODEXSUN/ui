import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/alert-dialog.js';

export type UnsavedChangesGuardOptions = { dirty: boolean; busy?: boolean; title?: string; description?: string };
/** Route every app-owned leave/cancel/link action through requestNavigation.
 * Native reload/tab close uses the browser's own generic beforeunload warning.
 * This hook does not intercept router history, popstate or arbitrary links.
 */
export function useUnsavedChangesGuard({ dirty, busy = false, title = 'Discard unsaved changes?', description = 'Your changes have not been saved. Stay to continue editing, or discard them and leave.' }: UnsavedChangesGuardOptions) {
  const [open, setOpen] = useState(false);
  const initiator = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(true);
  const pending = useRef<(() => void) | null>(null);
  const latest = useRef({ dirty, busy });
  latest.current = { dirty, busy };
  useEffect(() => {
    if (!dirty) { pending.current = null; setOpen(false); return; }
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const requestNavigation = useCallback((navigate: () => void): boolean => {
    if (latest.current.busy) return false;
    if (!latest.current.dirty) { navigate(); return true; }
    if (!pending.current) { pending.current = navigate; initiator.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; restoreFocus.current = true; }
    setOpen(true);
    return false;
  }, []);
  function close() { pending.current = null; setOpen(false); }
  function discard() {
    if (latest.current.busy) return;
    restoreFocus.current = false;
    const navigate = pending.current;
    pending.current = null; setOpen(false);
    navigate?.();
  }
  const dialog = <AlertDialog open={open} onOpenChange={value => { if (!value) close(); }}>
    <AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); if (restoreFocus.current && initiator.current?.isConnected) initiator.current.focus(); }}><AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>{description}</AlertDialogDescription></AlertDialogHeader>
      <AlertDialogFooter><AlertDialogCancel onClick={close}>Stay on page</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={event => { event.preventDefault(); discard(); }}>Discard and leave</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
  return { requestNavigation, dialog, isPromptOpen: open };
}
