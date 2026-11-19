import '@excalidraw/excalidraw/index.css';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Excalidraw, serializeAsJSON, exportToBlob } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import { useDesignSystem } from '../design-system/provider.js';
export type WhiteboardHandle = { serialize: ()=>string };
/** Static scene thumbnail; never mounts an interactive editor or injects SVG markup. */
export function WhiteboardPreview({content,label='Whiteboard preview'}:{content:string;label?:string}) {
  const [image,setImage]=useState('');
  const [failed,setFailed]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let disposed=false;let url='';setImage('');setFailed(false);setLoading(true);
    void (async()=>{try {
      const scene=JSON.parse(content) as ExcalidrawInitialDataState;
      if(!Array.isArray(scene.elements))throw new Error('Invalid scene');
      if(!scene.elements.some((element:{isDeleted?:boolean})=>!element.isDeleted))return;
      const blob=await exportToBlob({elements:scene.elements,files:scene.files??{},appState:{...scene.appState,exportWithDarkMode:false,exportBackground:true},mimeType:'image/png',maxWidthOrHeight:640});
      if(disposed)return;url=URL.createObjectURL(blob);setImage(url);
    }catch{if(!disposed)setFailed(true);}finally{if(!disposed)setLoading(false);}})();
    return()=>{disposed=true;if(url)URL.revokeObjectURL(url);};
  },[content]);
  return <div className="flex aspect-video items-center justify-center overflow-hidden border-b bg-white text-sm text-muted-foreground">{image?<img src={image} alt={label} className="h-full w-full object-contain"/>:<span>{loading?'Loading preview…':failed?'Preview unavailable':'Empty whiteboard'}</span>}</div>;
}
export const Whiteboard = forwardRef<WhiteboardHandle,{content:string;onDirty:()=>void}>(function Whiteboard({content,onDirty},ref) {
  const api=useRef<ExcalidrawImperativeAPI|null>(null); const last=useRef('');
  const [initial]=useState<ExcalidrawInitialDataState>(()=>JSON.parse(content));
  const ready=useRef(false);
  const {preferences}=useDesignSystem();
  const [systemDark,setSystemDark]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const sync=()=>setSystemDark(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
  useImperativeHandle(ref,()=>({serialize:()=>{
    if(!api.current||!ready.current)throw new Error('Whiteboard is still loading. Try saving again.');
    return serializeAsJSON(api.current.getSceneElements(),api.current.getAppState(),api.current.getFiles(),'local');
  }}),[]);
  return <div className="h-[600px] overflow-hidden rounded-lg border"><Excalidraw initialData={initial} excalidrawAPI={(value: ExcalidrawImperativeAPI)=>{api.current=value;}} theme={preferences.mode==='dark'||(preferences.mode==='system'&&systemDark)?'dark':'light'}
    onChange={(elements: readonly {id:string;version:number;isDeleted:boolean}[],state: {isLoading?:boolean},files: Record<string,unknown>)=>{if(!ready.current){if(state.isLoading)return;const expected=(initial.elements??[]).map((element:{id:string})=>element.id);if(expected.some((id:string)=>!elements.some(element=>element.id===id)))return;ready.current=true;}const signature=JSON.stringify([elements.map(e=>[e.id,e.version,e.isDeleted]),Object.keys(files)]);if(last.current&&signature!==last.current)onDirty();last.current=signature;}}
    UIOptions={{canvasActions:{loadScene:false,saveToActiveFile:false,export:false}}}/></div>;
});
