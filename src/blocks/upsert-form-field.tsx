import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Input } from '../components/input.js';
import { Textarea } from '../components/textarea.js';

export type UpsertFormFieldProps = {
  name: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  /** Use a prefix when multiple forms share a page. */
  idPrefix?: string;
};

export function UpsertFormField({ name, label, helper, error, required = false, children, idPrefix = 'field' }: UpsertFormFieldProps) {
  const id = `${idPrefix}-${name}`;
  const description = [helper ? `${id}-helper` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  const content = Children.map(children, child => isValidElement(child) && (child.type === Input || child.type === Textarea)
    ? cloneElement(child as ReactElement<Record<string, unknown>>, { id: `${id}-input`, 'aria-describedby': description, 'aria-invalid': !!error, required }) : child);
  return <div id={id} tabIndex={-1} role="group" aria-labelledby={`${id}-label`} aria-describedby={description} data-invalid={!!error} className="upsert-form-field space-y-1.5 rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring">
    <label id={`${id}-label`} htmlFor={`${id}-input`} className="block text-sm font-medium">{label}{required && <span className="ml-1 text-destructive">*</span>}</label>
    {content}
    {helper && <p id={`${id}-helper`} className="text-xs leading-snug text-muted-foreground">{helper}</p>}
    {error && <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>}
  </div>;
}

export function UpsertFormValidationSummary({ errors, idPrefix = 'field' }: { errors: Record<string, string>; idPrefix?: string }) {
  const entries = Object.entries(errors).filter(([, message]) => message);
  if (!entries.length) return null;
  return <div role="alert" className="mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-4">
    <h2 className="font-medium text-destructive">Check {entries.length} fields before saving</h2>
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{entries.map(([name, message]) => <li key={name}><button type="button" className="text-left text-destructive underline" onClick={() => document.getElementById(`${idPrefix}-${name}`)?.focus()}>{message}</button></li>)}</ul>
  </div>;
}
