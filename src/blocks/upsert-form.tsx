import { useEffect, useRef, type FormEventHandler, type ReactNode } from 'react';
import { Button } from '../components/button.js';
import { AppHeader, type AppHeaderBreadcrumb } from '../layouts/main-layouts/app-header.js';
import { useUpsertFormNavigation } from './upsert-form-navigation.js';
export * from './upsert-form-field.js';

export type UpsertFormProps = {
  id: string;
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  aside?: ReactNode;
  saving?: boolean;
  error?: string;
  status?: string;
  enableSaveShortcut?: boolean;
  noValidate?: boolean;
  keyboardNavigation?: boolean;
  uniformControlHeight?: boolean;
  density?: 'default' | 'compact';
};

/** Compose app-owned fields; native validation and submit work with the header Save button. */
export function UpsertForm({ id, children, onSubmit, aside, saving = false, error, status, enableSaveShortcut = true, noValidate = false, keyboardNavigation = false, uniformControlHeight = false, density = 'default' }: UpsertFormProps) {
  const form = useRef<HTMLFormElement>(null);
  const navigation = useUpsertFormNavigation(form, keyboardNavigation);
  useEffect(() => {
    if (!enableSaveShortcut) return;
    const save = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (!saving) form.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', save);
    return () => window.removeEventListener('keydown', save);
  }, [saving, enableSaveShortcut]);
  return <div className={`grid items-start gap-4 ${aside ? 'xl:grid-cols-[minmax(0,1fr)_20rem]' : ''}`}>
    <form ref={form} {...navigation} id={id} noValidate={noValidate} aria-label="Record form" aria-busy={saving} onSubmit={event => { if (saving) { event.preventDefault(); return; } onSubmit(event); }} className={`min-w-0 rounded-md border border-border bg-card shadow-sm ${density === 'compact' ? 'p-3 [&_[data-slot=upsert-form-section]]:p-3 [&_[data-slot=upsert-form-section]]:space-y-3' : 'p-6'} ${uniformControlHeight ? '[&_input:not([type=hidden])]:h-11 [&_[role=combobox]]:h-11' : ''}`}>
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      <fieldset disabled={saving} className={`grid min-w-0 lg:grid-cols-2 ${density === 'compact' ? 'gap-3' : 'gap-6'}`}>{children}</fieldset>
      {status && <p role="status" className="mt-4 text-sm text-muted-foreground">{status}</p>}
    </form>
    {aside && <aside aria-label="Related information" className="space-y-4">{aside}</aside>}
  </div>;
}

export function UpsertFormSave({ formId, saving = false, disabled = false, label = 'Save', showShortcut = true }: { formId: string; saving?: boolean; disabled?: boolean; label?: string; showShortcut?: boolean }) {
  return <Button type="submit" form={formId} size="sm" disabled={saving || disabled}>{saving ? 'Saving…' : label}{showShortcut && <kbd className="rounded bg-background/20 px-1 text-[10px]">Ctrl S</kbd>}</Button>;
}

export function UpsertFormHeader({ formId, breadcrumbs, homeHref = '/', saving, saveLabel }: { formId: string; breadcrumbs: AppHeaderBreadcrumb[]; homeHref?: string; saving?: boolean; saveLabel?: string }) {
  return <AppHeader homeHref={homeHref} breadcrumbs={breadcrumbs} actions={<UpsertFormSave formId={formId} saving={saving} label={saveLabel}/>}/>;
}

export function UpsertFormSection({ children, label }: { children: ReactNode; label: string }) {
  return <section data-slot="upsert-form-section" aria-label={label} className="min-w-0 space-y-5 rounded-md border border-border p-5">{children}</section>;
}
