import {headers} from 'next/headers';
import {validAdmin,bookingIdentity} from '../lib/railway-auth';
export type ChatGPTUser={userId:string;displayName:string;email:string;fullName:string|null};
export async function getChatGPTUser():Promise<ChatGPTUser>{const h=await headers();if(validAdmin(h.get('authorization')))return {userId:'admin',displayName:'RAINY',email:process.env.ADMIN_EMAIL||'admin@rainy.studio',fullName:null};return {userId:bookingIdentity(h.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown',h.get('user-agent')||''),displayName:'Visitor',email:'',fullName:null}}
export async function requireChatGPTUser(_returnTo:string){return getChatGPTUser()}
