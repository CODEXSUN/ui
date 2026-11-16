import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormLookup, FormSelect, FormDatePicker, FormAnimatedTabs } from '../dist/src/blocks/form-controls/index.js';

test('lookup exposes labelled required combobox', () => {
  const html = renderToStaticMarkup(React.createElement(FormLookup, { ariaLabel: 'Customer', required: true, value: 'atlas', options: [{ value: 'atlas', label: 'Atlas Trading' }], onValueChange() {} }));
  assert.match(html, /role="combobox"/);
  assert.match(html, /aria-label="Customer"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /required/);
});
test('date formats ISO selection and tabs expose active panel', () => {
  const date = renderToStaticMarkup(React.createElement(FormDatePicker, { ariaLabel: 'Due date', value: '2026-11-17', allowManualInput: true, onValueChange() {} }));
  assert.match(date, /17-11-2026/);
  const tabs = renderToStaticMarkup(React.createElement(FormAnimatedTabs, { value: 'comments', onValueChange() {}, tabs: [{ value: 'comments', label: 'Comments', count: 0, content: 'No comments yet' }] }));
  assert.match(tabs, /role="tab"/);
  assert.match(tabs, /aria-selected="true"/);
  assert.match(tabs, /No comments yet/);
  assert.equal(typeof FormSelect, 'function');
});
