import { useEffect, useState, type ReactNode } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '../components/button.js';
import { Input } from '../components/input.js';
import { Textarea } from '../components/textarea.js';
import { WorkspaceSelect } from './form-controls/select.js';
export type InlineEditProps={label:string;value:string;onSave:(value:string)=>Promise<void>;multiline?:boolean;options?:{value:string;label:string}[];displayValue?:ReactNode;required?:boolean;maxLength?:number};
export function InlineEdit({label,value,onSave,multiline=false,options,displayValue,required=false,maxLength=10000}:InlineEditProps){
 const [editing,setEditing]=useState(false),[draft,setDraft]=useState(value),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{if(!editing)setDraft(value);},[value,editing]);
 async function save(event:React.FormEvent){event.preventDefault();if(busy)return;setBusy(true);setError('');try{await onSave(draft);setEditing(false);}catch(e){setError(e instanceof Error?e.message:'Save failed.');}finally{setBusy(false);}}
 if(!editing)return <div className="flex min-h-8 min-w-0 items-start justify-between gap-3"><div className="min-w-0 flex-1 whitespace-pre-wrap break-words">{displayValue??(value||<span className="text-muted-foreground">Not set</span>)}</div><Button type="button" aria-label={`Edit ${label}`} size="icon" variant="ghost" className="size-7 shrink-0" onClick={()=>{setDraft(value);setError('');setEditing(true);}}><Pencil className="size-3.5"/></Button></div>;
 return <form onSubmit={save} className="min-w-48 space-y-2" onKeyDown={event=>{if(event.key==='Escape'&&!busy){event.stopPropagation();setEditing(false);}}}>
  {options?<WorkspaceSelect ariaLabel={label} value={draft} options={options} disabled={busy} onValueChange={setDraft}/>:multiline?<Textarea aria-label={label} autoFocus required={required} maxLength={maxLength} value={draft} disabled={busy} onChange={e=>setDraft(e.target.value)}/>:<Input aria-label={label} autoFocus required={required} maxLength={maxLength} value={draft} disabled={busy} onChange={e=>setDraft(e.target.value)}/>}
  {error&&<p role="alert" className="text-xs text-destructive">{error}</p>}<div className="flex gap-1"><Button type="submit" size="sm" disabled={busy} aria-label={`Save ${label}`}><Check className="size-3.5"/>{busy?'Saving…':'Save'}</Button><Button type="button" size="sm" variant="ghost" disabled={busy} onClick={()=>setEditing(false)}><X className="size-3.5"/>Cancel</Button></div>
 </form>;
}
export function InlineDetails({rows}:{rows:(InlineEditProps&{key:string})[]}){return <div className="overflow-hidden rounded-md border"><table className="w-full border-collapse text-sm"><tbody>{rows.map(({key,...row})=><tr key={key} className="border-b last:border-b-0"><th scope="row" className="w-40 border-r bg-muted/30 px-3 py-2 text-left align-top text-xs font-medium uppercase text-muted-foreground">{row.label}</th><td className="px-3 py-2 align-top"><InlineEdit {...row}/></td></tr>)}</tbody></table></div>;}
