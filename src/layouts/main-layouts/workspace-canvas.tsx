import type { ReactNode } from "react";

export function WorkspaceCanvas({ children }: { children?: ReactNode }) {
  return (
    <main aria-label="Workspace canvas" className="min-h-0 min-w-0 w-full flex-1 bg-background">
      {children}
    </main>
  );
}
