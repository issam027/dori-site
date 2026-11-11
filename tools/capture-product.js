import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(require.resolve('playwright',{paths:[resolve('../dori-web')]}));
const base=process.env.APP_URL||'http://localhost:58080';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'fr-FR',reducedMotion:'reduce'});
const page=await context.newPage();
await mkdir('artifacts/product',{recursive:true});
try {
 await page.goto(base+'/login');
 console.log('Login controls:',JSON.stringify(await page.locator('input').evaluateAll(items=>items.map(i=>({name:i.name,type:i.type})))));
 await page.locator('input[name=username]').fill(process.env.CAPTURE_USERNAME||'tn_cloud01_manager');
 await page.locator('input[type=password]').fill(process.env.CAPTURE_PASSWORD||'DemoTn@2026!');
 const loginResponse=page.waitForResponse(r=>r.url().endsWith('/api/v1/auth/login')&&r.request().method()==='POST');
 await page.locator('button[type=submit]').click();
 const login=await (await loginResponse).json();
 await page.waitForURL(url=>!url.pathname.includes('login'));
 await page.waitForTimeout(1800);
 console.log('Authenticated route:',new URL(page.url()).pathname);
 if(process.env.PREPARE_ACTIVITY==='true'){
  const headers={Authorization:'Bearer '+login.data.accessToken};
  const queues=await (await context.request.get(base+'/api/v1/queues?pageSize=100&isActive=true',{headers})).json();
  for(const queue of queues.data.items.slice(0,3)){
   const opened=await context.request.post(base+'/api/v1/queues/'+queue.queueId+'/sessions',{headers,data:{mode:'active',threadNumber:1,counterName:'Guichet accueil'}});
   if(opened.ok()){
    const called=await context.request.post(base+'/api/v1/queues/'+queue.queueId+'/next',{headers});
    if(!called.ok())throw Error('Cannot prepare active ticket: '+called.status());
   }
  }
 }
 for(const [route,name] of [['/reports','rapports'],['/control-room','supervision'],['/desk','cockpit-guichet'],['/appointments','rendez-vous'],['/my-queues','gestion-files'],['/kiosk','borne'],['/display','ecran-affichage'],['/portfolio','multi-site'],['/audit','audit-securite']]) {
  await page.goto(base+route);await page.waitForTimeout(1800);
  await page.locator('.dorify-loader').waitFor({state:'hidden'}).catch(()=>{});
  const text=await page.locator('body').innerText();
  await writeFile('artifacts/product/'+name+'.txt',text);
  if(route==='/reports'){
   const dates=page.locator('input[type=date]');
   await dates.nth(0).fill('2026-10-20');await dates.nth(1).fill('2026-10-31');
   await page.evaluate(()=>document.activeElement?.blur());
   await page.waitForTimeout(2000);
   const values=await page.locator('.metric-value').allTextContents();
   if(!values.some(v=>/[1-9]/.test(v)))throw Error('Report has no nonzero indicators: '+values.join(','));
   console.log('Report metrics:',values.join(' | '));
  }
  await page.screenshot({path:resolve('public/assets/'+name+'.png'),fullPage:false});
  console.log('Captured',route);
 }
} finally {await browser.close();}
