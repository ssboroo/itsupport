import {createHash,timingSafeEqual} from 'node:crypto';
export function validAdmin(header:string|null){
 if(!process.env.ADMIN_PASSWORD||!header?.startsWith('Basic '))return false;
 try{const actual=Buffer.from(header.slice(6),'base64');const expected=Buffer.from((process.env.ADMIN_USERNAME||'rainy')+':'+process.env.ADMIN_PASSWORD);return actual.length===expected.length&&timingSafeEqual(actual,expected)}catch{return false}
}
export function bookingIdentity(ip:string,agent:string){return createHash('sha256').update((process.env.BOOKING_ID_SECRET||process.env.ADMIN_PASSWORD||'local-development')+'\n'+ip+'\n'+agent).digest('hex')}
