import {cn} from '../lib/utils.js';

/** Compact accessible percentage ring; null represents unavailable data. */
export function UsageRing({value,label,className}:{value:number|null;label:string;className?:string}){
 const percent=value!==null&&Number.isFinite(value)?Math.max(0,Math.min(100,value)):null;
 return <div role="img" aria-label={`${label}: ${percent===null?'unavailable':percent.toFixed(0)+'%'}`} className={cn('relative inline-grid size-16 shrink-0 place-items-center',className)}>
  <svg viewBox="0 0 64 64" className="size-full -rotate-90" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" strokeWidth="5" className="stroke-muted"/>{percent!==null&&<circle cx="32" cy="32" r="27" fill="none" strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray={`${percent} 100`} className={percent>=90?'stroke-destructive':percent>=70?'stroke-amber-500':'stroke-emerald-500'}/>}</svg>
  <span className="absolute text-xs font-semibold">{percent===null?'—':percent.toFixed(0)+'%'}</span>
 </div>;
}
