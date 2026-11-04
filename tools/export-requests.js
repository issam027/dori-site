import { readFile,readdir } from 'node:fs/promises';
import { resolve,join } from 'node:path';
const dir=resolve(process.env.DATA_DIR||'data');
const args=process.argv.slice(2);
if(args.some(a=>!['--csv','--json'].includes(a))||args.length>1){console.error('Usage: npm run requests:export -- [--csv|--json]');process.exit(1)}
const days=Number(process.env.REQUEST_RETENTION_DAYS||90),cutoff=Date.now()-days*86400000;
let names;try{names=await readdir(dir)}catch(error){if(error.code==='ENOENT'){console.error('Aucune demande enregistrée.');process.exit(0)}throw error}
const records=[];for(const name of names.sort()){if(!/^\d{13}-[a-f0-9-]{36}\.json$/.test(name)||Number(name.slice(0,13))<cutoff)continue;records.push(JSON.parse(await readFile(join(dir,name),'utf8')))}
if(args.includes('--csv')){
 const fields=['id','createdAt','status','topic','organization','name','email','phone','hosting','sites','message','consent'];
 const cell=v=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
 console.log('\uFEFF'+[fields.map(cell).join(';'),...records.map(r=>fields.map(f=>cell(r[f])).join(';'))].join('\r\n'));
}else console.log(JSON.stringify(records,null,2));

