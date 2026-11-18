import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DetailTable } from '@workspace/ui/blocks/detail-table';
import { DiagramEditor } from '@workspace/ui/blocks/diagram-editor';
import { SchemaFieldsEditor } from '@workspace/ui/blocks/schema-fields-editor';
import { input, select, button, field } from '@workspace/ui/public-controls';

test('detail rows preserve supplied values, accessible name and empty state',()=>{
 const columns=[{id:'name',label:'Item',render:row=>row.name}];
 const html=renderToStaticMarkup(React.createElement(DetailTable,{rows:[{id:'a',name:'<unsafe>'}],columns,getRowId:row=>row.id,caption:'Document items'}));
 assert.match(html,/aria-label="Document items"/); assert.match(html,/&lt;unsafe&gt;/); assert.doesNotMatch(html,/<unsafe>/);
 assert.match(renderToStaticMarkup(React.createElement(DetailTable,{rows:[],columns,getRowId:row=>row.id,caption:'Items'})),/No items/);
});
test('diagram instances isolate SVG references and expose labelled, focusable nodes',()=>{
 const value={blocks:[{id:'a',name:'Example node',type:'Input',description:'',x:0,y:0}],connections:[]};
 const html=renderToStaticMarkup(React.createElement('div',null,...[1,2].map(key=>React.createElement(DiagramEditor,{key,value,onChange(){}}))));
 const ids=[...html.matchAll(/<marker id="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]); assert.match(html,/aria-pressed="false"/);assert.match(html,/Example node/);
});
test('schema editor renders shared checkboxes and never modifies its input data',()=>{
 const fields=[{name:'id',type:'TEXT',primary:true,required:false,reference:''}];
 const before=JSON.stringify(fields);const html=renderToStaticMarkup(React.createElement(SchemaFieldsEditor,{fields,onChange(){}}));
 assert.match(html,/data-slot="checkbox"/);assert.match(html,/Column name/);assert.match(html,/Add column/);assert.equal(JSON.stringify(fields),before);
});
test('static HTML controls escape labels, values and attributes while composing trusted controls',()=>{
 assert.doesNotMatch(button('<img src=x>'),/<img/);
 assert.match(input({id:'" onfocus="bad',placeholder:'<tag>'}),/&quot;/);
 assert.match(select({id:'type',options:[{value:'"',label:'<option>'}]}),/&lt;option&gt;/);
 assert.match(field('<script>',input()),/&lt;script&gt;/);
});
