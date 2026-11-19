import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<html><body></body></html>',{url:'http://localhost/'});
for(const name of ['window','document','navigator','HTMLElement','HTMLInputElement','Node','Element','MutationObserver','Event'])Object.defineProperty(globalThis,name,{configurable:true,value:dom.window[name]});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');
const {WorkspaceAccessGate}=await import('../dist/src/blocks/auth/workspace-access-gate.js');
const failure=statusCode=>Object.assign(new Error('Service unavailable'),{statusCode});
async function mount(client,verify){const node=document.createElement('div');document.body.append(node);const root=createRoot(node);await act(async()=>root.render(React.createElement(WorkspaceAccessGate,{client,verify,brandName:'Test'},()=>React.createElement('p',null,'Authorized content'))));return {node,async close(){await act(async()=>root.unmount());node.remove();}};}
const clientFor=session=>({session,loginContext:async()=>({mode:'shared',tenantName:null}),login:async()=>{},logout:async()=>{},changePassword:async()=>{}});
test('503 and network failures recover automatically without showing login',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});let calls=0,contexts=0;
 const client=clientFor(async()=>{calls++;if(calls===1)throw failure(503);if(calls===2)throw new TypeError('Failed to fetch');return {passwordChangeRequired:false};});client.loginContext=async()=>{contexts++;return {mode:'shared',tenantName:null};};
 const view=await mount(client);try{assert.match(view.node.textContent,/Connecting/);assert.equal(view.node.querySelector('form'),null);await act(async()=>t.mock.timers.tick(1000));await act(async()=>t.mock.timers.tick(2000));assert.match(view.node.textContent,/Authorized content/);assert.equal(calls,3);assert.equal(contexts,0);}finally{await view.close();}
});
test('403 verification denial never displays login or retries',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});let calls=0,contexts=0;const client=clientFor(async()=>{calls++;return {passwordChangeRequired:false};});client.loginContext=async()=>{contexts++;};
 const view=await mount(client,async()=>{throw failure(403);});try{assert.match(view.node.textContent,/do not have access/);await act(async()=>t.mock.timers.tick(60000));assert.equal(calls,1);assert.equal(contexts,0);assert.equal(view.node.querySelector('form'),null);}finally{await view.close();}
});
test('401 alone requests login context',async()=>{const view=await mount(clientFor(async()=>{throw failure(401);}));try{assert.ok(view.node.querySelector('form'));assert.match(view.node.textContent,/Corporate ID/);}finally{await view.close();}});
test('retry budget is bounded and manual retry restarts it',async t=>{t.mock.timers.enable({apis:['setTimeout']});let calls=0;const view=await mount(clientFor(async()=>{calls++;throw failure(503);}));try{for(let i=0;i<7;i++)await act(async()=>t.mock.timers.tick(8000));assert.equal(calls,7);assert.match(view.node.textContent,/Service unavailable/);await act(async()=>view.node.querySelector('button').click());assert.equal(calls,8);assert.match(view.node.textContent,/Connecting/);}finally{await view.close();}});
test('unmount cancels scheduled recovery and ignores late promises',async t=>{t.mock.timers.enable({apis:['setTimeout']});let calls=0;const first=await mount(clientFor(async()=>{calls++;throw failure(503);}));await first.close();await act(async()=>t.mock.timers.tick(60000));assert.equal(calls,1);let resolve,verified=0;const second=await mount(clientFor(()=>new Promise(yes=>{resolve=yes;})),async()=>{verified++;});await second.close();await act(async()=>resolve({passwordChangeRequired:false}));assert.equal(verified,0);});
test('same-tick duplicate form submissions call login once',async()=>{let calls=0,finish;const client=clientFor(async()=>{throw failure(401);});client.login=()=>{calls++;return new Promise(resolve=>{finish=resolve;});};const view=await mount(client);try{await act(async()=>{const form=view.node.querySelector('form');form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});assert.equal(calls,1);await act(async()=>finish());}finally{await view.close();}});
test('expired-session events coalesce during a pending session check',async()=>{let calls=0,finish;const view=await mount(clientFor(()=>{calls++;return new Promise(resolve=>{finish=resolve;});}));try{await act(async()=>{window.dispatchEvent(new Event('platform-session-expired'));window.dispatchEvent(new Event('platform-session-expired'));});assert.equal(calls,1);await act(async()=>finish({passwordChangeRequired:false}));assert.match(view.node.textContent,/Authorized content/);}finally{await view.close();}});
