import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@workspace/ui';

const item = (value, disabled = false) => React.createElement(AccordionItem, { value, disabled, key: value },
  React.createElement(AccordionTrigger, null, `Question ${value}`),
  React.createElement(AccordionContent, null, `Answer ${value}`));

test('public accordion exports preserve single-mode accessible state and content', () => {
  const html = renderToStaticMarkup(React.createElement(Accordion, { type: 'single', collapsible: true, defaultValue: 'one' }, item('one'), item('two')));
  assert.match(html, /data-slot="accordion"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /role="region"/);
  assert.match(html, /aria-controls=/);
  assert.match(html, /aria-labelledby=/);
  assert.match(html, /Answer one/);
  assert.doesNotMatch(html, /Answer two/);
});

test('multiple-mode accordion preserves open items and disabled trigger semantics', () => {
  const html = renderToStaticMarkup(React.createElement(Accordion, { type: 'multiple', defaultValue: ['one', 'two'] }, item('one'), item('two'), item('three', true)));
  assert.equal((html.match(/aria-expanded="true"/g) || []).length, 2);
  assert.match(html, /Answer one/);
  assert.match(html, /Answer two/);
  assert.match(html, /disabled=""/);
  assert.match(html, /data-disabled=""/);
});
