import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UpsertForm, UpsertFormHeader, UpsertFormField, UpsertFormValidationSummary } from '../dist/src/blocks/upsert-form.js';
import { Input } from '../dist/src/components/input.js';

test('header Save submits the named form and saving disables fields and action', () => {
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(UpsertFormHeader, { formId: 'record-form', breadcrumbs: [{ label: 'Edit record' }], saving: true }),
    React.createElement(UpsertForm, { id: 'record-form', saving: true, error: 'Save failed', onSubmit() {}, aside: 'Related' }, React.createElement('input', { name: 'name', required: true })),
  ));
  assert.match(html, /form="record-form"/);
  assert.match(html, /id="record-form"/);
  assert.match(html, /fieldset disabled=""/);
  assert.match(html, /Saving…/);
  assert.match(html, /role="alert"/);
  assert.match(html, /aria-label="Related information"/);
});

test('shared field connects label/helper/error and summary names invalid fields', () => {
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(UpsertFormValidationSummary, { errors: { name: 'Enter a name.' }, idPrefix: 'record' }),
    React.createElement(UpsertFormField, { name: 'name', label: 'Name', helper: 'Record name', error: 'Enter a name.', required: true, idPrefix: 'record' }, React.createElement(Input, { name: 'name' })),
  ));
  assert.match(html, /for="record-name-input"/);
  assert.match(html, /aria-describedby="record-name-helper record-name-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /data-invalid="true"/);
  assert.match(html, /Check 1 fields before saving/);
});
