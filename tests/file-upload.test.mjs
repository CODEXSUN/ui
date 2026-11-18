import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FileUpload, FILE_UPLOAD_DEFAULTS, validateUploadFile } from '@workspace/ui/blocks/file-upload';

test('upload validation covers empty, size boundaries, MIME, extension and wildcard rules', () => {
  const png = { name: 'sample.png', size: FILE_UPLOAD_DEFAULTS.maxSizeBytes, type: 'image/png' };
  assert.equal(validateUploadFile(png), undefined);
  assert.match(validateUploadFile({ ...png, size: png.size + 1 }), /Maximum file size/);
  assert.match(validateUploadFile({ ...png, size: 0 }), /empty/);
  assert.match(validateUploadFile({ ...png, name: 'sample.html', type: 'text/html' }), /not allowed/);
  assert.match(validateUploadFile({ ...png, name: 'sample.svg', type: 'image/svg+xml' }), /not allowed/);
  assert.equal(validateUploadFile({ ...png, name: 'REPORT.PDF', type: '' }, { accept: '.pdf' }), undefined);
  assert.equal(validateUploadFile({ ...png, type: 'image/webp' }, { accept: 'image/*' }), undefined);
  assert.equal(validateUploadFile({ ...png, type: '' }, { accept: '' }), undefined);
});
test('upload exposes keyboard file selection, clear limits and no fake completion', () => {
  let attempts = 0;
  const html = renderToStaticMarkup(React.createElement(FileUpload, { onUpload: async () => { attempts++; return { id: 'saved' }; } }));
  assert.match(html, /Choose files/); assert.match(html, /5.0 MB/); assert.match(html, /Maximum 5 files/);
  assert.match(html, /type="file"/); assert.match(html, /multiple=""/);
  assert.match(html, /0 selected/); assert.equal(attempts, 0);
  const single = renderToStaticMarkup(React.createElement(FileUpload, { multiple: false, disabled: true, onUpload: async () => ({ id: 'saved' }) }));
  assert.doesNotMatch(single, /multiple=""/); assert.match(single, /Maximum 1 file/);
  assert.match(single, /disabled=""/);
});
