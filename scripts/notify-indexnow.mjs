import { readFileSync } from 'node:fs';
const origin = 'https://it.rainy.studio';
const { key } = JSON.parse(readFileSync(new URL('./indexnow-key.json', import.meta.url)));
const expected = process.env.EXPECTED_SHA;
const get = async (url) => { const r = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: 'error' }); if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`); return r.text(); };
// Only notify for a confirmed live release. Never claim an accepted request is indexed.
if (expected) {
  let ready = false;
  for (let attempt = 0; attempt < 20; attempt++) {
    try { ready = (await get(`${origin}/seo-release.txt`)).trim() === expected; } catch {}
    if (ready) break;
    console.log('Waiting for production release', attempt + 1);
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
  if (!ready) throw new Error('Production has not deployed this commit; no URLs submitted. Rerun after deployment.');
}
if ((await get(`${origin}/${key}.txt`)).trim() !== key) throw new Error('IndexNow ownership file mismatch');
const sitemap = await get(`${origin}/sitemap.xml`);
const urlList = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]))];
if (!urlList.length || urlList.length > 10000) throw new Error('Invalid sitemap size');
for (const url of urlList) {
  const parsed = new URL(url);
  if (parsed.origin !== origin || parsed.search || !/^\/(?:business|services(?:\/[a-z-]+)?)?$/.test(parsed.pathname)) throw new Error(`Unexpected sitemap URL: ${url}`);
  const page = await get(url);
  if (/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(page)) throw new Error(`Noindex page: ${url}`);
}
if (process.argv.includes('--dry-run')) { console.log('Verified public URLs (no submission):', urlList); process.exit(0); }
const response = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ host: new URL(origin).host, key, keyLocation: `${origin}/${key}.txt`, urlList }), signal: AbortSignal.timeout(30000) });
if (![200, 202].includes(response.status)) throw new Error(`IndexNow rejected notification: HTTP ${response.status}`);
console.log(`IndexNow HTTP ${response.status}: ${urlList.length} URLs received; crawling and indexing are not guaranteed.`);
