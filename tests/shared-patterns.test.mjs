import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SettingsNav } from '@workspace/ui/blocks/settings-nav';
import { StageProgress } from '@workspace/ui/blocks/work-progress';
import { ActivityFeed } from '@workspace/ui/blocks/activity-feed';
import { CheckResults } from '@workspace/ui/blocks/check-results';
import { RecordList } from '@workspace/ui/blocks/record-list';

test('settings and record navigation retain current selection and accessible buttons', () => {
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(SettingsNav, { items: [{ id: 'appearance', label: 'Appearance' }], value: 'appearance', onValueChange() {} }),
    React.createElement(RecordList, { items: [{ id: 'one', title: 'First record' }], selected: 'one', onSelect() {} }),
  ));
  assert.match(html, /aria-current="page"/);
  assert.match(html, /aria-current="true"/);
  assert.match(html, /First record/);
});
test('progress keeps actual maximum and feed/checks preserve app-provided content', () => {
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(StageProgress, { stages: ['Plan', 'Code', 'Check'], completed: 1, activeIndex: 1, running: true }),
    React.createElement(ActivityFeed, { items: [{ id: 1, kind: 'phase', time: '10:00', message: 'Working' }] }),
    React.createElement(CheckResults, { items: [{ name: 'Build', passed: false, output: 'Failure details' }] }),
  ));
  assert.match(html, /value="1" max="3"/);
  assert.match(html, /aria-current="step"/);
  assert.match(html, /Working/);
  assert.match(html, /Build · Failed/);
  assert.match(html, /Failure details/);
});
