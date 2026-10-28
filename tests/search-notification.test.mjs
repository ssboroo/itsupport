import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const script = readFileSync(new URL('../scripts/notify-indexnow.mjs', import.meta.url), 'utf8').replace("import { readFileSync } from 'node:fs';", '').replace('import.meta.url', "'file:///scripts/notify-indexnow.mjs'");
async function run({urls=['https://it.rainy.studio/'],status=200,keyMatches=true,noindex=false}={}) {
 const calls=[];
 const context={readFileSync:()=>'{"key":"testkey"}',URL,AbortSignal,setTimeout,console:{log(){}},process:{env:{},argv:[]},fetch:async(url,options)=>{
   calls.push({url,options});
   if(options?.method==='POST') return {status};
   return {ok:true,text:async()=>url.endsWith('.txt')?(keyMatches?'testkey':'wrong'):url.endsWith('.xml')?'<urlset>'+urls.map(u=>`<url><loc>${u}</loc></url>`).join('')+'</urlset>':noindex?'<meta name="robots" content="noindex, follow">':'<html>public content</html>'};
 }};
 await vm.runInNewContext(`(async()=>{${script}})()`,context);
 return calls;
}
test('submits verified public pages once and accepts pending key validation',async()=>{const calls=await run({status:202});const post=calls.filter(c=>c.options?.method==='POST');assert.equal(post.length,1);assert.deepEqual(JSON.parse(post[0].options.body).urlList,['https://it.rainy.studio/']);});
test('never submits foreign hosts, private paths or empty sitemaps',async()=>{for(const urls of [['https://evil.example/'],['https://it.rainy.studio/admin'],[]])await assert.rejects(run({urls}));});
test('ownership mismatch, noindex pages and upstream errors fail visibly',async()=>{await assert.rejects(run({keyMatches:false}));await assert.rejects(run({noindex:true}));await assert.rejects(run({status:429}));});
