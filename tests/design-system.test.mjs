import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Badge, Card, DesignSystemProvider, ThemeSelector } from '../dist/src/index.js';
import { validatePreferences, defaultPreferences } from '../dist/src/design-system/preferences.js';

test('preferences reject malformed values and keep supported choices', () => {
  for (const value of [null, [], 'dark', { mode: 'invalid', card: 'unknown' }]) {
    assert.deepEqual(validatePreferences(value), defaultPreferences);
  }
  assert.deepEqual(validatePreferences({ mode: 'dark', accent: 'blue', card: 'soft' }), {
    ...defaultPreferences, mode: 'dark', accent: 'blue', palette: 'blue', card: 'soft',
  });
});

test('components have defaults and permit explicit variants without a provider', () => {
  assert.match(renderToStaticMarkup(React.createElement(Button, null, 'Save')), /data-variant="default"/);
  assert.match(renderToStaticMarkup(React.createElement(Button, { variant: 'outline' }, 'Save')), /data-variant="outline"/);
  assert.match(renderToStaticMarkup(React.createElement(Badge, { variant: 'secondary' }, 'Ready')), /data-variant="secondary"/);
  assert.match(renderToStaticMarkup(React.createElement(Card, { variant: 'soft' }, 'Content')), /data-variant="soft"/);
});

test('default provider and selector can render without browser storage', () => {
  const output = renderToStaticMarkup(React.createElement(DesignSystemProvider, null,
    React.createElement(ThemeSelector)));
  assert.match(output, /Default design system/);
  assert.match(output, /Appearance/);
  assert.match(output, /Reset defaults/);
});
