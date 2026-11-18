import { Building2Icon, CrownIcon, ShieldCheckIcon, UserRoundIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card, CardContent } from '../../components/card.js'
import { cn } from '../../lib/utils.js'

export type AuthPageVariant = 'v1' | 'v2'

export type AuthRole = 'user' | 'admin' | 'super-admin';
export interface AuthBrandProps {
  brandName?: string | undefined;
  logoSrc?: string | undefined;
  logoDarkSrc?: string | undefined;
  logoAlt?: string | undefined;
  role?: AuthRole | undefined;
}
const roleBadges = {
  user: { label: 'User access', Icon: UserRoundIcon, tone: 'border-primary/30 bg-accent text-accent-foreground' },
  admin: { label: 'Admin access', Icon: ShieldCheckIcon, tone: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  'super-admin': { label: 'Super admin access', Icon: CrownIcon, tone: 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300' },
} as const;

export function AuthBrand({ name = 'Codexsun', logoSrc = '/logo/logo.svg', logoDarkSrc, logoAlt, role = 'user', workspace = false }: Omit<AuthBrandProps, 'brandName'> & { name?: string | undefined; workspace?: boolean | undefined }) {
  const badge = workspace ? { label: 'Workspace', Icon: Building2Icon, tone: 'border-primary/30 bg-card text-primary' } : roleBadges[role];
  return <div className="flex flex-col items-center gap-2" aria-label={name}>
    <span className={cn('relative grid place-items-center', workspace ? 'size-13' : 'size-12 rounded-xl border bg-background')}>
      <img src={logoSrc} alt={logoAlt ?? `${name} logo`} width={workspace ? 52 : 32} height={workspace ? 52 : 32} className={cn('object-contain dark:hidden', workspace ? 'size-13' : 'size-8')}/>
      <img src={logoDarkSrc ?? logoSrc} alt={logoAlt ?? `${name} logo`} width={workspace ? 52 : 32} height={workspace ? 52 : 32} className={cn('hidden object-contain dark:block', workspace ? 'size-13' : 'size-8')}/>
      <span role="img" aria-label={badge.label} title={badge.label} className={cn('absolute -right-2 -bottom-1 grid size-5 place-items-center rounded-full border', badge.tone)}>
        <badge.Icon aria-hidden="true" className="size-3"/>
      </span>
    </span>
    <span className="text-xl font-semibold tracking-tight">{name}</span>
  </div>;
}

export function AuthPageLayout({
  aside,
  brandName,
  logoSrc,
  logoDarkSrc,
  logoAlt,
  role,
  workspace,
  children,
  className,
  embedded = false,
  variant,
}: AuthBrandProps & {
  workspace?: boolean | undefined
  aside?: ReactNode | undefined
  brandName?: string | undefined
  children: ReactNode
  className?: string | undefined
  embedded?: boolean | undefined
  variant: AuthPageVariant
}) {
  const Surface = embedded ? 'section' : 'main';
  if (variant === 'v2') {
    return (
      <Surface
        className={cn(
          'flex items-center justify-center bg-muted/30 px-5 py-10',
          embedded ? 'min-h-[650px]' : 'min-h-screen',
          className,
        )}
      >
        <div className="grid w-full max-w-4xl gap-5">
          <AuthBrand name={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} logoAlt={logoAlt} role={role} workspace={workspace} />
          <Card className="overflow-hidden p-0 shadow-lg">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-7 md:p-9">{children}</div>
              <div className="relative hidden min-h-[520px] overflow-hidden border-l bg-foreground text-background md:flex">
                {aside}
              </div>
            </CardContent>
          </Card>
        </div>
      </Surface>
    )
  }

  return (
    <Surface
      className={cn(
        'flex items-center justify-center bg-muted/30 px-5 py-10',
        embedded ? 'min-h-[650px]' : 'min-h-screen',
        className,
      )}
    >
      <div className="grid w-full max-w-[520px] gap-5">
        <AuthBrand name={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} logoAlt={logoAlt} role={role} workspace={workspace} />
        <Card className={cn('border p-1 shadow-xl shadow-foreground/10 ring-1 ring-border', workspace ? 'border-primary/25' : 'border-orange-200/70')}>
          <CardContent className="rounded-lg border bg-card p-5 sm:p-9">{children}</CardContent>
        </Card>
      </div>
    </Surface>
  )
}

export function AuthVisualPanel({ description, title }: { description: string; title: string }) {
  return (
    <div className="relative flex min-h-full w-full flex-col justify-end overflow-hidden p-9">
      <div className="absolute -top-20 -right-20 size-72 rounded-full border border-background/20" />
      <div className="absolute top-20 right-16 size-40 rounded-full border border-background/15" />
      <div className="relative grid gap-2">
        <p className="text-2xl font-semibold tracking-tight">{title}</p>
        <p className="max-w-sm text-sm leading-6 text-background/70">{description}</p>
      </div>
    </div>
  )
}
