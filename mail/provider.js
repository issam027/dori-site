/** Provider-independent contract: send(message, { idempotencyKey }) -> { id }. */
export class EmailDeliveryError extends Error {
 constructor(code, retryable = false) { super(code); this.name='EmailDeliveryError';this.code=code;this.retryable=retryable; }
}
export class ResendEmailProvider {
 constructor({apiKey, endpoint='https://api.resend.com/emails', timeoutMs=10000}) {
  this.apiKey=apiKey;this.endpoint=endpoint;this.timeoutMs=timeoutMs;
 }
 async send(message, {idempotencyKey}) {
  let response;
  try {
   response=await fetch(this.endpoint,{method:'POST',headers:{Authorization:'Bearer '+this.apiKey,'Content-Type':'application/json','Idempotency-Key':idempotencyKey},body:JSON.stringify({from:message.from,to:[message.to],subject:message.subject,html:message.html,text:message.text,...(message.replyTo?{reply_to:message.replyTo}:{})}),signal:AbortSignal.timeout(this.timeoutMs),redirect:'error'});
  } catch {throw new EmailDeliveryError('transport_error',true)}
  if(!response.ok)throw new EmailDeliveryError('provider_http_'+response.status,response.status===429||response.status>=500||response.status===408);
  let data;try{data=await response.json()}catch{throw new EmailDeliveryError('invalid_provider_response',true)}
  if(typeof data.id!=='string'||!data.id)throw new EmailDeliveryError('invalid_provider_response',true);
  return {id:data.id};
 }
}
export function emailConfiguration(env={}) {
 const provider=env.EMAIL_PROVIDER||'disabled';
 if(!['disabled','resend'].includes(provider))throw Error('Unsupported EMAIL_PROVIDER');
 const config={provider,apiKey:env.RESEND_API_KEY||'',from:env.EMAIL_FROM||'noreply@dorify.fr',salesTo:env.EMAIL_SALES_TO||'ijoober@gmail.com'};
 for(const key of ['from','salesTo'])if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config[key]))throw Error('Invalid email configuration: '+key);
 if(provider==='resend'&&!config.apiKey)throw Error('RESEND_API_KEY is required');
 return config;
}
export function createEmailProvider(config) {
 if(config.provider==='disabled')return null;
 if(config.provider==='resend')return new ResendEmailProvider({apiKey:config.apiKey});
 throw Error('Unsupported email provider');
}
