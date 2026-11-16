import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppearanceSettings, designPalettes } from '@workspace/ui';
import { validatePreferences } from '../dist/src/design-system/preferences.js';

test('all ten reference palettes are valid persisted preferences', () => {
  assert.equal(designPalettes.length, 10);
  for (const { id } of designPalettes) assert.equal(validatePreferences({ palette: id }).palette, id);
  assert.equal(validatePreferences({ palette: 'unknown' }).palette, 'default');
  assert.equal(validatePreferences({ accent: 'violet' }).palette, 'purple');
});

test('appearance controls render three modes and ten labelled palette choices', () => {
  const html = renderToStaticMarkup(React.createElement(AppearanceSettings));
  assert.equal((html.match(/aria-pressed=/g) ?? []).length, 13);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 2);
  assert.match(html, /System default/);
  assert.match(html, /Orange, Comfortable/);
  assert.match(html, /Graphite, Balanced/);
});
