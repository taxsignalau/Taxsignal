// TaxSignal prerender — makes pages appear instantly and readable without JavaScript.
// For each page it loads the live render in a headless browser, copies the finished HTML
// into the page's <div id="ts-pre"> block, and saves the file. The real page takes over
// within a fraction of a second; the copy is removed automatically.
//
// Run from the repo root:   npm i -D playwright@1.49.1 && npx playwright install chromium && node tools/prerender.mjs
// (The GitHub Action in .github/workflows/prerender.yml runs this on every push.)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve(process.argv[2] || '.');
const PAGES = [
  ['index.html', '/'],
  ['TaxSignal Landing.dc.html', '/'],
  ['Knowledge.dc.html', '/knowledge'],
  ['Updates.dc.html', '/updates'],
  ['Calculators.dc.html', '/calculators'],
  ['KeyDates.dc.html', '/key-dates'],
  ['About.dc.html', '/about'],
];
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  const rw = vercel.rewrites.find(r => r.source === p);
  if (rw) p = rw.destination;
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;
// The snapshot must never contain this temporary local address (it changes every run and is
// meaningless to visitors), so any page that prints its own URL gets the live site's address instead.
const SITE = 'https://taxsignal.com.au';
const toLive = s => s.split(base).join(SITE).split(encodeURIComponent(base)).join(encodeURIComponent(SITE));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await ctx.addInitScript(() => { try { localStorage.setItem('ts_consent', '{"analytics":false}'); } catch (e) {} });
const page = await ctx.newPage();
const START = '<!--ts-pre-->', END = '<!--/ts-pre-->';

for (const [file, route] of PAGES) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) continue;
  let src = fs.readFileSync(fp, 'utf8');
  if (!src.includes(START)) { console.log('skip (no ts-pre block):', file); continue; }
  // render from a copy with an empty block, so we never snapshot an old snapshot
  await page.goto(base + route, { waitUntil: 'load' });
  await page.waitForFunction(() => { const r = document.getElementById('dc-root'); return r && r.querySelector('.mast') && r.querySelector('main, section'); }, { timeout: 30000 });
  await page.waitForTimeout(700);
  const html = await page.evaluate(() => {
    const root = document.getElementById('dc-root').cloneNode(true);
    root.querySelectorAll('[data-reveal]').forEach(el => { el.style.opacity = ''; el.style.transform = ''; el.style.transition = ''; });
    root.querySelectorAll('script').forEach(el => el.remove());
    root.querySelectorAll('[data-static-ticker]').forEach(el => { el.innerHTML = ''; });
    return root.innerHTML;
  });
  const i = src.indexOf(START) + START.length, j = src.indexOf(END);
  src = src.slice(0, i) + toLive(html).replace(/\n{2,}/g, '\n') + src.slice(j);
  fs.writeFileSync(fp, src);
  console.log('prerendered', file, (html.length / 1024).toFixed(0) + ' KB');
}
await browser.close();
server.close();
