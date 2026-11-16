import { useState, type FormEvent } from 'react';
import { Button } from '../../components/button.js';
import { AuthField } from './auth-field.js';
import { FieldGroup } from '../../components/Field.js';
import { AuthPageLayout, type AuthBrandProps } from './auth-page-layout.js';

export interface PasswordFormProps extends AuthBrandProps {
  brandName?: string | undefined;
  embedded?: boolean | undefined;
  busy?: boolean | undefined;
  error?: string | undefined;
  backHref: string;
  minLength?: number | undefined;
}
export function PasswordForm({ brandName, logoSrc, logoDarkSrc, logoAlt, role, embedded, busy = false, error, backHref, minLength = 8, change = false, onSubmit }: PasswordFormProps & { change?: boolean; onSubmit(values: { currentPassword: string; newPassword: string }): void }) {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && confirm !== newPassword;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!busy && !mismatch) onSubmit({ currentPassword, newPassword });
  }
  return <AuthPageLayout brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} logoAlt={logoAlt} role={role} embedded={embedded} variant="v1">
    <form className="grid gap-6" aria-busy={busy} onSubmit={submit}>
      <header className="grid gap-2"><h1 className="text-2xl font-semibold tracking-tight">{change ? 'Change password' : 'Set a new password'}</h1><p className="text-sm leading-6 text-muted-foreground">{change ? 'Confirm your current password and choose a new one.' : 'Choose a new password to finish account recovery.'}</p></header>
      <div className="border-t"/>
      <FieldGroup>
        {change && <AuthField label="Current password" helper="Enter the password currently used for this account." type="password" autoComplete="current-password" required disabled={busy} value={currentPassword} onChange={e => setCurrent(e.target.value)}/>}
        <AuthField label="New password" helper={`Use at least ${minLength} characters. Your app may require additional password rules.`} type="password" autoComplete="new-password" required minLength={minLength} disabled={busy} value={newPassword} onChange={e => setPassword(e.target.value)}/>
        <AuthField label="Confirm new password" helper="Enter the same new password again." type="password" autoComplete="new-password" required minLength={minLength} disabled={busy} value={confirm} error={mismatch ? 'Passwords must match.' : undefined} onChange={e => setConfirm(e.target.value)}/>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy || mismatch}>{busy ? 'Saving…' : change ? 'Change password' : 'Reset password'}</Button>
        <a className="text-center text-sm text-muted-foreground hover:text-foreground" href={backHref}>{change ? 'Back to settings' : 'Back to sign in'}</a>
      </FieldGroup>
    </form>
  </AuthPageLayout>;
}
