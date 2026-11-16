import { useId, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { Badge } from '../components/badge.js';
import { Button } from '../components/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card.js';
export type OverviewMetric = { id: string; label: string; value: ReactNode; description: string };
export type OverviewModule = { id: string; title: string; description: string; icon?: ReactNode };
export type OverviewDashboardProps = {
 title: string; description: string; metrics: readonly OverviewMetric[];
 modules: readonly OverviewModule[]; onOpenModule: (id: string) => void;
 availability: string; activity: ReactNode; guidance: ReactNode; actions?: ReactNode;
};
export function OverviewDashboard({ title, description, metrics, modules, onOpenModule, availability, activity, guidance, actions }: OverviewDashboardProps) {
 const modulesHeadingId = useId();
 return <div className="space-y-7">
  <header className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-2xl space-y-2"><p className="text-xs font-medium uppercase tracking-widest text-primary">Workspace overview</p><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1><p className="text-sm leading-6 text-muted-foreground">{description}</p></div>{actions && <div className="flex flex-wrap gap-2">{actions}</div>}</header>
  <section aria-label="Data availability" className="flex flex-wrap items-start gap-3 rounded-lg border border-border bg-muted/40 p-4"><Badge variant="outline">Not connected</Badge><p className="min-w-0 flex-1 text-sm leading-6 text-muted-foreground">{availability}</p></section>
  <section aria-label="Overview metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(metric => <Card key={metric.id} className="py-5"><CardContent><dl className="space-y-3"><dt className="text-sm text-muted-foreground">{metric.label}</dt><dd className="text-3xl font-semibold tracking-tight" aria-label={metric.value == null ? metric.label + ': not connected' : undefined}>{metric.value ?? '—'}</dd><dd className="text-xs leading-5 text-muted-foreground">{metric.description}</dd></dl></CardContent></Card>)}</section>
  <section aria-labelledby={modulesHeadingId}><div className="mb-4 flex items-center gap-2"><LayoutGrid aria-hidden="true" className="size-4 text-primary"/><h2 id={modulesHeadingId} className="text-lg font-semibold">Modules</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{modules.map(module => <Card key={module.id} className="gap-4"><CardHeader><div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">{module.icon ?? <LayoutGrid className="size-5"/>}</div><CardTitle><h3>{module.title}</h3></CardTitle></CardHeader><CardContent className="flex flex-1 flex-col items-start gap-4"><p className="flex-1 text-sm leading-6 text-muted-foreground">{module.description}</p><Button type="button" variant="outline" size="sm" onClick={() => onOpenModule(module.id)} aria-label={'Open module: ' + module.title}>Open module<ArrowUpRight aria-hidden="true"/></Button></CardContent></Card>)}</div></section>
  <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"><Card><CardHeader><CardTitle><h2>Recent activity</h2></CardTitle></CardHeader><CardContent>{activity}</CardContent></Card>{guidance}</div>
 </div>;
}
export type OverviewModulePanelProps = {
 title: string; description: string; focus: readonly string[]; measures: readonly string[];
 emptyMessage: string; onBack: () => void;
};
export function OverviewModulePanel({ title, description, focus, measures, emptyMessage, onBack }: OverviewModulePanelProps) {
 return <div className="space-y-6"><Button type="button" variant="ghost" size="sm" onClick={onBack}><ArrowLeft aria-hidden="true"/>Back to overview</Button><header className="space-y-2"><Badge variant="outline">Module overview</Badge><h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1><p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></header>
 <Card><CardHeader><CardTitle><h2>Data connection</h2></CardTitle></CardHeader><CardContent><Badge variant="outline">Not connected</Badge><p role="status" className="mt-4 text-sm leading-6 text-muted-foreground">{emptyMessage}</p></CardContent></Card>
 <div className="grid items-start gap-5 md:grid-cols-2"><Card><CardHeader><CardTitle><h2>Module scope</h2></CardTitle></CardHeader><CardContent><ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-muted-foreground">{focus.map(item=><li key={item}>{item}</li>)}</ul></CardContent></Card><Card><CardHeader><CardTitle><h2>Measures to track</h2></CardTitle></CardHeader><CardContent><ul className="space-y-3">{measures.map(item=><li key={item} className="flex items-center justify-between gap-4 border-b border-border pb-3 text-sm"><span>{item}</span><span className="shrink-0 text-xs text-muted-foreground">Not connected</span></li>)}</ul></CardContent></Card></div></div>;
}
