import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, FileText, LoaderCircle, UploadCloud, X } from 'lucide-react';
import { Button } from '../components/button.js';
import { Progress } from '../components/progress.js';
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '../components/attachment.js';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../components/dialog.js';

export const FILE_UPLOAD_DEFAULTS = { accept: 'image/png,image/jpeg,application/pdf', maxFiles: 5, maxSizeBytes: 5 * 1024 * 1024 } as const;
export type FileUploadResult = { id: string };
export type FileUploadItem = { id: string; file: File; status: 'queued' | 'uploading' | 'success' | 'error' | 'canceled'; progress?: number; result?: FileUploadResult; error?: string };
export type FileUploadHandler = (file: File, context: { signal: AbortSignal; onProgress: (percent: number) => void }) => Promise<FileUploadResult>;
type FileUploadCommonProps = {
  compact?: boolean;
  onFilesChange?: (files: readonly FileUploadItem[]) => void;
  label?: string;
  helper?: ReactNode;
  accept?: string;
  maxFiles?: number;
  maxSizeBytes?: number;
  multiple?: boolean;
  disabled?: boolean;
};
/** Existing normal-upload contract keeps its required persistence callback. */
export type FileUploadProps = FileUploadCommonProps & { selectionOnly?: false; onUpload: FileUploadHandler };
/** Local selection does not claim persistence or require a storage callback. */
export type FileSelectionProps = FileUploadCommonProps & { selectionOnly: true; onUpload?: FileUploadHandler };
/** Client validation is feedback only; apps validate content/authorization again on the server. */
export function validateUploadFile(file: Pick<File, 'name' | 'size' | 'type'>, { accept = FILE_UPLOAD_DEFAULTS.accept, maxSizeBytes = FILE_UPLOAD_DEFAULTS.maxSizeBytes }: { accept?: string; maxSizeBytes?: number } = {}): string | undefined {
  if (file.size === 0) return 'The file is empty.';
  if (file.size > maxSizeBytes) return `Maximum file size is ${formatUploadSize(maxSizeBytes)}.`;
  const rules = accept.split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  const type = file.type.toLowerCase();
  if (rules.length && !rules.some(rule => rule === '*/*' || (rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule))) return 'This file type is not allowed.';
}
export function formatUploadSize(bytes: number) { return bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }
function fileKey(file: File) { return `${file.name}\u0000${file.size}\u0000${file.lastModified}`; }

