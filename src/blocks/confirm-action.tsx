import { useState, type ReactNode } from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '../components/alert-dialog.js';
import { Button } from '../components/button.js';
export function ConfirmAction({ trigger, title, description, onConfirm, confirmLabel = 'Confirm', destructive = false }: { trigger: ReactNode; title: string; description: string; onConfirm: () => void | Promise<void>; confirmLabel?: string; destructive?: boolean }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <AlertDialog open={open} onOpenChange={next => { if (!busy) { setOpen(next); setError(''); } }}><AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{title}</AlertDialogTitle><AlertDialogDescription>{description}</AlertDialogDescription></AlertDialogHeader>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><Button disabled={busy} variant={destructive ? 'destructive' : 'default'} onClick={async () => { if (busy) return; setBusy(true); setError(''); try { await onConfirm(); setOpen(false); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to complete this action.'); } finally { setBusy(false); } }}>{busy ? 'Working…' : confirmLabel}</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
