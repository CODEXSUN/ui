import { useState } from 'react';
import { Button } from '../../components/button.js';
import { AuthField } from './auth-field.js';
import { FieldGroup } from '../../components/Field.js';
import { AuthPageLayout, type AuthBrandProps } from './auth-page-layout.js';
export interface EmailVerificationPageProps extends AuthBrandProps {
  brandName?: string | undefined;
  embedded?: boolean | undefined;
  busy?: boolean | undefined;
  error?: string | undefined;
  backHref: string;
  onSubmit(code: string): void;
  onResend?: (() => void) | undefined;
  resendDisabled?: boolean | undefined;
}
/** The app validates expiring codes and owns resend cooldowns and neutral responses. */
export function EmailVerificationPage({ brandName, logoSrc, logoDarkSrc, logoAlt, role, embedded, busy = false, error, backHref, onSubmit, onResend, resendDisabled = false }: EmailVerificationPageProps) {
  const [code, setCode] = useState('');
  return <AuthPageLayout brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} logoAlt={logoAlt} role={role} embedded={embedded} variant="v1">
    <form className="grid gap-6" aria-busy={busy} onSubmit={event => { event.preventDefault(); if (!busy) onSubmit(code.trim()); }}>
      <header className="grid gap-2"><h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1><p className="text-sm leading-6 text-muted-foreground">Enter the verification code sent to your email address.</p></header><div className="border-t"/>
      <FieldGroup><AuthField label="Verification code" helper="Use the latest code. Request a new one if it has expired." autoComplete="one-time-code" required pattern={String.raw`.*\S.*`} disabled={busy} value={code} onChange={e => setCode(e.target.value)}/>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Verifying…' : 'Verify email'}</Button>
        <Button type="button" variant="outline" disabled={busy || resendDisabled || !onResend} onClick={onResend}>Resend code</Button>
        <a className="text-center text-sm text-muted-foreground hover:text-foreground" href={backHref}>Back to sign in</a>
      </FieldGroup>
    </form>
  </AuthPageLayout>;
}
