import { PasswordForm, type PasswordFormProps } from './password-form.js';
export interface PasswordResetPageProps extends PasswordFormProps { onSubmit(newPassword: string): void }
/** The app owns reset-token validation and expiration. Never render the token here. */
export function PasswordResetPage({ onSubmit, ...props }: PasswordResetPageProps) {
  return <PasswordForm {...props} onSubmit={({ newPassword }) => onSubmit(newPassword)}/>;
}
