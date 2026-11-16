import { useEffect, useRef, type ReactNode } from 'react';
export type ActivityFeedItem = { id: string | number; kind: ReactNode; time: ReactNode; message: ReactNode };
export function ActivityFeed({ items, emptyMessage = 'No activity yet.', label = 'Activity', autoScroll = true }: { items: readonly ActivityFeedItem[]; emptyMessage?: ReactNode; label?: string; autoScroll?: boolean }) {
  const feed = useRef<HTMLDivElement>(null);
  const lastId = items.at(-1)?.id;
  useEffect(() => { if (autoScroll && feed.current) feed.current.scrollTop = feed.current.scrollHeight; }, [lastId, autoScroll]);
  return <div className="max-h-[420px] min-h-48 space-y-4 overflow-y-auto pr-2" aria-label={label} ref={feed}>{!items.length && <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>}{items.map(item => <div key={item.id} className="flex gap-3"><span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50"/><div className="min-w-0 flex-1"><div className="mb-1 flex items-center justify-between gap-2 text-[10px] uppercase tracking-wide text-muted-foreground"><span>{item.kind}</span><time>{item.time}</time></div><div className="whitespace-pre-wrap break-words text-xs leading-relaxed">{item.message}</div></div></div>)}</div>;
}
