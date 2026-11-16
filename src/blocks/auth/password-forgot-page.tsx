import { useState, type FormEvent } from 'react'
import { Button } from '../../components/button.js'
import { AuthField } from './auth-field.js'
import { FieldGroup } from '../../components/Field.js'
import { AuthPageLayout, type AuthBrandProps } from './auth-page-layout.js'

export interface PasswordForgotPageProps extends AuthBrandProps {
  backHref: string
  brandName?: string | undefined
  busy?: boolean | undefined
  error?: string | undefined
  embedded?: boolean | undefined
  onSubmit(identifier: string): void
}

export function PasswordForgotPage({
  backHref,
  brandName,
  logoSrc, logoDarkSrc, logoAlt, role,
  busy = false,
  error,
  embedded = false,
  onSubmit,
}: PasswordForgotPageProps) {
  const [identifier, setIdentifier] = useState('')
  return (
    <AuthPageLayout brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} logoAlt={logoAlt} role={role} embedded={embedded} variant="v1">
      <form
        aria-busy={busy}
        className="grid gap-6"
        onSubmit={(event: FormEvent) => {
          event.preventDefault()
          if (!busy) onSubmit(identifier.trim())
        }}
      >
        <header className="grid gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Enter your username or email. The response does not reveal whether an account exists.
          </p>
        </header>
        <div className="border-t" />
        <FieldGroup>
          <AuthField label="Username or email" helper="Enter your account identifier. Recovery responses do not confirm whether an account exists." autoComplete="username" required pattern={String.raw`.*\S.*`} disabled={busy} value={identifier} onChange={event => setIdentifier(event.target.value)}/>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button disabled={busy} className="w-full" type="submit">
            {busy ? 'Requesting…' : 'Request reset'}
          </Button>
          <a
            className="text-center text-sm text-muted-foreground hover:text-foreground"
            href={backHref}
          >
            Back to sign in
          </a>
        </FieldGroup>
      </form>
    </AuthPageLayout>
  )
}
