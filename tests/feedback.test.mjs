import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { toast as sonnerToast } from '@workspace/ui/components/sonner';
import { notify, toast as legacyToast } from '@workspace/ui';
import { useToast } from '@workspace/ui/components/use-toast';

test('public Sonner feedback supports async/status methods without replacing legacy toast', () => {
  assert.equal(notify, sonnerToast);
  assert.notEqual(notify, legacyToast);
  for (const method of ['success', 'error', 'info', 'warning', 'promise', 'dismiss']) assert.equal(typeof sonnerToast[method], 'function');
});

test('dismissed legacy notifications leave memory after exit animations', async () => {
  let notifications;
  function Probe() { notifications = useToast().toasts; return null; }
  const message = legacyToast({ title: 'Sample feedback' });
  renderToStaticMarkup(React.createElement(Probe));
  assert.equal(notifications.some(item => item.id === message.id && item.open), true);
  message.dismiss();
  renderToStaticMarkup(React.createElement(Probe));
  assert.equal(notifications.find(item => item.id === message.id)?.open, false);
  await new Promise(resolve => setTimeout(resolve, 1100));
  renderToStaticMarkup(React.createElement(Probe));
  assert.equal(notifications.some(item => item.id === message.id), false);
});
