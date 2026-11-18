import {useState} from 'react';
import {Pencil,Check,X,Eye,EyeOff} from 'lucide-react';
import {Button} from '../components/button.js';
import {Input} from '../components/input.js';
import {Textarea} from '../components/textarea.js';
import {WorkspaceSelect} from './form-controls/select.js';

export interface InlineFormField {
 name:string;label:string;value?:string;type?:'text'|'email'|'number';
 secret?:boolean;stored?:boolean;multiline?:boolean;required?:boolean;readOnly?:boolean;
 maxLength?:number;helper?:string;options?:{value:string;label:string}[];
}
/** Draft fields inside an owning form. Only the owning form persists changes. */
export function InlineFormDetails({fields}:{fields:InlineFormField[]}){
 return <div className="overflow-hidden rounded-md border"><table className="w-full border-collapse text-sm"><tbody>{fields.map(field=><InlineFormRow key={field.name} field={field}/>)}</tbody></table></div>;
}
function InlineFormRow({field}:{field:InlineFormField}){
 const [value,setValue]=useState(field.value??''),[before,setBefore]=useState(value),[editing,setEditing]=useState(false),[shown,setShown]=useState(false);
 const label=field.label,hasValue=!!value||(field.secret&&field.stored);
 const finish=()=>{setEditing(false);setShown(false);};
 return <tr className="border-b last:border-b-0">
  <th scope="row" className="w-[30%] min-w-40 border-r bg-muted/30 px-3 py-3 text-left align-top text-xs font-medium uppercase text-muted-foreground">{label}</th>
  <td className="px-3 py-2 align-top">
   <input type="hidden" name={field.name} value={value}/>
   <div className="flex min-h-8 min-w-0 items-start gap-2">
    <div className="min-w-0 flex-1 whitespace-pre-wrap break-words">
     {editing?<div onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setValue(before);finish();}else if(event.key==='Enter'&&!field.multiline){event.preventDefault();finish();}}}>
      {field.options?<WorkspaceSelect ariaLabel={label} value={value} options={field.options} onValueChange={setValue}/>:field.multiline&&(!field.secret||shown)?<Textarea aria-label={label} autoFocus value={value} onChange={event=>setValue(event.target.value)} maxLength={field.maxLength} autoComplete="off" rows={4} fixedRows/>:<Input aria-label={label} autoFocus type={field.secret&&!shown?'password':field.type??'text'} value={value} onChange={event=>setValue(event.target.value)} required={field.required} maxLength={field.maxLength} autoComplete={field.secret?'new-password':'off'}/>}
      {field.helper&&<p className="mt-1 text-xs text-muted-foreground">{field.helper}</p>}
     </div>:field.secret?(hasValue?'••••••••':<span className="text-muted-foreground">Not set</span>):field.options?.find(option=>option.value===value)?.label||(value||<span className="text-muted-foreground">Not set</span>)}
    </div>
    {editing?<>
     {field.secret&&<Button type="button" size="icon" variant="ghost" aria-label={`${shown?'Hide':'Show'} ${label}`} onClick={()=>setShown(!shown)}>{shown?<EyeOff className="size-4"/>:<Eye className="size-4"/>}</Button>}
     <Button type="button" size="icon" variant="ghost" aria-label={`Apply ${label}`} onClick={finish}><Check className="size-4"/></Button>
     <Button type="button" size="icon" variant="ghost" aria-label={`Cancel ${label}`} onClick={()=>{setValue(before);finish();}}><X className="size-4"/></Button>
    </>:!field.readOnly&&<Button type="button" size="icon" variant="ghost" aria-label={`Edit ${label}`} onClick={()=>{setBefore(value);setEditing(true);}}><Pencil className="size-4"/></Button>}
   </div>
  </td>
 </tr>;
}
