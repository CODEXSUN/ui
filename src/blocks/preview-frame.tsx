import { useClipboard } from '../lib/use-clipboard.js';
import { type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '../components/button.js';
export function PreviewFrame({ name, children }: { name: string; children: ReactNode }) {
  return <div aria-label={`${name} live preview`} className="overflow-hidden rounded-md border border-border bg-background shadow-sm"><div className="flex h-9 items-center gap-1 border-b border-border px-4"><span aria-hidden="true" className="size-2 rounded-full bg-rose-400"/><span aria-hidden="true" className="size-2 rounded-full bg-amber-400"/><span aria-hidden="true" className="size-2 rounded-full bg-emerald-400"/><span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{name}</span></div>{children}</div>;
}
export function UsageCode({ code, title = 'Usage code' }: { code: string; title?: string }) {
  const { copied, error, copyText } = useClipboard();
  const message = copied ? 'Copied' : error;
  return <section className="grid gap-3" aria-label={title}><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">{title}</h2><Button type="button" variant="outline" size="sm" onClick={() => void copyText(code)}>{message === 'Copied' ? <Check className="size-4"/> : <Copy className="size-4"/>}{message === 'Copied' ? 'Copied' : 'Copy code'}</Button></div><span role="status" className="sr-only">{message}</span><pre tabIndex={0} aria-label="Usage source code" className="overflow-x-auto rounded-md border border-border bg-muted/30 p-4 text-xs leading-6"><code className="language-tsx">{code}</code></pre></section>;
}
