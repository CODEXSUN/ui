import { useEffect, useId, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../components/button.js';
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '../components/attachment.js';
import { formatUploadSize } from './file-upload.js';

export type SavedAttachment = Readonly<{ id: string; name: string; sizeBytes: number; mediaType: string; revision: number; canDownload: boolean; canDelete: boolean }>;
export type AttachmentListProps = {
  items: readonly SavedAttachment[];
  resourceKey?: string;
  loading?: boolean;
  error?: string;
  unavailable?: string;
  blocked?: boolean;
  hasMore?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onDownload?: (snapshot: SavedAttachment) => Promise<void>;
  onDelete?: (snapshot: SavedAttachment) => Promise<void>;
};
/** Presentation only. Capability flags are hints; callbacks must authorize every operation. */
export function AttachmentList(props: AttachmentListProps) {
  return <AttachmentSession key={props.resourceKey} {...props}/>;
}
function AttachmentSession(props: AttachmentListProps) {
  const heading = useId();
  const [confirmation, setConfirmation] = useState<SavedAttachment>();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const active = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function run(snapshot: SavedAttachment, kind: 'download' | 'delete') {
    const current = props.items.find(item => item.id === snapshot.id);
    const callback = kind === 'download' ? props.onDownload : props.onDelete;
    if (active.current || props.loading || props.blocked || props.unavailable || !current || !callback || !(kind === 'download' ? current.canDownload : current.canDelete)) return;
    active.current = true; setBusy(true); setFailure('');
    try { await callback({ ...snapshot }); if (mounted.current) setConfirmation(undefined); }
    catch { if (mounted.current) setFailure('The action could not be confirmed. Refresh before trying again.'); }
    finally { active.current = false; if (mounted.current) setBusy(false); }
  }
  const disabled = busy || props.loading || props.blocked;
  return <section aria-labelledby={heading} className="min-w-0 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 id={heading} className="font-semibold">Saved attachments</h3>{props.onRefresh && <Button type="button" variant="outline" disabled={busy || props.loading} onClick={() => { setConfirmation(undefined); setFailure(''); props.onRefresh?.(); }}>Refresh attachments</Button>}</div>
    {props.unavailable ? <p role="status">{props.unavailable}</p> : <>
      {props.loading && <p role="status">Loading attachments…</p>}
      {(props.error || failure) && <p role="alert" className="break-words text-sm text-destructive">{props.error || failure}</p>}
      {!props.loading && !props.error && !props.items.length && <p className="text-sm text-muted-foreground">No saved attachments.</p>}
      <ul aria-label="Saved attachments" className="space-y-2">{props.items.map(item => <li key={item.id}>
        <Attachment className="w-full items-start">
          <AttachmentMedia><FileText aria-hidden="true"/></AttachmentMedia>
          <AttachmentContent><AttachmentTitle title={item.name}>{item.name}</AttachmentTitle><AttachmentDescription>{formatUploadSize(item.sizeBytes)} · {item.mediaType}</AttachmentDescription></AttachmentContent>
          <div className="ml-auto flex flex-wrap gap-1">
            {item.canDownload && props.onDownload && <Button type="button" size="sm" variant="outline" disabled={disabled} aria-label={`Download ${item.name}`} onClick={() => void run(item, 'download')}>Download</Button>}
            {item.canDelete && props.onDelete && <Button type="button" size="sm" variant="ghost" disabled={disabled} aria-label={`Delete ${item.name}`} onClick={() => { setFailure(''); setConfirmation({ ...item }); }}>Delete</Button>}
          </div>
        </Attachment>
      </li>)}</ul>
      {confirmation && <div role="group" aria-label="Confirm attachment deletion" className="space-y-2 rounded-lg border p-3" onKeyDown={event => { if (event.key === 'Escape' && !busy) setConfirmation(undefined); }}>
        <p className="break-words text-sm">Delete {confirmation.name}? The host's retention policy still applies.</p>
        <div className="flex flex-wrap gap-2"><Button type="button" variant="destructive" disabled={disabled || !props.items.find(item => item.id === confirmation.id)?.canDelete} onClick={() => void run(confirmation, 'delete')}>Confirm delete</Button><Button type="button" variant="outline" disabled={busy} onClick={() => setConfirmation(undefined)}>Cancel</Button></div>
      </div>}
      {props.hasMore && props.onLoadMore && <Button type="button" variant="outline" disabled={disabled} onClick={props.onLoadMore}>Load more attachments</Button>}
    </>}
  </section>;
}
