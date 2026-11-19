import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
function installed(name, from = require) {
  let directory = dirname(from.resolve(name));
  for (;;) {
    try {
      const file = join(directory, 'package.json');
      const pkg = JSON.parse(readFileSync(file, 'utf8'));
      if (pkg.name === name) return { ...pkg, require: createRequire(file) };
    } catch {}
    const parent = dirname(directory);
    assert.notEqual(parent, directory, `Cannot locate ${name}`);
    directory = parent;
  }
}
function atLeast(actual, minimum) {
  const a = actual.split('.').map(Number), b = minimum.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return true;
}

test('actual producer drawing imports resolve patched versions without replacing editor or converter', () => {
  const editor = installed('@excalidraw/excalidraw');
  const converter = installed('@excalidraw/mermaid-to-excalidraw', editor.require);
  assert.equal(editor.version, '0.18.1');
  assert.equal(converter.version, '2.2.2');
  assert.ok(atLeast(installed('nanoid', editor.require).version, '3.3.18'));
  assert.ok(atLeast(installed('nanoid', converter.require).version, '5.1.16'));
  const mermaid = installed('mermaid', converter.require);
  assert.equal(mermaid.version, '11.17.2');
  assert.ok(atLeast(installed('katex', mermaid.require).version, '0.18.2'));
  for (const entry of Object.values(JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url))).packages)) {
    if (/\/lodash-es-/.test(entry.resolved ?? '')) assert.ok(atLeast(entry.version, '4.18.1'));
  }
});
