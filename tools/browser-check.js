import {createRequire} from 'node:module';
import {mkdir,mkdtemp,rm,readFile,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {createServer,configuration} from '../server.js';
import {createCaptcha} from '../captcha.js';
const require=createRequire(import.meta.url);
const {chromium}=require(require.resolve(process.env.PLAYWRIGHT_MODULE||'playwright',{paths:[process.cwd(),resolve('../dori-web')]}));
const out=resolve('artifacts/screenshots');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];let fixture,dir,baseServer,baseDir;
let base=process.env.SITE_URL;
if(!base){
 baseDir=await mkdtemp(join(tmpdir(),'dorify-browser-base-'));
 baseServer=await createServer(configuration({DATA_DIR:baseDir,CLIENT_URL:'http://localhost:58080'}));
 await new Promise(r=>baseServer.listen(0,'127.0.0.1',r));
 base='http://127.0.0.1:'+baseServer.address().port;
}
try{
 for(const [device,width,height]of [['desktop',1440,1050],['mobile',390,844]]){
  const c=await browser.newContext({viewport:{width,height},locale:'fr-FR',reducedMotion:'reduce'}),p=await c.newPage();
  p.on('pageerror',e=>errors.push(e.message));
  for(const [route,name]of [['/','accueil'],['/solution','solution'],['/fonctionnalites','fonctionnalites'],['/hebergement','hebergement'],['/a-propos','a-propos'],['/demande-compte','demande-compte'],['/contact','contact'],['/confidentialite','confidentialite'],['/mentions-legales','mentions-legales']]){
   const response=await p.goto(base+route);assert.equal(response.status(),200,route);await p.waitForTimeout(200);
   assert.equal(await p.locator('h1').count(),1); assert.ok(!/\p{L}\?\p{L}/u.test(await p.locator('body').innerText()),'Texte mal encodé '+route);
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow '+device+' '+route);
   for(const image of await p.locator('img:visible').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.loading='eager');} await p.waitForFunction(()=>[...document.images].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth>0)); await p.evaluate(()=>scrollTo(0,0));
   await p.screenshot({path:join(out,device+'-'+name+'.png'),fullPage:true});
  }
  await p.goto(base+'/');await p.getByRole('tab',{name:'Rapports',exact:true}).click();await p.getByRole('tabpanel',{name:'Rapports',exact:true}).waitFor({state:'visible'});
  await p.getByRole('tab',{name:'Rapports',exact:true}).press('ArrowRight');assert.equal(await p.getByRole('tab',{name:'Borne d’accueil',exact:true}).getAttribute('aria-selected'),'true');
  await p.getByRole('button',{name:/Agrandir/}).filter({visible:true}).click();await p.locator('dialog').waitFor({state:'visible'});await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').isVisible(),false);
  await p.getByRole('button',{name:'Dorify Intra',exact:true}).click();assert.equal(await p.locator('[data-hosting-title]').innerText(),'Dorify Intra');
  await p.getByText('Faut-il installer un serveur chez nous ?', {exact:true}).click();assert.equal(await p.locator('details[open]').count(),1);
  assert.equal(await p.getByRole('link',{name:'Espace client',exact:true}).getAttribute('href'),'http://localhost:58080/login');
  if(device==='mobile'){await p.getByRole('button',{name:'Ouvrir le menu'}).click();await p.getByRole('navigation',{name:'Navigation principale'}).getByRole('link',{name:'La solution',exact:true}).click();assert.ok(p.url().endsWith('/solution'));}
  await c.close();
 }
 dir=await mkdtemp(join(tmpdir(),'dorify-browser-'));const config=configuration({DATA_DIR:dir,PUBLIC_URL:'http://localhost:18090'});
 fixture=await createServer(config,undefined,createCaptcha({answer:()=> 'ABC234'}));await new Promise(r=>fixture.listen(0,'127.0.0.1',r));config.publicUrl='http://127.0.0.1:'+fixture.address().port;
 const p=await browser.newPage({viewport:{width:1440,height:1050}});
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(config.publicUrl+'/demande-compte?objectif=demo&hebergement=intra');
 assert.equal(await p.locator('[name=topic]:checked').inputValue(),'demo');assert.equal(await p.locator('#hosting').inputValue(),'intra');
 await p.getByRole('button',{name:'Continuer',exact:true}).click();await p.getByRole('button',{name:'Envoyer ma demande'}).click();assert.equal(await p.locator('#error-name').innerText(),'Ce champ est obligatoire.');
 await p.locator('#name').fill('Camille Démonstration');await p.locator('#organization').fill('Organisation Test');await p.locator('#email').fill('camille@example.test');await p.locator('[name=consent]').check();
 await p.locator('#captchaAnswer').fill('ABC234');
 await p.screenshot({path:join(out,'desktop-formulaire-etape-2.png'),fullPage:true});
 await p.getByRole('button',{name:'Envoyer ma demande'}).click();await p.locator('#request-success').waitFor({state:'visible'});
 const files=await readdir(dir);assert.equal(files.length,1);const data=JSON.parse(await readFile(join(dir,files[0]),'utf8'));assert.equal(data.topic,'demo');assert.equal(data.hosting,'intra');assert.equal(data.status,'pending');
 assert.match(data.reference,/^DEMO-\d{10}$/);assert.equal(await p.locator('#request-reference').innerText(),data.reference);assert.equal(await p.locator('#request-id').innerText(),data.id);
 await p.screenshot({path:join(out,'desktop-demande-confirmee.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('9 pages desktop/mobile, navigation, galerie, zoom, FAQ, hébergement et demande persistée : OK. Captures : '+out);
}finally{await browser.close();if(fixture)await new Promise(r=>fixture.close(r));if(baseServer)await new Promise(r=>baseServer.close(r));if(dir)await rm(dir,{recursive:true,force:true});if(baseDir)await rm(baseDir,{recursive:true,force:true});}

