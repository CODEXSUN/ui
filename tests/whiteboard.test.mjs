import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<html><body></body></html>');
for(const name of ['window','document','navigator','HTMLElement','Node','Element','MutationObserver'])Object.defineProperty(globalThis,name,{configurable:true,value:dom.window[name]});
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const hook=registerHooks({resolve(specifier,context,next){if(context.parentURL?.endsWith('/blocks/whiteboard.js')){let source;if(specifier.endsWith('.css'))source='export {};';else if(specifier==='@excalidraw/excalidraw')source='export function Excalidraw(props){globalThis.boardProps=props;return null;}export const serializeAsJSON=(elements,appState,files)=>JSON.stringify({elements,appState,files});export const exportToBlob=async()=>new Blob();';else if(specifier.endsWith('/design-system/provider.js'))source='export const useDesignSystem=()=>({preferences:{mode:"light"}});';if(source)return {url:'data:text/javascript,'+encodeURIComponent(source),shortCircuit:true};}return next(specifier,context);}});
const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {Whiteboard}=await import('../dist/src/blocks/whiteboard.js');
test('hydration blocks premature serialization and preserves loaded drawing through changes',async()=>{
 const node=document.createElement('div'),root=createRoot(node),ref=React.createRef();let dirty=0;
 const initial=[{id:'drawn',version:1,isDeleted:false}];let elements=[];
 try{await act(async()=>root.render(React.createElement(Whiteboard,{ref,content:JSON.stringify({elements:initial,appState:{},files:{}}),onDirty:()=>dirty++})));
 boardProps.excalidrawAPI({getSceneElements:()=>elements,getAppState:()=>({}),getFiles:()=>({})});
 assert.throws(()=>ref.current.serialize(),/still loading/);
 boardProps.onChange([],{isLoading:true},{});assert.throws(()=>ref.current.serialize(),/still loading/);
 boardProps.onChange([],{isLoading:false},{});assert.throws(()=>ref.current.serialize(),/still loading/);
 elements=initial;boardProps.onChange(elements,{isLoading:false},{});assert.deepEqual(JSON.parse(ref.current.serialize()).elements,initial);assert.equal(dirty,0);
 elements=[{...initial[0],version:2}];boardProps.onChange(elements,{},{});assert.equal(dirty,1);assert.equal(JSON.parse(ref.current.serialize()).elements[0].version,2);
 elements=[];boardProps.onChange(elements,{},{});assert.deepEqual(JSON.parse(ref.current.serialize()).elements,[]);
 }finally{await act(async()=>root.unmount());hook.deregister();dom.window.close();}
});
