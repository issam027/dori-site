import {readFile,readdir,writeFile,rename,unlink} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {createEmailProvider} from './provider.js';
import {requestMessages} from './templates.js';
const requestPattern=/^\d{13}-[a-f0-9-]{36}\.json$/;
export function createRequestNotifier({dataDir,mail,retention}, {provider=createEmailProvider(mail),clock=()=>Date.now(),intervalMs=60000,spacingMs=550}={}) {
 let running=null,closed=false;
 const enabled=Boolean(provider);
 async function save(path,state){const temporary=path+'.'+randomUUID()+'.tmp';try{await writeFile(temporary,JSON.stringify(state)+'\n',{mode:0o600});await rename(temporary,path)}finally{await unlink(temporary).catch(()=>{})}}
 async function processQueue(){
  for(const filename of (await readdir(dataDir)).filter(name=>requestPattern.test(name)).sort()){
   if(closed)break;
   if(Number(filename.slice(0,13))<clock()-retention*86400000)continue;
   let record;try{record=JSON.parse(await readFile(join(dataDir,filename),'utf8'))}catch(error){if(error.code==='ENOENT')continue;throw error}
   if(record.emailNotificationVersion!==1)continue; // Never email historical requests.
   const statePath=join(dataDir,filename+'.mail.json');
   let state;try{state=JSON.parse(await readFile(statePath,'utf8'))}catch(error){if(error.code!=='ENOENT')throw error;state={requestId:record.id,messages:requestMessages(record,mail).map(message=>({message,status:'pending',attempts:0,nextAttemptAt:0}))};await save(statePath,state)}
   for(const delivery of state.messages){
    if(closed)break;
    if(delivery.status!=='pending'||delivery.nextAttemptAt>clock())continue;
    // Resend's deduplication window is 24h. Do not retry ambiguous sends beyond it.
    if(clock()-Date.parse(record.createdAt)>23*3600000){delivery.status='failed';delivery.error='retry_window_expired';await save(statePath,state);continue}
    delivery.attempts++;
    try{
     const {kind,...message}=delivery.message;
     const result=await provider.send(message,{idempotencyKey:'dorify-request/'+record.id+'/'+kind});
     delivery.status='accepted';delivery.providerId=result.id;delivery.acceptedAt=new Date(clock()).toISOString();delete delivery.error;
    }catch(error){
     delivery.error=error.code||'delivery_error';
     if(!error.retryable||delivery.attempts>=8)delivery.status='failed';
     else delivery.nextAttemptAt=clock()+Math.min(60000*2**(delivery.attempts-1),3600000);
     console.warn('Request email attempt failed',record.id,delivery.message.kind,delivery.error);
    }
    await save(statePath,state);
    if(spacingMs)await new Promise(resolve=>setTimeout(resolve,spacingMs));
   }
  }
 }
 function flush(){if(!enabled||closed)return Promise.resolve();if(!running)running=processQueue().catch(()=>console.warn('Request email queue unavailable')).finally(()=>{running=null});return running}
 const timer=enabled?setInterval(()=>{void flush()},intervalMs).unref():null;
 if(enabled)queueMicrotask(()=>{void flush()});
 return {enabled,flush,notify(){void flush()},close(){closed=true;if(timer)clearInterval(timer)}};
}
