export type CheckResultItem = { name: string; passed: boolean; output: string };
export function CheckResults({ items, emptyMessage = 'Checks have not run.' }: { items: readonly CheckResultItem[]; emptyMessage?: string }) {
  return <>{!items.length && <p className="text-muted-foreground">{emptyMessage}</p>}{items.map((item, index) => <details key={`${item.name}-${index}`} className="mb-3 rounded-lg border border-border p-3"><summary className="text-sm">{item.name} · {item.passed ? 'Passed' : 'Failed'}</summary><pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs">{item.output}</pre></details>)}</>;
}
