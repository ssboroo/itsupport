import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const app = await readFile(new URL('../components/support-app.tsx', import.meta.url), 'utf8');
const brand = await readFile(new URL('../app/brand-refresh.css', import.meta.url), 'utf8');
const globalCss = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
const favicon = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8');
const logo = await readFile(new URL('../public/rainy-it-logo.svg', import.meta.url), 'utf8');
test('new RAINY brand identity and type system are loaded globally',()=>{
 assert.match(globalCss,/@import '\.\/brand-refresh\.css'/);
 assert.match(globalCss,/Plus\+Jakarta\+Sans/);
 assert.match(brand,/--rainy-lime:#d5f36b/);
 assert.match(brand,/\.rainy-symbol/);
 assert.match(favicon,/#142B28/);
 assert.match(logo,/RAINY/);
});
test('homepage includes a direct order form in the first hero section',()=>{
 assert.match(app,/className="hero-order-panel"/);
 assert.match(app,/className="quick-order-form" onSubmit=\{submit\}/);
 for(const field of ['name="service"','name="description"','name="phone"','name="time"','name="consent"']) assert.ok(app.includes(field),'Missing direct order field: '+field);
 assert.match(app,/Үнэгүй хүсэлт илгээх/);
 assert.match(app,/V\('book'\);T\(4\)/);
});
test('direct order keeps the existing server-side order API and customer consent',()=>{
 assert.match(app,/fetch\('\/api\/orders'/);
 assert.match(app,/Миний хүсэлтийн талаар утсаар холбогдохыг зөвшөөрч байна/);
 assert.match(brand,/@media\(max-width:800px\)/);
 assert.match(brand,/@media\(max-width:520px\)/);
 assert.match(brand,/prefers-reduced-motion:reduce/);
});
