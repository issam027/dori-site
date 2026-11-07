'use strict';
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
function closeMenu() { menu?.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', 'Ouvrir le menu'); }
menuButton?.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu'); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if(e.matches)closeMenu(); });

document.querySelectorAll('[data-showcase]').forEach(showcase => {
 const tabs = [...showcase.querySelectorAll('[role=tab]')];
 function select(tab) { tabs.forEach(t => { const on=t===tab; t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on; }); }
 tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => select(tab));
  tab.addEventListener('keydown', event => { let i; if(event.key==='ArrowRight')i=(index+1)%tabs.length;else if(event.key==='ArrowLeft')i=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')i=0;else if(event.key==='End')i=tabs.length-1;else return;event.preventDefault();select(tabs[i]);tabs[i].focus(); });
 });
});
const dialog=document.querySelector('#image-dialog');let zoomTrigger;
document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
 zoomTrigger=button;const image=dialog.querySelector('img');image.src=button.dataset.zoom;image.alt=button.dataset.caption;dialog.showModal();
}));
dialog?.querySelector('[data-close-dialog]').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>zoomTrigger?.focus());
document.querySelectorAll('[data-hosting]').forEach(button=>button.addEventListener('click',()=>{
 const mode=button.dataset.hosting;document.querySelectorAll('[data-hosting]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelectorAll('[data-hosting-panel]').forEach(p=>p.hidden=p.dataset.hostingPanel!==mode);
 document.querySelector('[data-hosting-title]').textContent=mode==='cloud'?'Dorify Cloud':'Dorify Intra';
 document.querySelector('[data-hosting-subtitle]').textContent=mode==='cloud'?'Application & données hébergées':'Application & base métier locales';
 const matchingIcon=button.querySelector('svg').cloneNode(true);document.querySelector('[data-hosting-icon]').replaceChildren(matchingIcon);
}));
const form=document.querySelector('#request-form');
if(form){
 const query=new URLSearchParams(location.search);
 if(query.get('objectif')==='demo')form.querySelector('[name=topic][value=demo]').checked=true;
 if(['cloud','intra'].includes(query.get('hebergement')))form.elements.hosting.value=query.get('hebergement');
 const feedback=form.querySelector('.form-feedback'),submit=form.querySelector('[type=submit]'),submitLabel=form.querySelector('[data-submit-label]');
 let pending=false;
 function step(n){form.querySelectorAll('[data-form-step]').forEach(s=>s.hidden=s.dataset.formStep!==String(n));form.querySelectorAll('[data-step-indicator]').forEach(s=>s.classList.toggle('active',s.dataset.stepIndicator===String(n)));const h=form.querySelector('[data-form-step="'+n+'"] h2');h.tabIndex=-1;h.focus({preventScroll:true});if(matchMedia('(max-width:720px)').matches)form.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
 function error(name,text){const output=document.getElementById('error-'+name);if(output)output.textContent=text;const control=form.elements.namedItem(name);if(control instanceof HTMLElement)control.setAttribute('aria-invalid',String(Boolean(text)));}
 form.querySelector('.form-next').addEventListener('click',()=>step(2));
 form.querySelector('.back-button').addEventListener('click',()=>{if(!pending)step(1)});
 for(const name of ['name','organization','email','phone','message','consent'])form.elements[name].addEventListener('input',()=>error(name,''));
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending)return;feedback.textContent='';
  const data=Object.fromEntries(new FormData(form).entries());data.consent=form.elements.consent.checked;
  let invalid;
  for(const name of ['name','organization','email','consent']){
   const control=form.elements[name];let text='';
   if(name==='consent'&&!control.checked)text='Votre accord est nécessaire pour traiter votre demande.';
   else if(name!=='consent'&&!control.value.trim())text='Ce champ est obligatoire.';
   else if(name==='email'&&!control.validity.valid)text='Saisissez une adresse email valide.';
   error(name,text);if(text&&!invalid)invalid=control;
  }
  if(invalid){invalid.focus();return;}
  pending=true;submit.disabled=true;form.querySelector('.back-button').disabled=true;submitLabel.textContent='Envoi en cours…';form.setAttribute('aria-busy','true');
  try{
   const response=await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
   const result=await response.json();
   if(!response.ok){if(result.errors){for(const [name,text]of Object.entries(result.errors))error(name,text);const first=Object.keys(result.errors)[0];if(['topic','hosting','sites','queues','peoplePerDay'].includes(first))step(1);else if(form.elements[first]?.focus)form.elements[first].focus();}throw Error(result.message||'L’envoi a échoué. Réessayez.');}
   const ref=result.reference||result.id;const refEl=document.querySelector('#request-reference');if(refEl)refEl.textContent=ref;const idEl=document.querySelector('#request-id');if(idEl)idEl.textContent=result.id;form.hidden=true;const success=document.querySelector('#request-success');success.hidden=false;success.focus();form.reset();
  }catch(error){feedback.textContent=error.name==='TimeoutError'?'La réponse tarde à arriver. Votre demande a peut-être été reçue ; attendez un moment avant de réessayer.':error instanceof TypeError?'La connexion n’a pas abouti. Vérifiez votre réseau et réessayez.':error.message;feedback.focus();}
  finally{pending=false;submit.disabled=false;form.querySelector('.back-button').disabled=false;submitLabel.textContent='Envoyer ma demande';form.removeAttribute('aria-busy');}
 });
}

