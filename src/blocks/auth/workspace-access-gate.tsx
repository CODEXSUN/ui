import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {LoginPage} from './login-page.js';
import {PasswordChangePage} from './password-change-page.js';
import {AsyncState} from '../async-state.js';
import {Button} from '../../components/button.js';

// UI contract only: the owning SDK/app supplies all authentication and scope checks.
type SessionView={passwordChangeRequired:boolean};
type HostView={mode:'shared'|'domain'|'unavailable';tenantName:string|null};
export function WorkspaceAccessGate<S extends SessionView>({client,brandName,logoSrc,logoDarkSrc,verify,children}:{
 client:{session():Promise<S>;loginContext():Promise<HostView>;login(input:{identifier:string;password:string;corporateId?:string}):Promise<void>;logout():Promise<void>;changePassword(current:string,password:string):Promise<void>};
 brandName:string;logoSrc?:string|undefined;logoDarkSrc?:string|undefined;verify?:(session:S)=>Promise<void>;
 children:(session:S,logout:()=>Promise<void>)=>ReactNode;
}){
 const [session,setSession]=useState<S>();const [host,setHost]=useState<HostView>();const [corporateId,setCorporateId]=useState('');
 const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
 const pending=useRef<Promise<void>|undefined>(undefined);const verifyRef=useRef(verify);verifyRef.current=verify;
 const refresh=useCallback(()=>{
  if(pending.current)return pending.current;
  const run=(async()=>{setLoading(true);setError('');try{const current=await client.session();if(!current.passwordChangeRequired)await verifyRef.current?.(current);setSession(current);}
   catch(cause){setSession(undefined);if((cause as {statusCode?:number}).statusCode!==401)setError(cause instanceof Error?cause.message:'Workspace unavailable.');
    try{setHost(await client.loginContext());}catch{setError('Unable to connect to sign-in. Try again.');}}
   finally{setLoading(false);}})();pending.current=run;void run.finally(()=>{pending.current=undefined;});return run;
 },[client]);
 useEffect(()=>{void refresh();const expired=()=>{setSession(undefined);void refresh();};window.addEventListener('platform-session-expired',expired);return()=>window.removeEventListener('platform-session-expired',expired);},[refresh]);
 useEffect(()=>{if(!session||session.passwordChangeRequired)document.title=(session?'Change password':'Sign in')+' · '+brandName;},[session,brandName]);
 const logout=async()=>{setBusy(true);setError('');try{await client.logout();setSession(undefined);await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Sign out failed.');}finally{setBusy(false);}};
 if(loading)return <main className="p-8"><AsyncState loading>{null}</AsyncState></main>;
 if(session?.passwordChangeRequired)return <><PasswordChangePage brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} minLength={8} backHref="/" busy={busy} error={error} onSubmit={async values=>{
  if(busy)return;setBusy(true);setError('');try{await client.changePassword(values.currentPassword,values.newPassword);setNotice('Password updated. Sign in again.');await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Password update failed.');}finally{setBusy(false);}
 }}/><div className="text-center"><Button variant="link" disabled={busy} onClick={()=>void logout()}>Sign out</Button></div></>;
 if(session)return <>{error&&<p role="alert">{error}</p>}{children(session,logout)}</>;
 if(window.location.pathname==='/login/help')return <main className="mx-auto max-w-lg space-y-4 p-8"><h1 className="text-xl font-semibold">Account recovery</h1><p>Contact your workspace administrator to recover your account. Passwords and users are managed by your company login service.</p><Button asChild variant="outline"><a href="/">Back</a></Button></main>;
 if(!host)return <main className="p-8"><AsyncState error={error||'Workspace unavailable.'} onRetry={()=>void refresh()}>{null}</AsyncState></main>;
 return <>{notice&&<p role="status" className="p-4 text-center">{notice}</p>}<LoginPage workspace brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} description="Access your workspace with your registered credentials." registerHref={null} forgotHref="/login/help" minLength={1} busy={busy} disabled={host.mode==='unavailable'}
  error={host.mode==='unavailable'?'This workspace is unavailable. Contact your administrator.':error}
  tenantContext={host.mode==='shared'?{mode:'shared',corporateId,onCorporateIdChange:setCorporateId}:host.mode==='domain'?{mode:'domain',tenantName:host.tenantName??'Workspace'}:undefined}
  onSubmit={async(identifier,password)=>{if(busy)return;setBusy(true);setError('');try{await client.login({identifier,password,...(host.mode==='shared'?{corporateId:corporateId.trim()}:{})});await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Sign-in failed.');}finally{setBusy(false);}}}/>
  <p className="p-4 text-center text-sm text-muted-foreground">For account recovery, contact your workspace administrator. <Button variant="link" disabled={busy} onClick={()=>void refresh()}>Retry connection</Button></p></>;
}
