import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLTextAreaElement', 'Node', 'NodeFilter', 'Element', 'DocumentFragment', 'MutationObserver', 'CustomEvent', 'Event', 'KeyboardEvent', 'MouseEvent', 'getComputedStyle'])
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : dom.window[name] });
globalThis.requestAnimationFrame = callback => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import('react');
const { act } = React;
const { createRoot } = await import('react-dom/client');
const { CommentsThread } = await import('../dist/src/blocks/comments-thread.js');
const sample = { id: 'note0001', author: 'Maya', text: '<script>alert(1)</script>\nSecond line', createdAt: '2026-11-18T09:30:00.000Z', revision: 1, canEdit: true, canDelete: true };
const el = (props) => React.createElement(CommentsThread, props);
async function mounted(props, work) {
  const container = document.createElement('div'); document.body.append(container); const root = createRoot(container);
  const render = async next => { await act(async () => root.render(el(next))); };
  await render(props);
  try { await work(container, render); } finally { await act(async () => root.unmount()); container.remove(); }
}
const button = (container, text) => [...container.querySelectorAll('button')].find(node => node.textContent === text);
async function click(node) { assert.ok(node); await act(async () => node.click()); }
async function input(node, value) {
  await act(async () => { Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(node, value); node.dispatchEvent(new Event('input', { bubbles: true })); });
}
async function submit(form) { await act(async () => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))); }

test('plain text, dates and permission hints render without executable markup', async () => {
  await mounted({ items: [sample], canCreate: false }, async container => {
    assert.equal(container.querySelector('script'), null);
    assert.ok(container.textContent.includes('<script>alert(1)</script>'));
    assert.equal(container.querySelector('time').dateTime, sample.createdAt);
    assert.equal(container.querySelector('textarea'), null);
    assert.equal(button(container, 'Edit'), undefined); // no callback: no misleading action
    assert.equal(button(container, 'Delete'), undefined);
  });
});

test('create validation, duplicate prevention, failure draft retention and safe error text', async () => {
  let calls = 0, resolve, reject;
  const onCreate = () => { calls++; return new Promise((yes, no) => { resolve = yes; reject = no; }); };
  await mounted({ items: [], canCreate: true, onCreate }, async container => {
    const textarea = container.querySelector('textarea');
    assert.equal(container.querySelector('label').htmlFor, textarea.id);
    await submit(textarea.form); assert.equal(calls, 0); assert.match(container.textContent, /Enter a comment/);
    assert.equal(textarea.getAttribute('aria-invalid'), 'true');
    await input(textarea, 'Draft to retain'); assert.equal(textarea.getAttribute('aria-invalid'), 'false'); await submit(textarea.form); await submit(textarea.form);
    assert.equal(calls, 1); assert.equal(button(container, 'Saving…').disabled, true);
    await act(async () => reject(Error('raw private database token')));
    assert.equal(textarea.value, 'Draft to retain'); assert.equal(container.textContent.includes('raw private'), false);
    await submit(textarea.form); assert.equal(calls, 2);
    await act(async () => resolve()); assert.equal(textarea.value, '');
  });
});

