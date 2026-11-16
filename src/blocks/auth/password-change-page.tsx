import { PasswordForm, type PasswordFormProps } from './password-form.js';
export interface PasswordChangePageProps extends PasswordFormProps { onSubmit(values: { currentPassword: string; newPassword: string }): void }
export function PasswordChangePage(props: PasswordChangePageProps) { return <PasswordForm {...props} change/>; }
