import test from 'node:test';
import assert from 'node:assert/strict';
import * as barrel from '@workspace/ui/blocks/form-controls';

test('each named form control resolves through its public path', async () => {
  for (const [path, name] of [['lookup', 'FormLookup'], ['select', 'FormSelect'], ['date-picker', 'FormDatePicker'], ['animated-tabs', 'FormAnimatedTabs']]) {
    const entry = await import(`@workspace/ui/blocks/form-controls/${path}`);
    assert.equal(typeof entry[name], 'function');
    assert.equal(entry[name], barrel[name]);
  }
});
