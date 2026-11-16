import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MainWorkspace, MdiWorkspace, WorkspaceSideMenu, WorkspaceTopMenu, WorkspaceStatusBar } from '@workspace/ui';

test('workspace composition preserves labelled navigation, current route and live status', () => {
  const html = renderToStaticMarkup(React.createElement(MainWorkspace, {
    topMenu: React.createElement(WorkspaceTopMenu, { title: 'Studio' }),
    sideMenu: React.createElement(WorkspaceSideMenu, { items: [{ id: 'home', label: 'Home' }], activeId: 'home', onSelect() {} }),
    statusBar: React.createElement(WorkspaceStatusBar, { end: '1 open' }, 'Ready'),
  }, 'Document area'));
  assert.match(html, /aria-label="Studio actions"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /Document area/);
});

test('MDI exposes active tab relationships and respects nonclosable documents', () => {
  const html = renderToStaticMarkup(React.createElement(MdiWorkspace, {
    documents: [{ id: 'home', title: 'Home', content: 'Home content', closable: false }, { id: 'notes', title: 'Notes', content: 'Notes content' }],
    activeId: 'home', onSelect() {}, onClose() {},
  }));
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /aria-controls=/);
  assert.match(html, /aria-label="Close Notes"/);
  assert.doesNotMatch(html, /aria-label="Close Home"/);
  assert.match(html, /Home content/);
});

test('empty MDI shows supplied recovery content without stale tabs', () => {
  const html = renderToStaticMarkup(React.createElement(MdiWorkspace, { documents: [], activeId: '', onSelect() {}, emptyState: 'Open overview' }));
  assert.match(html, /Open overview/);
  assert.doesNotMatch(html, /role="tab"/);
});
