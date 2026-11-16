import type { ReactNode } from 'react';
import { Button } from '../components/button.js';
import { cn } from '../lib/utils.js';
import type { WorkspaceNavigationItem } from '../../contracts/workspace.js';

export function WorkspaceTopMenu({ title, children }: { title: string; children?: ReactNode }) {
  return <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3"><span className="font-semibold tracking-tight">{title}</span><nav aria-label={`${title} actions`} className="flex flex-wrap items-center gap-2">{children}</nav></header>;
}

export function WorkspaceSideMenu({ items, activeId, onSelect, children, className }: {
  items: readonly WorkspaceNavigationItem[]; activeId: string; onSelect: (id: string) => void; children?: ReactNode; className?: string;
}) {
  return <aside className={cn('border-b border-border bg-card p-3 md:w-52 md:shrink-0 md:border-r md:border-b-0', className)}><nav aria-label="Workspace navigation" className="flex flex-wrap gap-1 md:grid">{items.map(item => <Button type="button" key={item.id} variant={activeId === item.id ? 'secondary' : 'ghost'} aria-current={activeId === item.id ? 'page' : undefined} className="justify-start" onClick={() => onSelect(item.id)}>{item.icon}{item.label}</Button>)}</nav>{children}</aside>;
}

export function WorkspaceStatusBar({ children, end }: { children: ReactNode; end?: ReactNode }) {
  return <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground"><span role="status" aria-live="polite">{children}</span>{end && <span>{end}</span>}</footer>;
}
