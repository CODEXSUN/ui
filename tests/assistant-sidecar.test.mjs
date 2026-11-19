import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
const dom = new JSDOM("<html><body></body></html>", {
  url: "http://localhost/",
});
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLTextAreaElement",
  "Node",
  "Element",
  "MutationObserver",
  "Event",
  "File",
  "getComputedStyle",
])
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: dom.window[key],
  });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { act } = React;
const { createRoot } = await import("react-dom/client");
const { AssistantChatPanel } =
  await import("../dist/src/blocks/assistant-sidecar.js");
test("voice drafts need review, attachments stay local, duplicate sends coalesce and unmount aborts speech", async () => {
  let instance,
    release,
    calls = 0,
    sent;
  class Speech {
    constructor() {
      instance = this;
    }
    start() {
      this.onresult({
        results: [{ 0: { transcript: "Plan the Friday milestone" } }],
      });
    }
    abort() {
      this.aborted = true;
    }
    stop() {
      this.onend?.();
    }
  }
  window.SpeechRecognition = Speech;
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node);
  await act(async () =>
    root.render(
      React.createElement(AssistantChatPanel, {
        name: "Zetro",
        logoSrc: "data:image/svg+xml,<svg/>",
        messages: [],
        busy: false,
        onNew() {},
        onStop() {},
        onSend: async (text, files) => {
          calls++;
          sent = { text, files };
          await new Promise((resolve) => {
            release = resolve;
          });
          return true;
        },
      }),
    ),
  );
  try {
    await act(async () =>
      node.querySelector('[aria-label="Start voice input"]').click(),
    );
    assert.equal(calls, 0);
    assert.equal(
      node.querySelector("textarea").value,
      "Plan the Friday milestone",
    );
    await act(async () => instance.onend());
    const file = new File(["Friday milestone"], "notes.txt", {
      type: "text/plain",
    });
    const input = node.querySelector("input[type=file]");
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [file],
    });
    await act(async () =>
      input.dispatchEvent(new Event("change", { bubbles: true })),
    );
    assert.equal(calls, 0);
    assert.match(node.textContent, /notes.txt/);
    assert.equal(node.textContent.includes("Upload files"), false);
    await act(async () => {
      node
        .querySelector("form")
        .dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
      node
        .querySelector("form")
        .dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
    });
    assert.equal(calls, 1);
    assert.equal(sent.text, "Plan the Friday milestone");
    assert.equal(sent.files[0], file);
    await act(async () => release());
    assert.equal(node.querySelector("textarea").value, "");
    assert.equal(node.textContent.includes("notes.txt"), false);
  } finally {
    await act(async () => root.unmount());
    node.remove();
    delete window.SpeechRecognition;
  }
  assert.equal(instance.aborted, true);
});
test("unsupported voice is explicit and never dispatches a chat request", async () => {
  let calls = 0;
  const node = document.createElement("div");
  document.body.append(node);
  const root = createRoot(node);
  await act(async () =>
    root.render(
      React.createElement(AssistantChatPanel, {
        name: "Zetro",
        logoSrc: "x",
        messages: [],
        busy: false,
        onNew() {},
        onStop() {},
        onSend: async () => {
          calls++;
          return true;
        },
      }),
    ),
  );
  try {
    await act(async () =>
      node.querySelector('[aria-label="Start voice input"]').click(),
    );
    assert.match(node.textContent, /unavailable in this browser/);
    assert.equal(calls, 0);
  } finally {
    await act(async () => root.unmount());
    node.remove();
  }
});

