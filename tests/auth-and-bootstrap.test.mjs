import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LoginPage } from '@workspace/ui/blocks/auth/login-page';
import { RegisterPage } from '@workspace/ui/blocks/auth/register-page';
import { PasswordForgotPage } from '@workspace/ui/blocks/auth/password-forgot-page';
import { createThemeInitScript } from '@workspace/ui/design-system/bootstrap';
import { Progress } from '@workspace/ui/components/progress';

test('reference auth pages retain labels, validation and no silent provider actions', () => {
  const login = renderToStaticMarkup(React.createElement(LoginPage, { onSubmit() {}, embedded: true, variant: 'v2' }));
  assert.match(login, /Username or email/); assert.match(login, /minLength="8"/i);
  assert.match(login, /disabled=""[^>]*aria-label="Login with Apple"|aria-label="Login with Apple"[^>]*disabled=""/);
  const register = renderToStaticMarkup(React.createElement(RegisterPage, { onSubmit() {}, brandName: 'Codebiz', busy: true }));
  assert.match(register, /type="email"/); assert.match(register, /Creating account/);
  const forgot = renderToStaticMarkup(React.createElement(PasswordForgotPage, { onSubmit() {}, backHref: '/login' }));
  assert.match(forgot, /does not reveal whether an account exists/);
});
test('theme bootstrap applies stored theme before app mount and escapes script keys', () => {
  const key = 'prefs</script>';
  let requestedKey;
  const root = { dataset: {}, style: {}, classList: { toggle(_name, value) { root.dark = value; } } };
  const script = createThemeInitScript(key);
  assert.ok(!script.includes('</script>'));
  runInNewContext(script, { localStorage: { getItem(value) { requestedKey = value; return JSON.stringify({ mode: 'dark', palette: 'blue', accent: 'blue' }); } }, document: { documentElement: root }, matchMedia() { return { matches: false }; } });
  assert.equal(requestedKey, key); assert.equal(root.dark, true); assert.equal(root.dataset.designVariant, 'blue');
});
test('progress forwards value/max and derives the visual range correctly', () => {
  const html = renderToStaticMarkup(React.createElement(Progress, { value: 1, max: 4, 'aria-label': 'Checks' }));
  assert.match(html, /aria-valuenow="1"/); assert.match(html, /aria-valuemax="4"/); assert.match(html, /translateX\(-75%\)/);
});


test('password lifecycle templates expose recovery, reauthentication and verification contracts', async () => {
  const { PasswordResetPage } = await import('@workspace/ui/blocks/auth/password-reset-page');
  const { PasswordChangePage } = await import('@workspace/ui/blocks/auth/password-change-page');
  const { EmailVerificationPage } = await import('@workspace/ui/blocks/auth/email-verification-page');
  const reset = renderToStaticMarkup(React.createElement(PasswordResetPage, { onSubmit() {}, backHref: '/login', minLength: 12 }));
  assert.match(reset, /Confirm new password/); assert.match(reset, /minLength="12"/i);
  assert.doesNotMatch(reset, /Current password/);
  const change = renderToStaticMarkup(React.createElement(PasswordChangePage, { onSubmit() {}, backHref: '/settings', busy: true, error: 'Try again' }));
  assert.match(change, /Current password/); assert.match(change, /autoComplete="current-password"/i);
  assert.match(change, /Saving…/); assert.match(change, /role="alert"/);
  const email = renderToStaticMarkup(React.createElement(EmailVerificationPage, { onSubmit() {}, backHref: '/login' }));
  assert.match(email, /autoComplete="one-time-code"/i);
  assert.match(email, /disabled=""[^>]*>Resend code/);
});


test('all auth templates link helpers and labels to unique fields with shared constraints', async () => {
  const { PasswordResetPage } = await import('@workspace/ui/blocks/auth/password-reset-page');
  const { PasswordChangePage } = await import('@workspace/ui/blocks/auth/password-change-page');
  const { EmailVerificationPage } = await import('@workspace/ui/blocks/auth/email-verification-page');
  for (const [Component, props] of [
    [LoginPage, { variant: 'v1' }], [LoginPage, { variant: 'v2' }],
    [RegisterPage, { variant: 'v1', minLength: 12 }], [RegisterPage, { variant: 'v2' }],
    [PasswordForgotPage, {}], [PasswordResetPage, {}], [PasswordChangePage, {}], [EmailVerificationPage, {}],
  ]) {
    const html = renderToStaticMarkup(React.createElement(Component, { ...props, embedded: true, backHref: '/login', onSubmit() {} }));
    assert.doesNotMatch(html, /<main/);
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const input of html.matchAll(/<input[^>]+>/g)) {
      const id = input[0].match(/ id="([^"]+)"/)[1];
      assert.ok(html.includes(`for="${id}"`));
      const description = input[0].match(/aria-describedby="([^"]+)"/)[1];
      assert.ok(ids.includes(description), description);
    }
    if (Component === RegisterPage) assert.match(html, /Confirm password/);
  }
  const pair = renderToStaticMarkup(React.createElement('div', {}, React.createElement(LoginPage, { onSubmit() {} }), React.createElement(LoginPage, { onSubmit() {} })));
  const ids = [...pair.matchAll(/ id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'same page can mount twice without duplicate field IDs');
});


test('auth pages forward app logos and distinct accessible role badges', async () => {
  const { PasswordResetPage } = await import('@workspace/ui/blocks/auth/password-reset-page');
  const { PasswordChangePage } = await import('@workspace/ui/blocks/auth/password-change-page');
  const { EmailVerificationPage } = await import('@workspace/ui/blocks/auth/email-verification-page');
  for (const Component of [LoginPage, RegisterPage, PasswordForgotPage, PasswordResetPage, PasswordChangePage, EmailVerificationPage]) {
    for (const [role, label] of [['user', 'User access'], ['admin', 'Admin access'], ['super-admin', 'Super admin access']]) {
      const html = renderToStaticMarkup(React.createElement(Component, { onSubmit() {}, backHref: '/login', brandName: 'Sample', logoSrc: '/sample.svg', logoDarkSrc: '/sample-dark.svg', logoAlt: 'App mark', role }));
      assert.match(html, /src="\/sample.svg"/); assert.match(html, /src="\/sample-dark.svg"/);
      assert.match(html, /alt="App mark"/); assert.ok(html.includes(`aria-label="${label}"`));
    }
  }
});
