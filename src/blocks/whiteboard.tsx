import '@excalidraw/excalidraw/index.css';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Excalidraw, serializeAsJSON } from '@excalidraw/excalidraw';
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types';
import { useDesignSystem } from '../design-system/provider.js';
export type WhiteboardHandle = { serialize: ()=>string };
export const Whiteboard = forwardRef<WhiteboardHandle,{content:string;onDirty:()=>void}>(function Whiteboard({content,onDirty},ref) {
  const api=useRef<ExcalidrawImperativeAPI|null>(null); const last=useRef('');
  const [initial]=useState<ExcalidrawInitialDataState>(()=>JSON.parse(content));
  const {preferences}=useDesignSystem();
  const [systemDark,setSystemDark]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)');const sync=()=>setSystemDark(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
  useImperativeHandle(ref,()=>({serialize:()=>api.current?serializeAsJSON(api.current.getSceneElements(),api.current.getAppState(),api.current.getFiles(),'local'):content}),[content]);
  return <div className="h-[600px] overflow-hidden rounded-lg border"><Excalidraw initialData={initial} excalidrawAPI={(value: ExcalidrawImperativeAPI)=>{api.current=value;}} theme={preferences.mode==='dark'||(preferences.mode==='system'&&systemDark)?'dark':'light'}
    onChange={(elements: readonly {id:string;version:number;isDeleted:boolean}[],_state: unknown,files: Record<string,unknown>)=>{const signature=JSON.stringify([elements.map(e=>[e.id,e.version,e.isDeleted]),Object.keys(files)]);if(last.current&&signature!==last.current)onDirty();last.current=signature;}}
    UIOptions={{canvasActions:{loadScene:false,saveToActiveFile:false,export:false}}}/></div>;
});
