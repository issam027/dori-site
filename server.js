import http from 'node:http';
import { readFile, mkdir, appendFile, readdir, unlink, stat } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { renderPage, pages, escapeHtml } from './site.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const allowedTopics = ['account', 'demo', 'contact'];
const allowedHosting = ['cloud', 'intra', 'undecided'];
const mime = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };

export function configuration(env = process.env) {
  const publicUrl = new URL(env.PUBLIC_URL || `http://localhost:${env.PORT || 18090}`);
  const cloudLogin = new URL(env.CLOUD_LOGIN_URL || 'http://localhost:58080/login');
  if (![publicUrl, cloudLogin].every(u => ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password)) throw new Error('Invalid public URL configuration');
  const retention = Number(env.REQUEST_RETENTION_DAYS || 90);
  if (!Number.isInteger(retention) || retention < 1 || retention > 365) throw new Error('REQUEST_RETENTION_DAYS must be 1–365');
  const email = env.CONTACT_EMAIL || '';
  if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new Error('Invalid CONTACT_EMAIL');
  return { publicUrl: publicUrl.origin, cloudLogin: cloudLogin.href, contactEmail: email,
    legalName: env.LEGAL_NAME || '', legalAddress: env.LEGAL_ADDRESS || '', legalRegistration: env.LEGAL_REGISTRATION || '', hostingProvider: env.HOSTING_PROVIDER || '', retention,
    dataDir: resolve(env.DATA_DIR || join(root, 'data')) };
}

export function validateRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { errors: { form: 'Le formulaire est invalide.' } };
  const errors = {};
  const value = {};
  for (const [key, max, required] of [['name', 100, true], ['organization', 160, true], ['email', 254, true], ['phone', 40, false], ['message', 3000, false]]) {
    if (body[key] !== undefined && typeof body[key] !== 'string') { errors[key] = 'Ce champ doit être du texte.'; continue; }
    value[key] = (body[key] || '').trim();
    if ((required && !value[key]) || value[key].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value[key])) errors[key] = `Renseignez ce champ (${max} caractères maximum).`;
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) errors.email = 'Saisissez une adresse email valide.';
  if (!allowedTopics.includes(body.topic)) errors.topic = 'Choisissez le type de demande.'; else value.topic = body.topic;
  if (!allowedHosting.includes(body.hosting)) errors.hosting = 'Choisissez une préférence d’hébergement.'; else value.hosting = body.hosting;
  if (!['1', '2-5', '6-20', '21+', 'undecided'].includes(body.sites)) errors.sites = 'Choisissez le nombre de sites.'; else value.sites = body.sites;
  if (body.consent !== true) errors.consent = 'Votre accord est nécessaire pour traiter cette demande.';
  value.consent = true;
  return { value, errors };
}

