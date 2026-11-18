import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppearanceSettings, designPalettes } from '@workspace/ui';
import { validatePreferences } from '../dist/src/design-system/preferences.js';
import { createThemeInitScript } from '../dist/src/design-system/bootstrap.js';
import { runInNewContext } from 'node:vm';

test('Silver default and saved selections agree before and after mount, including unavailable storage', () => {
  for (const stored of [null, {}, { palette: 'unknown' }, { palette: 'blue', mode: 'dark' }, { palette: 'workspace' }, { accent: 'violet' }, 'unavailable']) {
    const root = { dataset: {}, style: {}, classList: { toggle() {} } };
    runInNewContext(createThemeInitScript('test.ui.preferences'), {
      document: { documentElement: root },
      localStorage: { getItem() { if (stored === 'unavailable') throw Error('blocked'); return JSON.stringify(stored); } },
      matchMedia: () => ({ matches: false }),
    });
    assert.equal(root.dataset.designVariant, validatePreferences(stored).palette);
    assert.equal(root.dataset.theme, stored?.mode === 'dark' ? 'dark' : 'light');
  }
  assert.equal(validatePreferences(null).palette, 'silver');
});

test('all eleven reference palettes are valid persisted preferences', () => {
  assert.equal(designPalettes.length, 11);
  for (const { id } of designPalettes) assert.equal(validatePreferences({ palette: id }).palette, id);
  assert.equal(validatePreferences({ palette: 'unknown' }).palette, 'silver');
  for (const palette of ['calm', 'workspace']) assert.equal(validatePreferences({ palette }).palette, 'silver');
  assert.equal(validatePreferences({ accent: 'violet' }).palette, 'purple');
});

test('app rollout migrates only the palette once and preserves later user choices', () => {
  const storage = new Map([['app.preferences', JSON.stringify({ palette: 'green', mode: 'dark', componentDefaults: { button: 'outline' } })]]);
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const root = { dataset: {}, style: {}, classList: { toggle() {} } };
  const run = () => runInNewContext(createThemeInitScript('app.preferences', { migrateToSilver: true }), {
    localStorage, document: { documentElement: root }, matchMedia: () => ({ matches: false }),
  });
  run();
  const migrated = JSON.parse(storage.get('app.preferences'));
  assert.equal(migrated.palette, 'silver');
  assert.equal(migrated.mode, 'dark');
  assert.deepEqual(migrated.componentDefaults, { button: 'outline' });
  assert.equal(migrated.paletteMigration, 'silver-v1');
  storage.set('app.preferences', JSON.stringify({ ...migrated, palette: 'blue' }));
  run();
  assert.equal(root.dataset.designVariant, 'blue');
  assert.equal(JSON.parse(storage.get('app.preferences')).palette, 'blue');
});

test('appearance controls render three modes and eleven labelled palette choices', () => {
  const html = renderToStaticMarkup(React.createElement(AppearanceSettings));
  assert.equal((html.match(/aria-pressed=/g) ?? []).length, 14);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 2);
  assert.match(html, /System default/);
  assert.match(html, /Orange, Comfortable/);
  assert.match(html, /Graphite, Balanced/);
  assert.match(html, /Silver, Comfortable/);
});
