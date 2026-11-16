import type { ReactNode } from 'react';

export type WorkspaceNavigationItem = { id: string; label: string; icon?: ReactNode };
export type MdiDocument = { id: string; title: string; content: ReactNode; closable?: boolean };
