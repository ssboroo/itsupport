import {NextRequest,NextResponse} from 'next/server';
import {createHmac} from 'node:crypto';
import {chatStore} from '../../../../lib/chat-store.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
const cookieName='rainy_support';
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});
export async function GET(r:NextRequest){try{
 const store=chatStore();const session=store.session(r.cookies.get(cookieName)?.value);const after=Number(r.nextUrl.searchParams.get('after')||0);if(!Number.isSafeInteger(after)||after<0)return json({error:'Хүсэлт буруу байна.'},400);
 return json({configured:!!(process.env.TELEGRAM_BOT_TOKEN&&process.env.TELEGRAM_CHAT_ID),connected:Date.now()-Number(store.getState('heartbeat')||0)<90000,messages:session?store.messages(session.id,after):[],reference:session?.id.slice(0,8)||null});
}catch{return json({error:'Чат ачаалах боломжгүй байна.'},503)}}
export async function POST(r:NextRequest){
 const allowed=[process.env.SITE_URL,process.env.RAILWAY_PUBLIC_DOMAIN?'https://'+process.env.RAILWAY_PUBLIC_DOMAIN:null];if(!process.env.RAILWAY_ENVIRONMENT_ID)allowed.push(new URL(r.url).origin);if(!allowed.includes(r.headers.get('origin')))return json({error:'Эрхгүй хүсэлт.'},403);
 if(!process.env.TELEGRAM_BOT_TOKEN||!process.env.TELEGRAM_CHAT_ID)return json({error:'Шууд тусламжийн холболт тохируулагдаж байна.'},503);
 let body;try{const raw=await r.text();if(raw.length>10000)return json({error:'Мессеж хэт урт байна.'},413);body=JSON.parse(raw)}catch{return json({error:'Мессежийн мэдээлэл буруу байна.'},400)}
 if(!body||typeof body.text!=='string'||!body.text.trim()||body.text.trim().length>2000||typeof body.clientId!=='string'||!/^[a-f0-9-]{36}$/i.test(body.clientId))return json({error:'1–2000 тэмдэгттэй мессеж бичнэ үү.'},400);
 try{const store=chatStore();let session=store.session(r.cookies.get(cookieName)?.value);let token:string|undefined;if(!session){const created=store.createSession();session={id:created.id};token=created.token}
 const fingerprint=createHmac('sha256',process.env.BOOKING_ID_SECRET||process.env.ADMIN_PASSWORD||'local').update(r.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown').digest('hex');
 const result=store.addMessage(session.id,body.text.trim(),body.clientId,fingerprint);if(result.limited)return json({error:'Түр хүлээгээд дахин илгээнэ үү.'},429);
 const response=json({ok:true,messages:store.messages(session.id),reference:session.id.slice(0,8)},201);if(token)response.cookies.set(cookieName,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api/support',maxAge:2592000});return response;
 }catch{return json({error:'Мессежийг хадгалж чадсангүй. Дахин оролдоно уу.'},503)}
}
