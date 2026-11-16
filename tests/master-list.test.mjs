import test from 'node:test';
import assert from 'node:assert/strict';
import { selectMasterListRows } from '../dist/src/blocks/data-table/master-list-model.js';

const rows = [{ id: 'a', name: 'Atlas', count: 12, status: 'Open' }, { id: 'b', name: 'River', count: 2, status: 'Closed' }, { id: 'c', name: 'Orchard', count: 30, status: 'Open' }];
const columns = ['name', 'count', 'status'].map(id => ({ id, value: row => row[id] }));
test('search and column filters intersect without changing source records', () => {
  assert.deepEqual(selectMasterListRows(rows, columns, ' OPEN ', { name: 'atl' }, null).map(row => row.id), ['a']);
  assert.deepEqual(selectMasterListRows(rows, columns, 'missing', {}, null), []);
  assert.equal(rows.length, 3);
});
test('numeric sorting is numeric, reversible, and does not mutate input order', () => {
  assert.deepEqual(selectMasterListRows(rows, columns, '', {}, { id: 'count', direction: 'asc' }).map(row => row.id), ['b', 'a', 'c']);
  assert.deepEqual(selectMasterListRows(rows, columns, '', { status: 'open' }, { id: 'count', direction: 'desc' }).map(row => row.id), ['c', 'a']);
  assert.deepEqual(rows.map(row => row.id), ['a', 'b', 'c']);
});
