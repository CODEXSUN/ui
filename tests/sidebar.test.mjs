import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Layers } from 'lucide-react';
import { AppSidebar, SidebarProvider } from '@workspace/ui';

function renderSidebar(open) {
  return renderToStaticMarkup(React.createElement(SidebarProvider, { defaultOpen: open },
    React.createElement(AppSidebar, {
      positioning: 'container',
      user: { name: 'UIUX', email: '', fallback: 'UI' },
      versionLabel: 'v test',
      footerContent: 'Settings footer',
      items: [
        { title: 'Enquiries', icon: Layers, count: 101, isActive: true, onSelect() {} },
        { title: 'Scheduling', icon: Layers, isActive: true, items: [{ title: 'Calendar', onSelect() {} }] },
      ],
    })));
}

test('reference sidebar preserves expanded navigation, badge counts and nested items', () => {
  const html = renderSidebar(true);
  assert.match(html, /data-state="expanded"/);
  assert.match(html, /data-collapsible=""/);
  assert.match(html, /Enquiries/);
  assert.match(html, />101</);
  assert.match(html, /Calendar/);
  assert.match(html, /Settings footer/);
});

test('reference sidebar retains icon collapse and capped count badge', () => {
  const html = renderSidebar(false);
  assert.match(html, /data-state="collapsed"/);
  assert.match(html, /data-collapsible="icon"/);
  assert.match(html, />9\+</);
  assert.match(html, /group-data-\[collapsible=icon\]:hidden/);
  assert.match(html, /Toggle Sidebar/);
});