export async function createServer(config = configuration()) {
  await mkdir(config.dataDir, { recursive: true, mode: 0o700 });
  // One immutable file per accepted request: safe across processes; no list endpoint exposes it.
  async function purgeExpired() {
    const cutoff = Date.now() - config.retention * 86400000;
    for (const file of await readdir(config.dataDir)) {
      if (!/^\d{13}-[a-f0-9-]{36}\.json$/.test(file)) continue;
      if (Number(file.slice(0, 13)) < cutoff) await unlink(join(config.dataDir, file)).catch(e => { if (e.code !== 'ENOENT') throw e; });
    }
  }
  await purgeExpired();
  const timer = setInterval(() => purgeExpired().catch(() => console.error('Request retention failed')), 3600000).unref();
  const attempts = new Map();
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    function send(status, body, type = 'application/json; charset=utf-8') { res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(req.method === 'HEAD' ? undefined : (type.startsWith('application/json') ? JSON.stringify(body) : body)); }
    try {
      const url = new URL(req.url, config.publicUrl);
      if (url.pathname === '/healthz' && ['GET', 'HEAD'].includes(req.method)) { await stat(config.dataDir); return send(200, { status: 'ok' }); }
      if (url.pathname === '/api/requests') {
        if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, { message: 'Méthode non autorisée.' }); }
        if (req.headers.origin !== config.publicUrl) return send(403, { message: 'Origine non autorisée.' });
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return send(415, { message: 'Un formulaire JSON est attendu.' });
        const now = Date.now();
        for (const [key, entry] of attempts) if (entry.reset <= now) attempts.delete(key);
        const ip = req.socket.remoteAddress || 'unknown'; // Never trust arbitrary X-Forwarded-For.
        const limit = attempts.get(ip) || { count: 0, reset: now + 15 * 60000 };
        if (limit.count >= 10 || (attempts.size >= 10000 && !attempts.has(ip))) { res.setHeader('Retry-After', '900'); return send(429, { message: 'Trop de demandes. Réessayez dans quelques minutes.' }); }
        limit.count++; attempts.set(ip, limit);
        const buffers = []; let bytes = 0;
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 16384) return send(413, { message: 'Le formulaire est trop volumineux.' }); buffers.push(chunk); }
        let body; try { body = JSON.parse(Buffer.concat(buffers).toString()); } catch { return send(400, { message: 'Le formulaire est invalide.' }); }
        // Honeypot submissions are rejected; never claim an unpersisted request was received.
        if (body?.website) return send(422, { message: 'Le formulaire ne peut pas être envoyé.' });
        const { value, errors } = validateRequest(body);
        if (Object.keys(errors).length) return send(422, { message: 'Vérifiez les champs indiqués.', errors });
        const id = randomUUID(); const createdAt = new Date(now).toISOString();
        await appendFile(join(config.dataDir, `${now}-${id}.json`), JSON.stringify({ id, createdAt, status: 'pending', privacyVersion: '2026-11-04', ...value }) + '\n', { flag: 'wx', mode: 0o600 });
        return send(201, { id, message: 'Votre demande a bien été enregistrée. Notre équipe pourra vous recontacter à l’adresse indiquée.' });
      }
      if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); return send(405, { message: 'Méthode non autorisée.' }); }
      if (url.pathname === '/robots.txt') return send(200, `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${config.publicUrl}/sitemap.xml\n`, 'text/plain; charset=utf-8');
      if (url.pathname === '/sitemap.xml') return send(200, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(p => `<url><loc>${escapeHtml(config.publicUrl + p)}</loc></url>`).join('')}</urlset>`, 'application/xml; charset=utf-8');
      if (url.pathname.startsWith('/assets/')) {
        const asset = resolve(root, 'public', '.' + decodeURIComponent(url.pathname));
        if (!asset.startsWith(join(root, 'public', 'assets') + sep)) return send(404, { message: 'Introuvable.' });
        if (!mime[extname(asset)]) return send(404, { message: 'Introuvable.' });
        try { const content = await readFile(asset); res.writeHead(200, { 'Content-Type': mime[extname(asset)], 'Cache-Control': 'public, max-age=3600' }); return res.end(req.method === 'HEAD' ? undefined : content); } catch (e) { if (e.code !== 'ENOENT' && e.code !== 'EISDIR') throw e; return send(404, { message: 'Introuvable.' }); }
      }
      if (pages[url.pathname]) return send(200, renderPage(url.pathname, config), 'text/html; charset=utf-8');
      return send(404, renderPage('/404', config), 'text/html; charset=utf-8');
    } catch (error) {
      console.error('Site request failed:', error.code || error.name);
      if (!res.headersSent) send(500, { message: 'La demande n’a pas pu être enregistrée. Réessayez plus tard.' }); else res.end();
    }
  });
  server.on('close', () => clearInterval(timer));
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await createServer();
  server.listen(Number(process.env.PORT || 18090), process.env.HOST || '127.0.0.1', () => console.log(`Dorify vitrine : http://localhost:${process.env.PORT || 18090}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000).unref(); });
}