test('edit preserves original revision and draft across refreshed items; Escape cancels', async () => {
  let edited;
  const props = { items: [sample], onEdit: async (comment, text) => { edited = { comment, text }; } };
  await mounted(props, async (container, render) => {
    await click(button(container, 'Edit')); const textarea = container.querySelector('textarea');
    assert.equal(document.activeElement, textarea);
    await input(textarea, 'My retained edit');
    await render({ ...props, items: [{ ...sample, revision: 2, text: 'Someone else edited' }] });
    assert.equal(textarea.value, 'My retained edit');
    await submit(textarea.form); assert.equal(edited.comment.revision, 1); assert.equal(edited.text, 'My retained edit');
    await click(button(container, 'Edit'));
    await act(async () => container.querySelector('textarea').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    assert.equal(container.querySelector('textarea'), null);
  });
});

test('delete needs accessible confirmation; cancellation has no effects', async () => {
  let deleted = 0;
  await mounted({ items: [sample], onDelete: async () => { deleted++; } }, async container => {
    await click(button(container, 'Delete'));
    let dialog = document.querySelector('[role="alertdialog"]'); assert.ok(dialog); assert.equal(deleted, 0);
    await click(button(dialog, 'Cancel')); assert.equal(deleted, 0);
    await click(button(container, 'Delete')); dialog = document.querySelector('[role="alertdialog"]');
    await click(button(dialog, 'Delete comment')); assert.equal(deleted, 1);
  });
});

test('loading, error, unavailable and pagination states keep callbacks explicit', async () => {
  let refresh = 0, more = 0;
  const props = { items: [sample], onRefresh: () => refresh++, onLoadMore: () => more++, hasMore: true };
  await mounted({ ...props, loading: true }, async (container, render) => {
    assert.match(container.textContent, /Loading comments/); assert.equal(container.querySelector('ol'), null);
    await render({ ...props, error: 'Could not load comments.' }); await click(button(container, 'Retry')); assert.equal(refresh, 1);
    await render({ ...props, unavailable: 'Comments disabled.' }); assert.equal(container.querySelector('ol'), null);
    await render(props); await click(button(container, 'Load more comments')); assert.equal(more, 1);
    await render({ ...props, loadingMore: true }); assert.equal(button(container, 'Loading more…').disabled, true);
  });
});

test('resource identity switch clears private drafts and ignores late mutation completion', async () => {
  let resolve, calls = 0;
  const props = { resourceKey: 'scope-a:record-a', items: [], canCreate: true, onCreate: () => { calls++; return new Promise(yes => { resolve = yes; }); } };
  await mounted(props, async (container, render) => {
    await input(container.querySelector('textarea'), 'Private old draft'); await submit(container.querySelector('form'));
    await render({ ...props, resourceKey: 'scope-b:record-b', items: [{ ...sample, id: 'other', text: 'New scope' }] });
    assert.equal(container.querySelector('textarea').value, ''); assert.doesNotMatch(container.textContent, /Private old draft/);
    await input(container.querySelector('textarea'), 'New scope draft'); await act(async () => resolve());
    assert.equal(calls, 1); assert.equal(container.querySelector('textarea').value, 'New scope draft');
    assert.doesNotMatch(container.textContent, /Comments updated/); assert.match(container.textContent, /New scope/);
  });
});

test('current edit permission is rechecked even for programmatic submit of an existing draft', async () => {
  let calls = 0;
  const props = { items: [sample], onEdit: async () => { calls++; } };
  await mounted(props, async (container, render) => {
    await click(button(container, 'Edit')); await input(container.querySelector('textarea'), 'Keep my draft');
    await render({ ...props, items: [{ ...sample, revision: 2, canEdit: false }] });
    assert.equal(button(container, 'Save comment').disabled, true); await submit(container.querySelector('form'));
    assert.equal(calls, 0); assert.equal(container.querySelector('textarea').value, 'Keep my draft');
    assert.match(container.textContent, /Editing this comment is unavailable/);
  });
});

test('delete confirmation captures the displayed revision and revoked permission closes it', async () => {
  let deleted;
  const props = { items: [sample], onDelete: async snapshot => { deleted = snapshot; } };
  await mounted(props, async (container, render) => {
    await click(button(container, 'Delete'));
    await render({ ...props, items: [{ ...sample, revision: 2, text: 'Refreshed text' }] });
    await click(button(document.querySelector('[role="alertdialog"]'), 'Delete comment'));
    assert.equal(deleted.revision, 1); assert.equal(deleted.text, sample.text);
    deleted = undefined; await click(button(container, 'Delete'));
    await render({ ...props, items: [{ ...sample, canDelete: false }] });
    assert.equal(document.querySelector('[role="alertdialog"]'), null); assert.equal(deleted, undefined);
  });
});

test('edit cancellation and explicit draft clearing reset validation state', async () => {
  const props = { items: [sample], canCreate: true, onCreate: async () => {}, onEdit: async () => {}, onRefresh: () => {} };
  await mounted(props, async container => {
    await click(button(container, 'Edit')); const edit = container.querySelector('textarea'); await input(edit, ''); await submit(edit.form);
    assert.equal(edit.getAttribute('aria-invalid'), 'true'); await click(button(container, 'Cancel editing')); await click(button(container, 'Edit'));
    assert.equal(container.querySelector('textarea').getAttribute('aria-invalid'), 'false'); await click(button(container, 'Cancel editing'));
    const composer = container.querySelector('textarea'); await input(composer, 'Clear this draft'); await click(button(container, 'Clear draft'));
    assert.equal(composer.value, ''); assert.equal(composer.getAttribute('aria-invalid'), 'false');
    await submit(composer.form); assert.equal(composer.getAttribute('aria-invalid'), 'true'); await click(button(container, 'Refresh comments')); assert.equal(composer.getAttribute('aria-invalid'), 'false');
  });
});

test('validator exceptions and malformed timestamps never expose raw details', async () => {
  let calls = 0;
  await mounted({ items: [{ ...sample, createdAt: '<private-date>' }], canCreate: true, onCreate: async () => { calls++; }, validateText: () => { throw Error('private validator detail'); } }, async container => {
    assert.equal(container.querySelector('time').getAttribute('datetime'), null); assert.match(container.textContent, /Date unavailable/);
    await input(container.querySelector('textarea'), 'A draft'); await submit(container.querySelector('form'));
    assert.equal(calls, 0); assert.match(container.textContent, /could not validate/); assert.doesNotMatch(container.textContent, /private validator|private-date/);
  });
});

test('blocked state prevents mutation but allows explicit reconciliation and unmount ignores rejection', async () => {
  let reject, creates = 0, refreshes = 0;
  const props = { items: [], canCreate: true, blocked: true, onRefresh: () => refreshes++, onCreate: () => { creates++; return new Promise((yes, no) => { reject = no; }); } };
  await mounted(props, async (container, render) => {
    await input(container.querySelector('textarea'), 'Preserved draft'); await submit(container.querySelector('form')); assert.equal(creates, 0);
    await click(button(container, 'Refresh comments')); assert.equal(refreshes, 1);
    await render({ ...props, blocked: false }); await submit(container.querySelector('form')); assert.equal(creates, 1);
  });
  await act(async () => reject(Error('private late failure')));
});
