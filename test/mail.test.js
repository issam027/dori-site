import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,writeFile,readFile,rm,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {ResendEmailProvider,emailConfiguration} from '../mail/provider.js';
import {requestMessages} from '../mail/templates.js';
import {createRequestNotifier} from '../mail/outbox.js';
import {createServer,configuration} from '../server.js';
const now=Date.now();
const record={id:'11111111-1111-4111-8111-111111111111',createdAt:new Date(now).toISOString(),emailNotificationVersion:1,name:'Camille <img src=x>',organization:'Agence & accueil',email:'test@example.test',phone:'+33 1 00 00 00 00',topic:'account',hosting:'cloud',sites:'2-5',queues:6,peoplePerDay:200,message:'<script>alert(1)</script>',consent:true};
const mail={provider:'resend',apiKey:'test-only-secret',from:'noreply@dorify.fr',salesTo:'ijoober@gmail.com'};
async function fixture(t){const dir=await mkdtemp(join(tmpdir(),'dorify-mail-'));t.after(()=>rm(dir,{recursive:true,force:true,maxRetries:5,retryDelay:50}));return dir}
test('professional templates include reference, quantities, signature, plain text and escaped input',()=>{
 const messages=requestMessages(record,mail);assert.equal(messages.length,2);
 for(const m of messages){assert.match(m.html,/DORIFY/);assert.ok(m.text.includes(record.id));assert.match(m.text,/(?:DEMO|CPT|CTC)-\d{10}/);assert.match(m.html,/(?:DEMO|CPT|CTC)-\d{10}/);assert.ok(m.text.includes('200'));assert.ok(m.text.includes('L’équipe Dorify'));assert.ok(!m.html.includes('<script>'));assert.ok(m.html.includes('&lt;script&gt;'));assert.equal(m.from,'Dorify <noreply@dorify.fr>')}
 assert.equal(messages[0].to,'ijoober@gmail.com');assert.equal(messages[0].replyTo,record.email);assert.match(messages[1].text,/Un commercial Dorify prendra contact/);
 assert.equal(requestMessages({...record,email:''},mail).length,1);
});
test('real HTTP adapter maps Resend headers and errors; persistent queue resumes retries without resending successes',async t=>{
 const dir=await fixture(t),calls=[];let fail=true,time=now;
 const fake=http.createServer(async(req,res)=>{const chunks=[];for await(const c of req)chunks.push(c);const body=JSON.parse(Buffer.concat(chunks));calls.push({headers:req.headers,body});if(fail&&body.to[0]==='test@example.test'){res.writeHead(429,{'Content-Type':'application/json'});res.end('{"message":"rate limited"}')}else{res.writeHead(200,{'Content-Type':'application/json'});res.end('{"id":"fake-provider-id"}')}});
 await new Promise(resolve=>fake.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>fake.close(resolve)));
 const provider=new ResendEmailProvider({apiKey:mail.apiKey,endpoint:'http://127.0.0.1:'+fake.address().port+'/emails'});
 let notifier=createRequestNotifier({dataDir:dir,mail,retention:90},{provider,clock:()=>time,spacingMs:0});t.after(()=>notifier.close());
 await notifier.flush();const filename=now+'-'+record.id+'.json';await writeFile(join(dir,filename),JSON.stringify(record));await notifier.flush();
 let state=JSON.parse(await readFile(join(dir,filename+'.mail.json'),'utf8'));assert.equal(state.messages[0].status,'accepted');assert.equal(state.messages[1].status,'pending');assert.equal(calls.length,2);
 assert.equal(calls[0].headers.authorization,'Bearer test-only-secret');assert.match(calls[0].headers['idempotency-key'],/\/sales$/);assert.equal(calls[0].body.reply_to,record.email);
 notifier.close();fail=false;time+=61000;
 notifier=createRequestNotifier({dataDir:dir,mail,retention:90},{provider,clock:()=>time,spacingMs:0});await notifier.flush();await notifier.flush();
 assert.equal(calls.length,3);assert.equal(calls[1].headers['idempotency-key'],calls[2].headers['idempotency-key']);
 state=JSON.parse(await readFile(join(dir,filename+'.mail.json'),'utf8'));assert.equal(state.messages[1].status,'accepted');
 assert.ok(!(await readFile(join(dir,filename+'.mail.json'),'utf8')).includes(mail.apiKey));
});
test('provider 403 is terminal, historical records are not emailed and ambiguous retries expire',async t=>{
 const dir=await fixture(t);let calls=0;const provider={async send(){calls++;throw Object.assign(Error('ignored private details'),{code:'provider_http_403',retryable:false})}};
 const notifier=createRequestNotifier({dataDir:dir,mail,retention:90},{provider,clock:()=>now,spacingMs:0});t.after(()=>notifier.close());await notifier.flush();
 const filename=now+'-'+record.id+'.json';await writeFile(join(dir,filename),JSON.stringify(record));await notifier.flush();await notifier.flush();assert.equal(calls,2);
 const legacyId='22222222-2222-4222-8222-222222222222';await writeFile(join(dir,now+'-'+legacyId+'.json'),JSON.stringify({...record,id:legacyId,emailNotificationVersion:undefined}));await notifier.flush();assert.equal(calls,2);
 const oldTime=now-24*3600000;await writeFile(join(dir,oldTime+'-33333333-3333-4333-8333-333333333333.json'),JSON.stringify({...record,id:'33333333-3333-4333-8333-333333333333',createdAt:new Date(oldTime).toISOString()}));await notifier.flush();assert.equal(calls,2);
});
test('a persisted form returns 201 when the mail service is unavailable',async t=>{
 const dir=await fixture(t);const config=configuration({DATA_DIR:dir,EMAIL_PROVIDER:'resend',RESEND_API_KEY:'test-only',PUBLIC_URL:'http://localhost:18090'});
 const server=await createServer(config,{provider:{async send(){throw Object.assign(Error('private'),{code:'transport_error',retryable:true})}},spacingMs:0});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));
 config.publicUrl='http://127.0.0.1:'+server.address().port;
 const response=await fetch(config.publicUrl+'/api/requests',{method:'POST',headers:{Origin:config.publicUrl,'Content-Type':'application/json'},body:JSON.stringify({...record,queues:'6',peoplePerDay:'200'})});assert.equal(response.status,201);const {id}=await response.json();assert.ok((await readdir(dir)).some(name=>name.endsWith('-'+id+'.json')));
});
test('configuration defaults to disabled and never silently enables a provider without credentials',()=>{assert.equal(emailConfiguration({}).provider,'disabled');assert.throws(()=>emailConfiguration({EMAIL_PROVIDER:'resend'}),/RESEND_API_KEY/);assert.throws(()=>emailConfiguration({EMAIL_PROVIDER:'unknown'}),/Unsupported/)});
