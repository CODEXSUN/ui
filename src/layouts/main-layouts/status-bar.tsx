export function StatusBar({ status, workspace, versionLabel }: { status: string; workspace: string; versionLabel?: string }) {
  return (
    <footer data-slot="status-bar" className="flex h-6 shrink-0 items-center gap-4 border-t px-3 text-xs text-muted-foreground">
      <span>{status}</span>
      <span>{workspace}</span>
      {versionLabel && <span className="ml-auto shrink-0" aria-label="Application version">{versionLabel}</span>}
    </footer>
  );
}
