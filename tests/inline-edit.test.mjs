import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InlineDetails } from '../dist/src/blocks/inline-edit.js';
test('inline details expose named edit actions, stable values and semantic row labels',()=>{
 const html=renderToStaticMarkup(React.createElement(InlineDetails,{rows:[{key:'name',label:'Name',value:'Task runner',onSave:async()=>{}},{key:'owner',label:'Owner',value:'',onSave:async()=>{}}]}));
 assert.match(html,/scope="row"/);assert.match(html,/Task runner/);assert.match(html,/Not set/);assert.match(html,/aria-label="Edit Name"/);assert.match(html,/aria-label="Edit Owner"/);assert.doesNotMatch(html,/<input/);
});
