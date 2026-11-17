import { useId, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card.js';
import { AsyncState } from './async-state.js';

export type RecordDetailField = { id: string; label: string; value: ReactNode };
export type RecordDetailSection = { id: string; title: string; description?: string; fields: readonly RecordDetailField[] };
export type RecordDetailV1Props = {
  title: string;
  sections: readonly RecordDetailSection[];
  description?: string;
  status?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  activity?: ReactNode;
  loading?: boolean;
  error?: string;
  empty?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
};
/** Display authorized app data. Reuse MainLayout header breadcrumbs/actions in app screens. */
export function RecordDetailV1({ title, sections, description, status, actions, aside, activity, loading = false, error, empty = false, onRetry, emptyMessage = 'Record not found.' }: RecordDetailV1Props) {
  const id = useId();
  return <section aria-labelledby={id} aria-busy={loading} className="space-y-5">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 space-y-2"><div className="flex flex-wrap items-center gap-3"><h2 id={id} className="break-words text-xl font-semibold">{title}</h2>{!loading && !error && !empty && status}</div>{description && <p className="text-sm text-muted-foreground">{description}</p>}</div>
      {!loading && !error && !empty && actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
    <AsyncState loading={loading} error={error} empty={empty} onRetry={onRetry} emptyMessage={emptyMessage}>
      <div className={`grid min-w-0 items-start gap-5 ${aside ? 'xl:grid-cols-[minmax(0,1fr)_20rem]' : ''}`}>
        <div className="min-w-0 space-y-5">{sections.map(section => <Card key={section.id}>
          <CardHeader><CardTitle><h3>{section.title}</h3></CardTitle>{section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}</CardHeader>
          <CardContent><dl className="grid min-w-0 gap-x-8 gap-y-5 sm:grid-cols-2">{section.fields.map(field => <div key={field.id} className="min-w-0 space-y-1.5"><dt className="text-sm text-muted-foreground">{field.label}</dt><dd className="break-words text-sm [overflow-wrap:anywhere]">{field.value == null || field.value === '' ? '—' : typeof field.value === 'boolean' ? String(field.value) : field.value}</dd></div>)}</dl></CardContent>
        </Card>)}{activity && <Card><CardHeader><CardTitle><h3>Activity</h3></CardTitle></CardHeader><CardContent>{activity}</CardContent></Card>}</div>
        {aside && <aside aria-label="Related information" className="min-w-0 space-y-5">{aside}</aside>}
      </div>
    </AsyncState>
  </section>;
}
