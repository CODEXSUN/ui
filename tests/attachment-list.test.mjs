import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<html><body></body></html>', { url: 'http://localhost/' });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'Node', 'Element', 'DocumentFragment', 'MutationObserver', 'Event', 'KeyboardEvent', 'MouseEvent']) Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import('react'); const { act } = React;
const { createRoot } = await import('react-dom/client');
const { AttachmentList } = await import('../dist/src/blocks/attachment-list.js');
const item = { id: 'file0001', name: '<script>private</script>.pdf', sizeBytes: 123, mediaType: 'application/pdf', revision: 2, canDownload: true, canDelete: true };
const button = (node, text) => [...node.querySelectorAll('button')].find(button => button.textContent === text);
const click = node => act(async () => { assert.ok(node); node.click(); });
async function mount(props, work) {
  const container = document.createElement('div'); document.body.append(container); const root = createRoot(container);
  const render = props => act(async () => root.render(React.createElement(AttachmentList, props)));
  await render(props);
  try { await work(container, render); } finally { await act(async () => root.unmount()); container.remove(); }
}
test('escaped metadata has no executable previews or public URLs and missing callbacks hide actions', async () => {
  await mount({ items: [item] }, async container => {
    assert.match(container.textContent, /<script>private/); assert.equal(container.querySelector('script,img,iframe,a'), null);
    assert.equal(button(container, 'Download'), undefined); assert.equal(button(container, 'Delete'), undefined);
  });
});
test('deletion is confirmed with captured revision; duplicate actions, revoked permissions and cancel are safe', async () => {
  let resolve; const calls = [];
  const props = { items: [item], onDelete: snapshot => { calls.push(snapshot); return new Promise(yes => { resolve = yes; }); } };
  await mount(props, async (container, render) => {
    await click(button(container, 'Delete')); await click(button(container, 'Cancel')); assert.equal(calls.length, 0);
    await click(button(container, 'Delete'));
    await render({ ...props, items: [{ ...item, revision: 3, canDelete: false }] });
    assert.equal(button(container, 'Confirm delete').disabled, true); assert.equal(calls.length, 0);
    await render({ ...props, items: [{ ...item, revision: 3 }] });
    await click(button(container, 'Confirm delete')); await click(button(container, 'Confirm delete'));
    assert.equal(calls.length, 1); assert.equal(calls[0].revision, 2);
    await act(async () => resolve()); assert.equal(container.querySelector('[aria-label="Confirm attachment deletion"]'), null);
  });
});
test('scope replacement clears confirmation and ignores late action feedback; failures are sanitized', async () => {
  let reject; const props = { resourceKey: 'old', items: [item], onDownload: () => new Promise((_, no) => { reject = no; }) };
  await mount(props, async (container, render) => {
    await click(button(container, 'Download')); await render({ ...props, resourceKey: 'new', items: [] });
    await act(async () => reject(Error('private-token'))); assert.equal(container.textContent.includes('private-token'), false); assert.equal(container.querySelector('[role="alert"]'), null);
    await render({ items: [item], onDownload: async () => { throw Error('private-token'); } });
    await click(button(container, 'Download')); assert.match(container.textContent, /could not be confirmed/); assert.equal(container.textContent.includes('private-token'), false);
  });
});
test('loading, empty, error, unavailable, blocked and paging callbacks remain accessible', async () => {
  let more = 0, refresh = 0;
  const props = { items: [], hasMore: true, onLoadMore: () => { more++; }, onRefresh: () => { refresh++; } };
  await mount(props, async (container, render) => {
    assert.match(container.textContent, /No saved/); await click(button(container, 'Load more attachments')); await click(button(container, 'Refresh attachments')); assert.deepEqual([more, refresh], [1, 1]);
    await render({ ...props, loading: true }); assert.match(container.textContent, /Loading attachments/); assert.equal(button(container, 'Load more attachments').disabled, true);
    await render({ ...props, blocked: true, error: 'Safe failure' }); assert.equal(container.querySelector('[role="alert"]').textContent, 'Safe failure');
    await render({ ...props, items: [item], unavailable: 'Not enabled' }); assert.equal(container.querySelector('ul'), null);
  });
});