export function FileUpload({ selectionOnly = false, compact = false, onUpload, onFilesChange, label = 'Attachments', helper, accept = FILE_UPLOAD_DEFAULTS.accept, maxFiles = FILE_UPLOAD_DEFAULTS.maxFiles, maxSizeBytes = FILE_UPLOAD_DEFAULTS.maxSizeBytes, multiple = true, disabled = false }: FileUploadProps | FileSelectionProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<FileUploadItem[]>([]);
  const current = useRef<FileUploadItem[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const mounted = useRef(true);
  const notify = useRef(onFilesChange); notify.current = onFilesChange;
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);
  const limit = multiple ? Math.max(1, Math.floor(Number.isFinite(maxFiles) ? maxFiles : FILE_UPLOAD_DEFAULTS.maxFiles)) : 1;
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; controllers.current.forEach(controller => controller.abort()); controllers.current.clear(); }; }, []);
  useEffect(() => { notify.current?.(items); }, [items]);
  function publish(next: FileUploadItem[]) { current.current = next; if (mounted.current) setItems(next); }
  function update(itemId: string, change: Partial<FileUploadItem>) { publish(current.current.map(item => item.id === itemId ? { ...item, ...change } : item)); }
  function add(files: readonly File[]) {
    if (disabled) return;
    const next = [...current.current]; const rejected: string[] = [];
    for (const file of files) {
      const invalid = validateUploadFile(file, { accept, maxSizeBytes });
      if (invalid) { rejected.push(`${file.name}: ${invalid}`); continue; }
      if (next.some(item => fileKey(item.file) === fileKey(file))) { rejected.push(`${file.name}: Already added.`); continue; }
      if (next.length >= limit) { rejected.push(`${file.name}: Maximum ${limit} file${limit === 1 ? '' : 's'}.`); continue; }
      next.push({ id: crypto.randomUUID(), file, status: 'queued' });
    }
    setErrors(rejected); publish(next);
  }
  async function upload(item: FileUploadItem) {
    const queuedItem = current.current.find(value => value.id === item.id);
    if (selectionOnly || !onUpload || disabled || controllers.current.has(item.id) || !queuedItem || !['queued', 'error', 'canceled'].includes(queuedItem.status)) return;
    const controller = new AbortController(); controllers.current.set(item.id, controller);
    const active = () => mounted.current && !controller.signal.aborted && controllers.current.get(item.id) === controller;
    update(item.id, { status: 'uploading', error: undefined, progress: undefined });
    try {
      const result = await onUpload(item.file, { signal: controller.signal, onProgress: percent => { if (active() && Number.isFinite(percent)) update(item.id, { progress: Math.max(0, Math.min(100, percent)) }); } });
      if (!result || typeof result.id !== 'string' || !result.id.trim()) throw new Error('Upload response requires a saved file ID.');
      if (active()) update(item.id, { status: 'success', progress: 100, result });
    } catch {
      if (active()) update(item.id, { status: 'error', error: 'Upload failed. Try again.' });
    } finally { if (controllers.current.get(item.id) === controller) controllers.current.delete(item.id); }
  }
  function cancel(itemId: string) { controllers.current.get(itemId)?.abort(); controllers.current.delete(itemId); update(itemId, { status: 'canceled', error: undefined }); }
  function remove(itemId: string) { controllers.current.get(itemId)?.abort(); controllers.current.delete(itemId); publish(current.current.filter(item => item.id !== itemId)); }
  const acceptLabel = accept === FILE_UPLOAD_DEFAULTS.accept ? 'PNG, JPEG or PDF' : accept || 'all file types';
  const queued = items.filter(item => item.status === 'queued');
  const uploading = items.filter(item => item.status === 'uploading').length;
  return <section aria-labelledby={id} className={compact ? "min-w-0 space-y-1" : "min-w-0 space-y-4"}>
    <div className={compact ? "sr-only" : undefined}><h3 id={id} className="text-base font-semibold">{label}</h3><div id={`${id}-help`} className="mt-1 text-sm text-muted-foreground">{helper ?? `Choose or drop files. Maximum ${limit} file${limit === 1 ? '' : 's'}, ${formatUploadSize(maxSizeBytes)} each. Accepted: ${acceptLabel}.`}</div></div>
    <div data-dragging={dragging || undefined} className={compact ? "rounded-lg data-[dragging=true]:bg-accent" : "rounded-lg border-2 border-dashed border-border bg-muted/20 p-6 text-center data-[dragging=true]:border-primary data-[dragging=true]:bg-accent"}
      onDragEnter={event => { if (event.dataTransfer.types.includes('Files')) { event.preventDefault(); if (!disabled) { depth.current++; setDragging(true); } } }}
      onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'; }}
      onDragLeave={event => { event.preventDefault(); depth.current = Math.max(0, depth.current - 1); if (!depth.current) setDragging(false); }}
      onDrop={event => { event.preventDefault(); depth.current = 0; setDragging(false); add(Array.from(event.dataTransfer.files)); }}>
      {!compact && <UploadCloud aria-hidden="true" className="mx-auto mb-3 size-7 text-muted-foreground"/>}
      {!compact && <p className="mb-3 text-sm text-muted-foreground">Drop files here or choose from your device</p>}
      <Button type="button" variant="outline" disabled={disabled || items.length >= limit} onClick={() => input.current?.click()}>{compact ? "Attach files" : "Choose files"}</Button>
      <input ref={input} type="file" className="hidden" aria-label={`Choose ${label}`} aria-describedby={`${id}-help`} accept={accept} multiple={multiple} disabled={disabled || items.length >= limit} onChange={event => { add(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }}/>
    </div>
    {errors.length > 0 && <div role="alert" className="rounded-md border border-destructive/30 p-3 text-sm"><ul className="list-disc space-y-1 break-words pl-4 text-destructive">{errors.map((error, index) => <li key={index}>{error}</li>)}</ul><Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={() => setErrors([])}>Clear validation messages</Button></div>}
    {!selectionOnly && !onUpload && <p role="alert" className="text-sm text-destructive">File upload is unavailable.</p>}
    {!selectionOnly && <div className="flex flex-wrap items-center justify-between gap-3"><p role="status" aria-live="polite" className="text-sm text-muted-foreground">{items.length} selected · {uploading} uploading · {items.filter(item => item.status === 'success').length} complete</p><Button type="button" disabled={disabled || !onUpload || !queued.length} onClick={() => queued.forEach(item => void upload(item))}>Upload files</Button></div>}
    {items.length > 0 && <ul aria-label="Selected files" className="space-y-3">{items.map(item => <li key={item.id}>
      <Attachment className="w-full items-start sm:flex-nowrap" state={item.status === 'success' ? 'done' : item.status === 'uploading' ? 'uploading' : item.status === 'error' ? 'error' : 'idle'}>
        <LocalFilePreview file={item.file} disabled={disabled}/>
        <AttachmentContent><AttachmentTitle title={item.file.name}>{item.file.name}</AttachmentTitle><AttachmentDescription>{formatUploadSize(item.file.size)} · {selectionOnly ? 'Selected locally' : item.status === 'success' ? 'Uploaded' : item.status === 'uploading' ? item.progress == null ? 'Uploading…' : `${Math.round(item.progress)}% uploaded` : item.status === 'canceled' ? 'Canceled' : item.status === 'error' ? 'Failed' : 'Ready to upload'}</AttachmentDescription>
          {item.status === 'uploading' && (item.progress == null ? <span role="status" className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><LoaderCircle aria-hidden="true" className="size-3 animate-spin motion-reduce:animate-none"/>Waiting for progress</span> : <Progress className="mt-3 h-1.5" value={item.progress} aria-label={`Upload progress for ${item.file.name}`}/>)}
          {item.error && <p role="alert" className="mt-2 text-sm text-destructive">{item.error}</p>}
        </AttachmentContent>
        <div className="ml-auto flex shrink-0 items-center gap-1">{item.status === 'success' && <CheckCircle2 aria-label="Upload complete" className="size-4 text-primary"/>}
          {item.status === 'uploading' && <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={() => cancel(item.id)}>Cancel</Button>}
          {(item.status === 'error' || item.status === 'canceled') && <Button type="button" variant="outline" size="sm" disabled={disabled || !onUpload} aria-label={`Retry ${item.file.name}`} onClick={() => void upload(item)}>Retry</Button>}
          <Button type="button" variant="ghost" size="icon-sm" disabled={disabled} aria-label={`Remove ${item.file.name} from list`} onClick={() => remove(item.id)}><X aria-hidden="true" className="size-4"/></Button>
        </div>
      </Attachment>
    </li>)}</ul>}
  </section>;
}
function LocalFilePreview({ file, disabled }: { file: File; disabled: boolean }) {
  const [url, setUrl] = useState<string>(); const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) return;
    const objectUrl = URL.createObjectURL(file); setUrl(objectUrl);
    return () => { URL.revokeObjectURL(objectUrl); };
  }, [file]);
  return <AttachmentMedia>{url && !failed ? <Dialog><DialogTrigger asChild><Button type="button" variant="ghost" size="icon" disabled={disabled} aria-label={`Preview ${file.name}`}><img src={url} alt="" className="size-10 rounded-md object-cover" onError={() => setFailed(true)}/></Button></DialogTrigger><DialogContent className="max-w-3xl"><DialogTitle className="break-words pr-6">{file.name}</DialogTitle><DialogDescription>Local image preview. Opening it does not upload the file.</DialogDescription><img src={url} alt={file.name} className="max-h-[70vh] w-full object-contain"/></DialogContent></Dialog> : <FileText aria-hidden="true" className="size-5"/>}</AttachmentMedia>;
}
