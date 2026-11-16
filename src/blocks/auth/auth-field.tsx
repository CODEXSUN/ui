import { useId, useState, type InputHTMLAttributes } from 'react';
import { Field, FieldLabel } from '../../components/Field.js';
import { Input } from '../../components/input.js';

/** Internal shared auth field: native constraints, persistent helper and linked inline errors. */
export function AuthField({ label, helper, error, onChange, onBlur, onInvalid, ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string; helper: string; error?: string | undefined }) {
  const id = useId();
  const [nativeError, setNativeError] = useState('');
  const message = error || nativeError;
  function validate(element: HTMLInputElement) {
    setNativeError(element.validity.valid ? '' : element.validity.valueMissing ? `${label} is required.` : element.validationMessage);
  }
  return <Field className="upsert-form-field" data-invalid={!!message || undefined}>
    <FieldLabel htmlFor={id}>{label}{input.required && <span aria-hidden="true" className="text-destructive"> *</span>}</FieldLabel>
    <Input {...input} id={id} className="h-11" aria-invalid={!!message || undefined} aria-describedby={`${id}-help${message ? ` ${id}-error` : ''}`}
      onInvalid={event => { validate(event.currentTarget); onInvalid?.(event); }}
      onBlur={event => { validate(event.currentTarget); onBlur?.(event); }}
      onChange={event => { if (nativeError) validate(event.currentTarget); onChange?.(event); }}/>
    <p id={`${id}-help`} className="text-sm text-muted-foreground">{helper}</p>
    {message && <p id={`${id}-error`} role="alert" className="text-sm text-destructive">{message}</p>}
  </Field>;
}
