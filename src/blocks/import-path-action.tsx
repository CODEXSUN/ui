import { useClipboard } from '../lib/use-clipboard.js';
import { Check, Copy } from 'lucide-react';
import { Button } from '../components/button.js';

export function ImportPathAction({ path }: { path: string }) {
  const { copied, error, copyText } = useClipboard();
  const feedback = copied ? 'Copied' : error;
  return <div className="flex min-w-0 items-center gap-2"><code title={path} className="max-w-[42vw] truncate select-all rounded-md bg-muted px-3 py-1.5 text-xs">{path}</code><Button type="button" size="icon-sm" variant="ghost" aria-label={feedback === 'Copied' ? 'Import path copied' : 'Copy import path'} onClick={() => void copyText(path)}>{feedback === 'Copied' ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}</Button><span role="status" className="sr-only">{feedback}</span></div>;
}
