import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/tabs.js';
import { Button } from '../components/button.js';
import type { MdiDocument } from '../../contracts/workspace.js';

/** Tabbed multiple-document interface. Selection and close policy belong to the app. */
export function MdiWorkspace({ documents, activeId, onSelect, onClose, emptyState = 'Open a document to begin.', label = 'Documents' }: {
  documents: readonly MdiDocument[]; activeId: string; onSelect: (id: string) => void; onClose?: (id: string) => void; emptyState?: ReactNode; label?: string;
}) {
  if (!documents.length) return <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">{emptyState}</div>;
  return <Tabs value={activeId} onValueChange={onSelect} className="min-w-0">
    <div className="overflow-x-auto pb-2"><TabsList aria-label={label} className="h-auto min-h-9">{documents.map(document => <div key={document.id} className="flex items-center"><TabsTrigger value={document.id}>{document.title}</TabsTrigger>{onClose && document.closable !== false && <Button type="button" size="icon-xs" variant="ghost" aria-label={`Close ${document.title}`} onClick={() => onClose(document.id)}><X aria-hidden="true" /></Button>}</div>)}</TabsList></div>
    {documents.map(document => <TabsContent key={document.id} value={document.id} className="min-h-64 rounded-lg border border-border bg-card p-5 focus-visible:ring-2 focus-visible:ring-ring">{document.content}</TabsContent>)}
  </Tabs>;
}
