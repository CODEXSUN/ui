import type { ReactNode } from 'react';
export function InformationPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-md border border-border bg-card shadow-sm"><h2 className="border-b border-border px-4 py-3 text-sm font-medium">{title}</h2><div className="p-4 text-xs leading-relaxed text-muted-foreground">{children}</div></section>;
}
