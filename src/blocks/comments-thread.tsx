import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '../components/button.js';
import { Textarea } from '../components/textarea.js';
import { AsyncState } from './async-state.js';
import { ConfirmAction } from './confirm-action.js';

export type ThreadComment = Readonly<{
  id: string; author: string; text: string; createdAt: string; revision: number;
  canEdit: boolean; canDelete: boolean;
}>;
export type CommentsThreadProps = {
  items: readonly ThreadComment[];
  /** Opaque, non-secret UI identity boundary. The host still authorizes every request. */
  resourceKey?: string;
  canCreate?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  error?: string;
  actionError?: string;
  unavailable?: string;
  blocked?: boolean;
  hasMore?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onCreate?: (text: string) => Promise<void>;
  onEdit?: (comment: ThreadComment, text: string) => Promise<void>;
  onDelete?: (comment: ThreadComment) => Promise<void>;
  /** Product validation; return safe user-facing text, never raw server errors. */
  validateText?: (text: string) => string | undefined;
};
const failureMessage = 'We could not confirm this change. Your draft is kept. Refresh comments before trying again.';

export function CommentsThread({ resourceKey, ...props }: CommentsThreadProps) {
  return <CommentsThreadSession key={resourceKey} {...props}/>;
}

function CommentsThreadSession({ items, canCreate = false, loading = false, loadingMore = false,
  error, actionError, unavailable, blocked = false, hasMore = false, onRefresh, onLoadMore,
  onCreate, onEdit, onDelete, validateText }: CommentsThreadProps) {
  const id = useId();
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<{ comment: ThreadComment; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const running = useRef(false);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const [localError, setLocalError] = useState('');
  const [invalidField, setInvalidField] = useState<'create' | 'edit' | null>(null);
  const [notice, setNotice] = useState('');
  const disabled = busy || blocked || loading || loadingMore || !!unavailable || !!error;
  async function change(work: () => Promise<void>, success: () => void) {
    if (running.current || disabled) throw new Error(failureMessage);
    running.current = true; setBusy(true); setLocalError(''); setNotice('');
    try { await work(); if (active.current) { success(); setNotice('Comments updated.'); } }
    catch { if (active.current) setLocalError(failureMessage); throw new Error(failureMessage); }
    finally { running.current = false; if (active.current) setBusy(false); }
  }
  async function submit(event: FormEvent, mode: 'create' | 'edit') {
    event.preventDefault();
    if (running.current || disabled) return;
    if (mode === 'create' && (!canCreate || !onCreate)) { setLocalError('Adding comments is unavailable.'); return; }
    if (mode === 'edit' && (!editing || !onEdit || !items.some(item => item.id === editing.comment.id && item.canEdit))) {
      setLocalError('Editing this comment is unavailable.'); return;
    }
    const value = mode === 'create' ? draft : editing?.text ?? '';
    let invalid: string | undefined;
    try { invalid = !value.trim() ? 'Enter a comment.' : validateText?.(value); }
    catch { setLocalError('We could not validate this comment. Try again.'); return; }
    if (invalid) { setLocalError(invalid); setInvalidField(mode); return; }
    setInvalidField(null);
    try {
      if (mode === 'create' && onCreate) await change(() => onCreate(value), () => setDraft(''));
      if (mode === 'edit' && editing && onEdit) {
        const snapshot = editing;
        await change(() => onEdit(snapshot.comment, value), () => setEditing(null));
      }
    } catch { /* Inline safe feedback; rejected mutations never clear drafts. */ }
  }
  function timestamp(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
  }
  return <section aria-label="Comments" className="min-w-0 w-full space-y-4 [overflow-wrap:anywhere]" aria-busy={loading || loadingMore || busy}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-base font-semibold">Comments</h2>
      {onRefresh && <Button type="button" variant="outline" size="sm" disabled={busy || loading || loadingMore} onClick={() => { setLocalError(''); setInvalidField(null); onRefresh(); }}>Refresh comments</Button>}
    </div>
    <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{notice}</p>
    {(actionError || localError) && <p id={`${id}-error`} role="alert" className="text-sm text-destructive">{actionError || localError}</p>}
    {unavailable ? <p role="status" className="rounded-md border p-5 text-sm text-muted-foreground">{unavailable}</p> :
      <AsyncState loading={loading} error={error} onRetry={onRefresh} loadingMessage="Loading comments…">
        {!items.length && <p className="py-5 text-sm text-muted-foreground">No comments yet.</p>}
        <ol aria-label="Comment thread" className="space-y-3">
          {items.map(comment => <li key={comment.id} className="min-w-0 rounded-lg border bg-card p-4 text-card-foreground">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="break-all font-medium text-foreground">{comment.author}</span>
              <time className="min-w-0 [overflow-wrap:anywhere]" dateTime={Number.isNaN(new Date(comment.createdAt).getTime()) ? undefined : comment.createdAt}>{timestamp(comment.createdAt)}</time>
            </div>
            {editing?.comment.id === comment.id ? <form onSubmit={event => void submit(event, 'edit')} className="space-y-2" onKeyDown={event => { if (event.key === 'Escape' && !busy) { setEditing(null); setLocalError(''); setInvalidField(null); } }}>
              <label htmlFor={`${id}-edit`} className="text-sm font-medium">Edit comment</label>
              <Textarea id={`${id}-edit`} autoFocus value={editing.text} disabled={busy} aria-invalid={invalidField === 'edit'} aria-describedby={actionError || localError ? `${id}-error` : undefined}
                onChange={event => { setEditing(current => current ? { ...current, text: event.target.value } : null); if (invalidField === 'edit') { setInvalidField(null); setLocalError(''); } }} rows={4}/>
              <p className="text-xs text-muted-foreground">After a conflict, refresh, then cancel and reopen editing to use the current version.</p>
              <div className="flex flex-wrap gap-2"><Button type="submit" size="sm" disabled={disabled || !comment.canEdit}>Save comment</Button>
                <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => { setEditing(null); setLocalError(''); setInvalidField(null); }}>Cancel editing</Button></div>
            </form> : <p className="whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{comment.text}</p>}
            {(!editing || editing.comment.id !== comment.id) && <div className="mt-2 flex flex-wrap gap-1">
              {comment.canEdit && onEdit && <Button type="button" size="sm" variant="ghost" disabled={disabled || editing !== null} aria-label={`Edit comment by ${comment.author}`}
                onClick={() => { setEditing({ comment: { ...comment }, text: comment.text }); setLocalError(''); }}>Edit</Button>}
              {comment.canDelete && onDelete && <DeleteCommentAction comment={comment} disabled={disabled}
                onConfirm={snapshot => change(() => onDelete(snapshot), () => { if (editing?.comment.id === snapshot.id) setEditing(null); })}/>}
            </div>}
          </li>)}
        </ol>
        {hasMore && onLoadMore && <Button type="button" variant="outline" disabled={disabled} onClick={onLoadMore}>{loadingMore ? 'Loading more…' : 'Load more comments'}</Button>}
        {canCreate && onCreate ? <form onSubmit={event => void submit(event, 'create')} className="space-y-2 rounded-lg border p-4">
          <label htmlFor={`${id}-new`} className="text-sm font-medium">Add a comment</label>
          <Textarea id={`${id}-new`} rows={3} value={draft} onChange={event => { setDraft(event.target.value); if (invalidField === 'create') { setInvalidField(null); setLocalError(''); } }} disabled={busy} aria-invalid={invalidField === 'create'}
            aria-describedby={`${id}-hint${actionError || localError ? ` ${id}-error` : ''}`}/>
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">Plain text. Your draft stays here if saving fails.</p>
          <div className="flex flex-wrap gap-2"><Button type="submit" disabled={disabled}>{busy ? 'Saving…' : 'Post comment'}</Button>
            <Button type="button" variant="ghost" disabled={busy || !draft} onClick={() => { setDraft(''); setLocalError(''); setInvalidField(null); }}>Clear draft</Button></div>
        </form> : <p className="text-sm text-muted-foreground">You can read this thread. Adding comments is unavailable.</p>}
      </AsyncState>}
  </section>;
}

/** Capture the displayed revision when confirmation opens, never a later refresh. */
function DeleteCommentAction({ comment, disabled, onConfirm }: {
  comment: ThreadComment; disabled: boolean; onConfirm: (snapshot: ThreadComment) => Promise<void>;
}) {
  const [snapshot, setSnapshot] = useState<ThreadComment>(comment);
  return <ConfirmAction title="Delete this comment?" description="The comment will be removed from this thread. Retained records follow the host's policy."
    confirmLabel="Delete comment" destructive
    trigger={<Button type="button" size="sm" variant="ghost" disabled={disabled} aria-label={`Delete comment by ${comment.author}`} onClick={() => setSnapshot({ ...comment })}>Delete</Button>}
    onConfirm={() => onConfirm(snapshot)}/>;
}
