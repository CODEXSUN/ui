import type { ReactNode } from 'react';
import { cn } from '../lib/utils.js';

/** Composition only: the consuming app owns navigation and document state. */
export function MainWorkspace({ topMenu, sideMenu, statusBar, children, label = 'Main workspace', className }: {
  topMenu: ReactNode; sideMenu?: ReactNode; statusBar?: ReactNode; children: ReactNode; label?: string; className?: string;
}) {
  return <section aria-label={label} className={cn('flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground', className)}>{topMenu}<div className="flex min-h-0 flex-1 flex-col md:flex-row">{sideMenu}<div className="min-w-0 flex-1 p-4 sm:p-6">{children}</div></div>{statusBar}</section>;
}
