import {cpSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const target=join(process.cwd(),'.railway-app');mkdirSync(target,{recursive:true});
for(const dir of ['app','public','db'])cpSync(dir,join(target,dir),{recursive:true});
for(const dir of ['components','lib'])mkdirSync(join(target,dir),{recursive:true});
for(const name of ['support-app','motion-hero','preferences','software-marquee'])cpSync(`components/${name}.tsx`,join(target,`components/${name}.tsx`));
for(const name of ['software','booking-validation','translations'])cpSync(`lib/${name}.ts`,join(target,`lib/${name}.ts`));
for(const [src,dest] of [['db.ts','db/index.ts'],['auth.ts','lib/railway-auth.ts'],['chatgpt-auth.ts','app/chatgpt-auth.ts'],['proxy.ts','proxy.ts']])cpSync(`deploy/railway/${src}`,join(target,dest));
for(const file of ['app/api/config/route.ts','app/api/orders/route.ts','app/admin/page.tsx']){const path=join(target,file);let code=readFileSync(path,'utf8').replace(/import \{env\} from 'cloudflare:workers';/g,'const env={...process.env,ADMIN_EMAIL:process.env.ADMIN_EMAIL||"admin@rainy.studio"};');if(file.includes('orders'))code=code.replace("const sameOrigin=(r:Request)=>r.headers.get('origin')===new URL(r.url).origin;","const sameOrigin=(r:Request)=>r.headers.get('origin')===(process.env.SITE_URL||new URL(r.url).origin);");if(file.includes('admin/page'))code=code.replace(').ADMIN_EMAIL',").ADMIN_EMAIL||'admin@rainy.studio'");if(file.includes('api/config'))code="export const dynamic='force-dynamic';\n"+code;writeFileSync(path,code)}
cpSync('postcss.config.mjs',join(target,'postcss.config.mjs'));
writeFileSync(join(target,'next.config.ts'),`import type {NextConfig} from 'next';const config:NextConfig={output:'standalone',outputFileTracingRoot:process.cwd(),poweredByHeader:false};export default config;\n`);
const ts=JSON.parse(readFileSync('tsconfig.json','utf8'));ts.compilerOptions.types=['node'];ts.exclude=['node_modules'];writeFileSync(join(target,'tsconfig.json'),JSON.stringify(ts,null,2));
const pkg=JSON.parse(readFileSync('package.json','utf8'));writeFileSync(join(target,'package.json'),JSON.stringify({name:'rainy-it-railway',private:true,type:'module',scripts:{build:'next build --webpack',start:'next start -H 0.0.0.0 -p ${PORT:-3000}'},dependencies:pkg.dependencies,devDependencies:{'@tailwindcss/postcss':pkg.devDependencies['@tailwindcss/postcss'],tailwindcss:pkg.devDependencies.tailwindcss,typescript:pkg.devDependencies.typescript,'@types/node':pkg.devDependencies['@types/node'],'@types/react':pkg.devDependencies['@types/react'],'@types/react-dom':pkg.devDependencies['@types/react-dom']}}));
console.log('Railway Node.js application prepared in .railway-app');
