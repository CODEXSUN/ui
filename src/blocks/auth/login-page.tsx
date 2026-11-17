import { AppleIcon, Globe2Icon, LogInIcon, OrbitIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../components/button.js'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from '../../components/Field.js'
import { AuthField } from './auth-field.js'
import { AuthPageLayout, AuthVisualPanel, type AuthPageVariant, type AuthBrandProps } from './auth-page-layout.js'

export type LoginPageProps = AuthBrandProps & {
  workspace?: boolean | undefined
  /** Host context is supplied by the app; this component grants no tenant access. */
  tenantContext?: { mode: 'shared'; corporateId: string; onCorporateIdChange(value: string): void } | { mode: 'domain'; tenantName: string } | undefined
  disabled?: boolean | undefined
  brandName?: string | undefined
  minLength?: number | undefined
  busy?: boolean | undefined
  description?: string | undefined
  devLoginEnabled?: boolean | undefined
  embedded?: boolean | undefined
  error?: string | undefined
  forgotHref?: string | undefined
  onSubmit(identifier: string, password: string): void
  onProviderLogin?: ((provider: 'apple' | 'google' | 'other') => void) | undefined
  onDevLogin?: (() => void) | undefined
  registerHref?: string | null | undefined
  title?: string | undefined
  variant?: AuthPageVariant | undefined
}

export function LoginPage({
  brandName,
  logoSrc, logoDarkSrc, logoAlt, role,
  workspace,
  tenantContext,
  disabled = false,
  busy = false,
  minLength = 8,
  description,
  devLoginEnabled = false,
  embedded = false,
  error,
  forgotHref = '/password/forgot',
  onSubmit,
  onDevLogin,
  onProviderLogin,
  registerHref = '/register',
  title,
  variant = 'v1',
}: LoginPageProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!busy && !disabled) onSubmit(identifier.trim(), password)
  }

  return (
    <AuthPageLayout
      aside={
        <AuthVisualPanel
          description="Keep projects, people, and trusted application access in one connected workspace."
          title="One workspace. Every application."
        />
      }
      brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} logoAlt={logoAlt} role={role} workspace={workspace}
      embedded={embedded}
      variant={variant}
    >
      <form aria-busy={busy} className="grid gap-6" onSubmit={submit}>
        <header className={variant === 'v2' ? 'grid gap-1.5 text-center' : 'grid gap-2'}>
          <h1 className="text-2xl font-semibold tracking-tight">
            {title ?? (variant === 'v2' ? 'Welcome back' : 'Welcome')}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {description ??
              (variant === 'v2'
                ? `Sign in to continue to your ${brandName ?? 'Codexsun'} workspace.`
                : 'Use your admin username or email and password for this desk.')}
          </p>
        </header>
        {variant === 'v1' ? <div className="border-t" /> : null}
        <FieldGroup className={workspace ? 'gap-4' : undefined}>
          {tenantContext?.mode === 'shared' && <AuthField label="Corporate ID" helper="Enter your organization's Corporate ID." helperHidden={workspace} compact={workspace} className={workspace ? 'bg-card dark:bg-card' : undefined} style={workspace ? {backgroundColor:'var(--card)'} : undefined} name="corporateId" disabled={busy || disabled} autoComplete="organization" required minLength={3} maxLength={63} pattern="[A-Za-z][A-Za-z0-9_-]{2,62}" value={tenantContext.corporateId} onChange={event => tenantContext.onCorporateIdChange(event.target.value)}/>}
          {tenantContext?.mode === 'domain' && <p aria-label="Workspace" className="text-sm font-medium">{tenantContext.tenantName}</p>}
          <AuthField label="Username or email" helper="Enter the username or email linked to your account." helperHidden={workspace} compact={workspace} className={workspace ? 'bg-card dark:bg-card' : undefined} style={workspace ? {backgroundColor:'var(--card)'} : undefined} disabled={busy || disabled} autoComplete="username" required pattern={String.raw`.*\S.*`} value={identifier} onChange={event => setIdentifier(event.target.value)}/>
          {devLoginEnabled && onDevLogin ? (
            <Button
              className="w-full"
              disabled={busy || disabled}
              onClick={onDevLogin}
              type="button"
              variant="outline"
            >
              Development sign in
            </Button>
          ) : null}
          <AuthField label="Password" helper={`Enter your account password (at least ${minLength} characters).`} helperHidden={workspace} compact={workspace} className={workspace ? 'bg-card dark:bg-card' : undefined} style={workspace ? {backgroundColor:'var(--card)'} : undefined} disabled={busy || disabled} autoComplete="current-password" type="password" required minLength={minLength} value={password} onChange={event => setPassword(event.target.value)}/>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {(
            <a className={`${workspace ? 'my-2 ' : ''}text-center text-sm font-medium hover:underline`} href={forgotHref}>
              Forgot password?
            </a>
          )}
          <Field>
            <Button
              className={workspace ? 'h-11 w-full' : 'w-full'}
              disabled={busy || disabled}
              type="submit"
              variant="default"
            >
              {variant === 'v1' ? <LogInIcon /> : null}
              {busy ? 'Signing in…' : variant === 'v2' ? 'Login' : 'Sign in'}
            </Button>
          </Field>
          {variant === 'v2' ? <ProviderActions onSelect={onProviderLogin} busy={busy || disabled}/> : null}
          {registerHref ? (
            <FieldDescription className="text-center">
              Don&apos;t have an account? <a href={registerHref}>Sign up</a>
            </FieldDescription>
          ) : null}
        </FieldGroup>
      </form>
    </AuthPageLayout>
  )
}

function ProviderActions({ onSelect, busy }: { onSelect?: ((provider: 'apple' | 'google' | 'other') => void) | undefined; busy: boolean }) {
  return (
    <>
      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
        Or continue with
      </FieldSeparator>
      <Field className="grid grid-cols-3 gap-3">
        <Button disabled={busy || !onSelect} onClick={() => onSelect?.('apple')} aria-label="Login with Apple" size="icon" type="button" variant="outline">
          <AppleIcon />
        </Button>
        <Button disabled={busy || !onSelect} onClick={() => onSelect?.('google')} aria-label="Login with Google" size="icon" type="button" variant="outline">
          <Globe2Icon />
        </Button>
        <Button
          disabled={busy || !onSelect} onClick={() => onSelect?.('other')} aria-label="Login with another provider"
          size="icon"
          type="button"
          variant="outline"
        >
          <OrbitIcon />
        </Button>
      </Field>
    </>
  )
}
