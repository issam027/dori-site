import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createServer, configuration } from '../server.js';
import { createCaptcha } from '../captcha.js';

const valid={name:'Camille Test',organization:'Organisation de démonstration',email:'camille@example.test',phone:'',topic:'account',hosting:'cloud',sites:'2-5',message:'Test de demande',consent:true};
async function fixture(t,env={}){
 const dataDir=await mkdtemp(join(tmpdir(),'dorify-site-test-'));
 const c=configuration({...env,DATA_DIR:dataDir,PUBLIC_URL:'http://localhost:18090'});
 const captcha=createCaptcha({answer:()=> 'ABC234'});
 const server=await createServer(c,undefined,captcha);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;c.publicUrl=base;
 t.after(async()=>{await new Promise(resolve=>server.close(resolve));await rm(dataDir,{recursive:true,force:true})});
 const post=(data=valid,options={})=>fetch(base+'/api/requests',{method:'POST',headers:{Origin:base,'Content-Type':'application/json',...options.headers},body:typeof data==='string'?data:JSON.stringify(data && {...data,captchaId:captcha.issue().id,captchaAnswer:'ABC234'})});
 return {base,c,post,dataDir};
}
test('all public pages render as HTML with navigation and security headers',async t=>{
 const {base}=await fixture(t);
 for(const route of ['/','/solution','/fonctionnalites','/hebergement','/a-propos','/contact','/demande-compte','/confidentialite','/mentions-legales']){
  const r=await fetch(base+route);assert.equal(r.status,200,route);assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'none'/);
  const html=await r.text();assert.match(html,/<html lang="fr">/);assert.equal((html.match(/<h1>/g)||[]).length,1);assert.match(html,/http:\/\/localhost:58080\/login/);
 }
 assert.equal((await fetch(base+'/unknown')).status,404);
 assert.equal((await fetch(base+'/assets/site.css')).status,200);
 assert.equal((await fetch(base+'/assets/site.js')).status,200);
 assert.equal((await fetch(base+'/assets/supervision.png')).status,200);
 assert.equal((await fetch(base+'/assets/nonexistent.png')).status,404);
 assert.equal((await fetch(base+'/assets/%2e%2e%2f%2e%2e%2fserver.js')).status,404);
 assert.equal((await fetch(base+'/sitemap.xml')).status,200);
});
test('accepted request is durably persisted with a reference and limited fields',async t=>{
 const {post,dataDir}=await fixture(t);const r=await post({...valid,name:'  Camille Test  ',status:'approved',unknown:'ignored'});
 assert.equal(r.status,201);const body=await r.json();assert.match(body.id,/^[a-f0-9-]{36}$/);
 assert.match(body.reference,/^(?:DEMO|CPT|CTC)-\d{10}$/);
 const files=await readdir(dataDir);assert.equal(files.length,1);const saved=JSON.parse(await readFile(join(dataDir,files[0]),'utf8'));
 assert.equal(saved.id,body.id);assert.equal(saved.reference,body.reference);assert.equal(saved.name,'Camille Test');assert.equal(saved.status,'pending');assert.equal(saved.unknown,undefined);assert.equal(saved.consent,true);
});

test('missing, wrong and reused captcha never persist a request', async t => {
 const {base,dataDir}=await fixture(t);
 const submit=body=>fetch(base+'/api/requests',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({...valid,...body})});
 assert.equal((await submit({})).status,422);
 const challenge=await (await fetch(base+'/api/captcha')).json();
 assert.equal((await submit({captchaId:challenge.id,captchaAnswer:'WRONG1'})).status,422);
 assert.equal((await submit({captchaId:challenge.id,captchaAnswer:'ABC234'})).status,422);
 assert.equal((await readdir(dataDir)).length,0);
 const fresh=await (await fetch(base+'/api/captcha')).json();
 assert.equal((await submit({captchaId:fresh.id,captchaAnswer:'ABC234'})).status,201);
 assert.equal((await submit({captchaId:fresh.id,captchaAnswer:'ABC234'})).status,422);
 assert.equal((await readdir(dataDir)).length,1);
});
test('invalid requests create no records and return field errors',async t=>{
 const {post,dataDir}=await fixture(t);
 for(const data of [{...valid,email:'invalid'},{...valid,consent:false},{...valid,hosting:'other'},{...valid,name:' '},{...valid,message:'x'.repeat(3001)},null]){
  const r=await post(data);assert.equal(r.status,422);assert.ok((await r.json()).errors);
 }assert.equal((await readdir(dataDir)).length,0);
});
test('cross-origin, honeypot, malformed JSON and oversized body are rejected',async t=>{
 const {post,dataDir}=await fixture(t);
 assert.equal((await post(valid,{headers:{Origin:'https://unrelated.example'}})).status,403);
 assert.equal((await post(valid,{headers:{'Content-Type':'text/plain'}})).status,415);
 assert.equal((await post({...valid,website:'spam.example'})).status,422);
 assert.equal((await post('{broken')).status,400);
 assert.equal((await post({message:'x'.repeat(17000)})).status,413);
 assert.equal((await readdir(dataDir)).length,0);
});
test('contact and demo requests use the same persisted workflow',async t=>{
 const {post,dataDir}=await fixture(t);for(const topic of ['contact','demo'])assert.equal((await post({...valid,topic})).status,201);
 const saved=await Promise.all((await readdir(dataDir)).map(async f=>JSON.parse(await readFile(join(dataDir,f),'utf8'))));
 assert.deepEqual(saved.map(r=>r.topic).sort(),['contact','demo']);
});
test('rate limit applies to repeated anonymous submissions',async t=>{
 const {post}=await fixture(t);for(let i=0;i<10;i++)assert.equal((await post({...valid,consent:false})).status,422);
 const r=await post();assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'900');
});
test('expired requests are removed on startup, other files untouched',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'dorify-retention-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const old=String(Date.now()-92*86400000)+'-'+randomUUID()+'.json';await writeFile(join(dir,old),'{}');
 await writeFile(join(dir,'keep.txt'),'safe');
 const s=await createServer(configuration({DATA_DIR:dir,REQUEST_RETENTION_DAYS:'90'}));s.emit('close');
 assert.deepEqual(await readdir(dir),['keep.txt']);
});
test('runtime settings reject unsafe URLs and escape operator details',async t=>{
 assert.throws(()=>configuration({PUBLIC_URL:'javascript:alert(1)'}));assert.throws(()=>configuration({CLOUD_LOGIN_URL:'javascript:alert(1)'}));assert.throws(()=>configuration({REQUEST_RETENTION_DAYS:'0'}));
 const {base}=await fixture(t,{LEGAL_NAME:'<script>alert(1)</script>'});const html=await(await fetch(base+'/mentions-legales')).text();assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>alert(1)</script>'));
});

