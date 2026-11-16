import { Component, type ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '../components/button.js';
export function AsyncState({ loading = false, error, empty = false, onRetry, children, emptyMessage = 'No records yet.', loadingMessage = 'Loading…' }: { loading?: boolean; error?: string; empty?: boolean; onRetry?: () => void; children: ReactNode; emptyMessage?: string; loadingMessage?: string }) {
  return <div className="min-h-32">{loading ? <div role="status" className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground"><LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none"/>{loadingMessage}</div> : error ? <div role="alert" className="space-y-3 rounded-md border border-destructive/30 p-5"><p className="text-sm text-destructive">{error}</p>{onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>}</div> : empty ? <p role="status" className="p-8 text-center text-sm text-muted-foreground">{emptyMessage}</p> : children}</div>;
}

export class ContentBoundary extends Component<{ children: ReactNode; resetKey?: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidUpdate(previous: Readonly<{ children: ReactNode; resetKey?: string }>) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }
  render() {
    if (this.state.failed) return <AsyncState error="This preview could not load. Reload the page to try again." onRetry={() => window.location.reload()}>{null}</AsyncState>;
    return this.props.children;
  }
}
