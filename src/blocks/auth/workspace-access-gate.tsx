import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {LoginPage} from './login-page.js';
import {PasswordChangePage} from './password-change-page.js';
import {AsyncState} from '../async-state.js';
import {Button} from '../../components/button.js';

// UI contract only: the owning SDK/app supplies all authentication and scope checks.
type SessionView={passwordChangeRequired:boolean};
type HostView={mode:'shared'|'domain'|'unavailable';tenantName:string|null};
export function WorkspaceAccessGate<S extends SessionView>({client,brandName,logoSrc,logoDarkSrc,verify,children}:{
 client:{session():Promise<S>;loginContext():Promise<HostView>;login(input:{identifier:string;password:string;corporateId?:string;realm?:'user'|'admin'|'sa'}):Promise<void>;prepareLogin?():Promise<void>;logout():Promise<void>;changePassword(current:string,password:string):Promise<void>};
 brandName:string;logoSrc?:string|undefined;logoDarkSrc?:string|undefined;verify?:(session:S)=>Promise<void>;privilegedLogin?:boolean;
 children:(session:S,logout:()=>Promise<void>)=>ReactNode;
}){
 const [session,setSession]=useState<S>();const [host,setHost]=useState<HostView>();const [corporateId,setCorporateId]=useState('');
 const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
 const pending=useRef<Promise<void>|undefined>(undefined);const verifyRef=useRef(verify);verifyRef.current=verify;
 const [pathname,setPathname]=useState(()=>window.location.pathname.replace(/\/+$/,'')||'/');
 const loginRealm=['/sa','/sa/login','/sa/refresh'].includes(pathname)?'sa':['/admin','/admin/login'].includes(pathname)?'admin':'user';
 const explicitLogin=['/login','/sa','/sa/login','/sa/refresh','/admin','/admin/login'].includes(pathname);
 const signInPrepared=useRef(false);
 const generation=useRef(0);const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const attempts=useRef(0);const mounted=useRef(false);const loginPending=useRef(false);
 const [connecting,setConnecting]=useState(false);
 const refresh=useCallback((manual=false):Promise<void>=>{
  if(manual){attempts.current=0;clearTimeout(timer.current);}
  if(pending.current)return pending.current;
  const epoch=generation.current;const active=()=>mounted.current&&generation.current===epoch;
  const run=(async()=>{if(!active())return;setLoading(true);setConnecting(false);setError('');setHost(undefined);

   try{
    if(explicitLogin){
     setSession(undefined);
     if(!signInPrepared.current){
      try{if(client.prepareLogin)await client.prepareLogin();else{await client.session();await client.logout();}}
      catch(cause){const status=(cause as {statusCode?:number}).statusCode;if(status!==401&&status!==403)throw cause;}
      if(!active())return;signInPrepared.current=true;
     }
     const context=await client.loginContext();if(active()){attempts.current=0;setHost(context);}return;
    }
    const current=await client.session();if(!active())return;
    if(!current.passwordChangeRequired)await verifyRef.current?.(current);if(!active())return;attempts.current=0;setSession(current);}
   catch(cause){if(!active())return;setSession(undefined);
    const status=(cause as {statusCode?:number;status?:number}|null)?.statusCode??(cause as {status?:number}|null)?.status;
    if(status===401||status===403){if(status===403){setError('You do not have access to this workspace. Choose another account or sign-in portal.');try{await client.logout();}catch{/* Denial must never hide the login form. */}}try{const context=await client.loginContext();if(active()){attempts.current=0;setHost(context);}}catch(contextError){if(!active())return;throw contextError;}}
    else throw cause;
   }
  })().catch(cause=>{if(!active())return;
   const status=(cause as {statusCode?:number;status?:number}|null)?.statusCode??(cause as {status?:number}|null)?.status;
   const retryable=cause instanceof TypeError||status===408||status===429||(typeof status==='number'&&status>=500&&status<=599);
   if(retryable&&attempts.current<6){const delay=Math.min(1000*2**attempts.current++,8000);setConnecting(true);timer.current=setTimeout(()=>{timer.current=undefined;void refresh();},delay);}
   else setError(status===403?'You do not have access to this workspace. Contact your administrator.':cause instanceof Error?cause.message:'Workspace unavailable.');
  }).finally(()=>{if(active()){pending.current=undefined;setLoading(false);}});
  pending.current=run;return run;
 },[client,explicitLogin,pathname]);
 useEffect(()=>{const changed=()=>setPathname(window.location.pathname.replace(/\/+$/,'')||'/');window.addEventListener('popstate',changed);return()=>window.removeEventListener('popstate',changed);},[]);
 useEffect(()=>{mounted.current=true;attempts.current=0;signInPrepared.current=false;loginPending.current=false;setBusy(false);void refresh();const expired=()=>{setSession(undefined);void refresh(true);};window.addEventListener('platform-session-expired',expired);return()=>{mounted.current=false;generation.current++;clearTimeout(timer.current);pending.current=undefined;window.removeEventListener('platform-session-expired',expired);};},[refresh]);
 useEffect(()=>{if(!session||session.passwordChangeRequired)document.title=(session?'Change password':'Sign in')+' · '+brandName;},[session,brandName]);
 const logout=async()=>{setBusy(true);setError('');try{await client.logout();setSession(undefined);await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Sign out failed.');}finally{setBusy(false);}};
 if(loading||connecting||(explicitLogin&&session&&!signInPrepared.current))return <main className="p-8"><AsyncState loading loadingMessage="Connecting to your workspace…">{null}</AsyncState><Button variant="outline" onClick={()=>void refresh(true)}>Retry connection</Button></main>;
 if(session?.passwordChangeRequired)return <><PasswordChangePage brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} minLength={8} backHref="/" busy={busy} error={error} onSubmit={async values=>{
  if(busy)return;setBusy(true);setError('');try{await client.changePassword(values.currentPassword,values.newPassword);setNotice('Password updated. Sign in again.');await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Password update failed.');}finally{setBusy(false);}
 }}/><div className="text-center"><Button variant="link" disabled={busy} onClick={()=>void logout()}>Sign out</Button></div></>;
 if(session)return <>{error&&<p role="alert">{error}</p>}{children(session,logout)}</>;
 if(window.location.pathname==='/login/help')return <main className="mx-auto max-w-lg space-y-4 p-8"><h1 className="text-xl font-semibold">Account recovery</h1><p>Contact your workspace administrator to recover your account. Passwords and users are managed by your company login service.</p><Button asChild variant="outline"><a href="/">Back</a></Button></main>;
 if(!host)return <main className="p-8"><AsyncState error={error||'Workspace unavailable.'} onRetry={()=>void refresh(true)}>{null}</AsyncState></main>;
 return <>{notice&&<p role="status" className="p-4 text-center">{notice}</p>}<LoginPage workspace brandName={brandName} logoSrc={logoSrc} logoDarkSrc={logoDarkSrc} description="Access your workspace with your registered credentials." registerHref={null} forgotHref="/login/help" minLength={1} busy={busy} disabled={host.mode==='unavailable'}
  error={host.mode==='unavailable'?'This workspace is unavailable. Contact your administrator.':error}
  tenantContext={host.mode==='shared'?{mode:'shared',corporateId,onCorporateIdChange:setCorporateId}:host.mode==='domain'?{mode:'domain',tenantName:host.tenantName??'Workspace'}:undefined}
  onSubmit={async(identifier,password)=>{if(loginPending.current)return;const epoch=generation.current;const active=()=>mounted.current&&generation.current===epoch;loginPending.current=true;setBusy(true);setError('');try{await client.login({identifier,password,...(host.mode==='shared'?{corporateId:corporateId.trim()}:{}),realm:loginRealm});if(!active())return;if(explicitLogin){window.history.replaceState(window.history.state,'','/');window.dispatchEvent(new Event('popstate'));setPathname('/');}else await refresh();}catch(cause){if(active())setError(cause instanceof Error?cause.message:'Sign-in failed.');}finally{loginPending.current=false;if(active())setBusy(false);}}}/>
  <p className="p-4 text-center text-sm text-muted-foreground">For account recovery, contact your workspace administrator. <Button variant="link" disabled={busy} onClick={()=>void refresh(true)}>Retry connection</Button></p></>;
}
