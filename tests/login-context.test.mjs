import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LoginPage } from '@workspace/ui/blocks/auth/login-page';
const common = { brandName:'Codexsun', workspace:true, title:'Welcome', description:'Access your workspace with your registered credentials.', registerHref:null, onSubmit() {} };
test('shared-host login keeps Corporate ID inside the credential form without role choices', () => {
  const html = renderToStaticMarkup(React.createElement(LoginPage, {...common, tenantContext:{mode:'shared',corporateId:'',onCorporateIdChange() {}}}));
  assert.match(html, /<form[^>]*>[\s\S]*name="corporateId"[\s\S]*Username or email[\s\S]*Password[\s\S]*<\/form>/);
  assert.match(html, /autoComplete="organization"/i);
  assert.match(html, /aria-label="Workspace"/);
  assert.doesNotMatch(html, /Software admin|Tenant admin|Super admin|Sign-in areas|Sign up/);
});
test('domain-bound login shows an escaped tenant name and no editable Corporate ID', () => {
  const html = renderToStaticMarkup(React.createElement(LoginPage, {...common, tenantContext:{mode:'domain',tenantName:'TECHMEDIA <test>'}}));
  assert.match(html, /TECHMEDIA &lt;test&gt;/);
  assert.doesNotMatch(html, /name="corporateId"|Corporate ID/);
});
test('unavailable context disables credentials and submit without pretending to sign in', () => {
  const html = renderToStaticMarkup(React.createElement(LoginPage, {...common, disabled:true, error:'Workspace unavailable.'}));
  assert.equal((html.match(/<input[^>]*disabled=""/g) ?? []).length, 2);
  assert.match(html, /<button[^>]*disabled=""/);
  assert.doesNotMatch(html, /Signing in/);
});

test('unavailable context also disables optional development and provider sign-in actions', () => {
  const html = renderToStaticMarkup(React.createElement(LoginPage, {
    ...common, variant:'v2', disabled:true, devLoginEnabled:true,
    onDevLogin() {}, onProviderLogin() {},
    tenantContext:{mode:'shared',corporateId:'',onCorporateIdChange() {}},
  }));
  const buttons = html.match(/<button\b[^>]*>/g) ?? [];
  assert.equal(buttons.length, 5);
  assert.ok(buttons.every(button => button.includes('disabled=""')));
  assert.equal((html.match(/<input[^>]*disabled=""/g) ?? []).length, 3);
});

test('existing templates retain role branding and visible helpers without workspace props', () => {
  const html = renderToStaticMarkup(React.createElement(LoginPage, {
    role:'admin', onSubmit() {},
  }));
  assert.match(html, /Admin access/);
  assert.match(html, /Enter the username or email linked to your account/);
  assert.match(html, /Sign up/);
  assert.doesNotMatch(html, /Corporate ID|aria-label="Workspace"/);
});
