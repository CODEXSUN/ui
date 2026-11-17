import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecordDetailV1 } from '@workspace/ui/blocks/record-detail-v1';
import { useUnsavedChangesGuard } from '@workspace/ui/blocks/unsaved-changes-guard';

const props = { title: 'Customer details', sections: [{ id: 'details', title: 'Details', fields: [
  { id: 'count', label: 'Count', value: 0 }, { id: 'missing', label: 'Phone', value: null },
  { id: 'escaped', label: 'Description', value: '<script>not markup</script>' },
] }] };
test('record detail preserves labelled data, numeric zero, missing values and escaped text', () => {
  const html = renderToStaticMarkup(React.createElement(RecordDetailV1, { ...props, aside: 'Related content', activity: 'Sample activity' }));
  assert.match(html, /<dt[^>]*>Count<\/dt><dd[^>]*>0<\/dd>/);
  assert.match(html, /<dt[^>]*>Phone<\/dt><dd[^>]*>—<\/dd>/);
  assert.ok(html.includes('&lt;script&gt;not markup&lt;/script&gt;'));
  assert.match(html, /aria-label="Related information"/); assert.match(html, />Activity<\/h3>/);
});
test('record loading and failure hide stale fields and mutation actions', () => {
  for (const state of [{ loading: true }, { error: 'Unavailable' }, { empty: true }]) {
    const html = renderToStaticMarkup(React.createElement(RecordDetailV1, { ...props, ...state, actions: React.createElement('button', {}, 'Edit secret') }));
    assert.doesNotMatch(html, /Edit secret|not markup/);
    assert.match(html, /Loading…|Unavailable|Record not found/);
  }
});
test('clean guard executes app navigation immediately, busy guard blocks it', () => {
  let clean; let busy;
  function Probe() { clean = useUnsavedChangesGuard({ dirty: false }); busy = useUnsavedChangesGuard({ dirty: false, busy: true }); return null; }
  renderToStaticMarkup(React.createElement(Probe));
  let calls = 0;
  assert.equal(clean.requestNavigation(() => calls++), true);
  assert.equal(busy.requestNavigation(() => calls++), false);
  assert.equal(calls, 1);
});
