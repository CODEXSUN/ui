import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Accordion, Button, Badge } from '@workspace/ui';
import { validatePreferences } from '../dist/src/design-system/preferences.js';

test('every built component is available through its public component entry', async () => {
  const files = (await readdir(new URL('../dist/src/components/', import.meta.url))).filter(file => file.endsWith('.js'));
  const sourceFiles = (await readdir(new URL('../src/components/', import.meta.url))).filter(file => /\.(ts|tsx)$/.test(file) && !file.endsWith('.d.ts'));
  assert.equal(files.length, sourceFiles.length);
  for (const file of files) {
    const module = await import(`@workspace/ui/components/${file.slice(0, -3)}`);
    assert.ok(Object.keys(module).length, `Missing public exports for ${file}`);
  }
});

test('component preview defaults validate persisted values', () => {
  const result = validatePreferences({ componentDefaults: { accordion: 'contained', button: 'success', invalid: 12, 'bad key': 'bad' } });
  assert.deepEqual(result.componentDefaults, { accordion: 'contained', button: 'success' });
  assert.deepEqual(validatePreferences({ componentDefaults: [] }).componentDefaults, {});
});

test('reference variants preserve explicit styling and render icons', () => {
  assert.match(renderToStaticMarkup(React.createElement(Accordion, { type: 'single', variant: 'contained' })), /data-variant="contained"/);
  assert.match(renderToStaticMarkup(React.createElement(Button, { variant: 'success', icon: React.createElement('span', null, 'Icon') }, 'Save')), /Icon/);
  assert.match(renderToStaticMarkup(React.createElement(Badge, { variant: 'studio-warning' }, 'Review')), /data-variant="studio-warning"/);
});
