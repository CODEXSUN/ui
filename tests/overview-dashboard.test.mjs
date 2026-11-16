import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {OverviewDashboard,OverviewModulePanel} from '@workspace/ui';
test('dashboard distinguishes unavailable measures from a measured zero and labels module actions',()=>{
 const html=renderToStaticMarkup(React.createElement(OverviewDashboard,{title:'Sales overview',description:'Workspace',metrics:[{id:'missing',label:'Revenue',value:null,description:'Awaiting data'},{id:'zero',label:'Open orders',value:0,description:'Actual count'}],modules:[{id:'orders',title:'Orders',description:'Order overview'}],onOpenModule(){},availability:'Awaiting data',activity:'No events',guidance:'Connect data'}));
 assert.match(html,/Revenue: not connected/);assert.ok(html.includes('>0</dd>'));assert.match(html,/aria-label="Open module: Orders"/);assert.ok(html.includes('Sales overview</h1>'));assert.doesNotMatch(html,/NaN|undefined/);
});
test('module panel exposes honest connection status and a labelled return action',()=>{
 const html=renderToStaticMarkup(React.createElement(OverviewModulePanel,{title:'Orders',description:'Order overview',focus:['Track order lifecycle'],measures:['Orders awaiting dispatch'],emptyMessage:'No order source is connected.',onBack(){}}));
 assert.match(html,/Back to overview/);assert.match(html,/role="status"/);assert.match(html,/No order source is connected/);assert.match(html,/Orders awaiting dispatch/);
});

test('multiple dashboard instances keep module headings unique and correctly referenced',()=>{
 const props={title:'Overview',description:'Workspace',metrics:[],modules:[],onOpenModule(){},availability:'No data source',activity:null,guidance:null};
 const html=renderToStaticMarkup(React.createElement(React.Fragment,null,React.createElement(OverviewDashboard,props),React.createElement(OverviewDashboard,props)));
 const ids=[...html.matchAll(/aria-labelledby="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(ids.length,2);assert.equal(new Set(ids).size,2);for(const id of ids)assert.ok(html.includes('id="'+id+'"'));
});