test('new chat ignores speech results delivered after abort', async () => {
  let instance;
  class Speech { constructor(){instance=this;} start(){} abort(){this.aborted=true;} stop(){this.onend?.();} }
  window.SpeechRecognition=Speech;
  const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
  await act(async()=>root.render(React.createElement(AssistantChatPanel,{name:'Assistant',logoSrc:'x',messages:[],busy:false,onNew(){},onStop(){},onSend:async()=>true})));
  try {
    await act(async()=>node.querySelector('[aria-label="Start voice input"]').click());const stale=instance.onresult;
    await act(async()=>node.querySelector('[aria-label="New chat"]').click());
    await act(async()=>{const input=node.querySelector('textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,'New draft');input.dispatchEvent(new Event('input',{bubbles:true}));});
    await act(async()=>stale({results:[{0:{transcript:'old private transcript'}}]}));
    assert.equal(node.querySelector('textarea').value,'New draft');assert.equal(instance.aborted,true);
  }finally{await act(async()=>root.unmount());node.remove();delete window.SpeechRecognition;}
});
test('pending submission locks draft and New chat even before the host busy prop updates', async () => {
  let resolve;
  const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
  await act(async()=>root.render(React.createElement(AssistantChatPanel,{name:'Assistant',logoSrc:'x',messages:[],busy:false,onNew(){},onStop(){},onSend:()=>new Promise(yes=>{resolve=yes;})})));
  try {
    await act(async()=>{const input=node.querySelector('textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,'Send this');input.dispatchEvent(new Event('input',{bubbles:true}));});
    await act(async()=>node.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
    assert.equal(node.querySelector('textarea').disabled,true);assert.equal(node.querySelector('[aria-label="New chat"]').disabled,true);
  }finally{if(resolve)await act(async()=>resolve(true));await act(async()=>root.unmount());node.remove();}
});

test('dictation cannot dispatch a form while voice capture is active', async () => {
  let calls=0;
  class Speech {start(){this.onresult({results:[{0:{transcript:'Review this draft'}}]});} abort(){} stop(){this.onend?.();}}
  window.SpeechRecognition=Speech;const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
  await act(async()=>root.render(React.createElement(AssistantChatPanel,{name:'Assistant',logoSrc:'x',messages:[],busy:false,onNew(){},onStop(){},onSend:async()=>{calls++;return true;}})));
  try{await act(async()=>node.querySelector('[aria-label="Start voice input"]').click());await act(async()=>node.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));assert.equal(calls,0);assert.equal(node.querySelector('textarea').value,'Review this draft');}finally{await act(async()=>root.unmount());node.remove();delete window.SpeechRecognition;}
});
test('iframe launcher rejects unsafe schemes and URL credentials without inventing trusted origins', async()=>{
 const {AssistantSidecar}=await import('../dist/src/blocks/assistant-sidecar.js');const {renderToStaticMarkup}=await import('react-dom/server');
 for(const url of ['javascript:alert(1)','data:text/html,test','https://user:secret@example.test/chat']){const html=renderToStaticMarkup(React.createElement(AssistantSidecar,{url,name:'Assistant',logoSrc:'x'}));assert.equal(new JSDOM(html).window.document.querySelector('button').disabled,true);assert.doesNotMatch(html,/<iframe/);}
 const html=renderToStaticMarkup(React.createElement(AssistantSidecar,{url:'/chat',name:'Assistant',logoSrc:'x'}));assert.equal(new JSDOM(html).window.document.querySelector('button').disabled,false);
});

test('selection-only FileUpload emits queued local files but never invokes persistence',async()=>{
 const {FileUpload}=await import('../dist/src/blocks/file-upload.js');let attempts=0,selected=[];const node=document.createElement('div');document.body.append(node);const root=createRoot(node);
 await act(async()=>root.render(React.createElement(FileUpload,{selectionOnly:true,compact:true,accept:'.txt',onFilesChange:items=>{selected=items;},onUpload:async()=>{attempts++;return{id:'must-not-exist'};}})));
 try{const input=node.querySelector('input[type=file]');Object.defineProperty(input,'files',{configurable:true,value:[new File(['example'],'notes.txt',{type:'text/plain'})]});await act(async()=>input.dispatchEvent(new Event('change',{bubbles:true})));assert.equal(attempts,0);assert.equal(selected.length,1);assert.equal(selected[0].status,'queued');assert.equal(selected[0].result,undefined);assert.match(node.textContent,/Selected locally/);assert.doesNotMatch(node.textContent,/Upload files|Upload complete/);}finally{await act(async()=>root.unmount());node.remove();}
});
