import { useState, type FormEvent } from 'react';
import { Button } from '../../components/button.js';
import { FieldGroup } from '../../components/Field.js';
import { AuthField } from './auth-field.js';
import { AuthPageLayout, AuthVisualPanel, type AuthPageVariant, type AuthBrandProps } from './auth-page-layout.js';

export interface RegisterPageProps extends AuthBrandProps {
  brandName?: string | undefined;
  busy?: boolean | undefined;
  error?: string | undefined;
  loginHref?: string | undefined;
  embedded?: boolean | undefined;
  minLength?: number | undefined;
  onSubmit(name: string, email: string, password: string, username?: string, mobile?: string): void;
  variant?: AuthPageVariant | undefined;
}
export function RegisterPage({ embedded = false, brandName, logoSrc, logoDarkSrc, logoAlt, role, busy = false, error, loginHref = '/login', onSubmit, variant = 'v1', minLength = 8 }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const mismatch = confirm.length > 0 && confirm !== password;
  return <AuthPageLayout aside={<AuthVisualPanel description="Create one trusted identity for projects, agents, and connected application desks." title="Start with a secure workspace."/>} embedded={embedded} brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} logoAlt={logoAlt} role={role} variant={variant}>
    <form aria-busy={busy} className="grid gap-6" onSubmit={(event: FormEvent) => { event.preventDefault(); if (!busy && !mismatch) onSubmit(name.trim(), email.trim(), password, username.trim() || undefined, mobile.trim() || undefined); }}>
      <header className={variant === 'v2' ? 'grid gap-1.5 text-center' : 'grid gap-2'}><h1 className="text-2xl font-semibold tracking-tight">Create an account</h1><p className="text-sm leading-6 text-muted-foreground">Register your {brandName ?? 'Codexsun'} workspace identity.</p></header>
      {variant === 'v1' && <div className="border-t"/>}
      <FieldGroup>
        <AuthField label="Name" helper="Enter the name you want shown in your workspace." autoComplete="name" required pattern={String.raw`.*\S.*`} disabled={busy} value={name} onChange={e => setName(e.target.value)}/>
        <AuthField label="Email" helper="Use an email address you can access for verification and recovery." type="email" autoComplete="email" required disabled={busy} value={email} onChange={e => setEmail(e.target.value)}/>
        <AuthField label="Password" helper={`Use at least ${minLength} characters. Your app may require additional password rules.`} type="password" autoComplete="new-password" minLength={minLength} required disabled={busy} value={password} onChange={e => setPassword(e.target.value)}/>
        <AuthField label="Confirm password" helper="Enter the same password again." type="password" autoComplete="new-password" minLength={minLength} required disabled={busy} value={confirm} error={mismatch ? 'Passwords must match.' : undefined} onChange={e => setConfirm(e.target.value)}/>
        {variant === 'v2' && <div className="grid gap-4 sm:grid-cols-2">
          <AuthField label="Username (optional)" helper="Leave blank or use at least 3 non-space characters." autoComplete="username" minLength={3} pattern={String.raw`\S{3,}`} disabled={busy} value={username} onChange={e => setUsername(e.target.value)}/>
          <AuthField label="Mobile number (optional)" helper="Include your country code if your app requires it." type="tel" autoComplete="tel" disabled={busy} value={mobile} onChange={e => setMobile(e.target.value)}/>
        </div>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button disabled={busy || mismatch} className="w-full" type="submit">{busy ? 'Creating account…' : 'Create account'}</Button>
        <a className="text-center text-sm text-muted-foreground hover:text-foreground" href={loginHref}>Back to sign in</a>
      </FieldGroup>
    </form>
  </AuthPageLayout>;
}
