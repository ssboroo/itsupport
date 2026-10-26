import {chatStore} from './chat-store.mjs';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export function telegramApi(token,transport=fetch){return async(method,data={},timeout=10000)=>{
 const response=await transport('https://api.telegram.org/bot'+token+'/'+method,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(timeout)});
 const result=await response.json();if(!response.ok||!result.ok)throw new Error('Telegram API '+(result.error_code||response.status));return result.result;
}}
export async function flushOutbox(store,api,chatId){for(const message of store.pending()){try{const sent=await api('sendMessage',{chat_id:chatId,text:'💬 RAINY IT · Шууд тусламж #'+message.session_id.slice(0,8)+'\n\n'+message.text+'\n\n↩ Энэ мессежид Reply хийж хэрэглэгчид хариулаарай.',reply_markup:{force_reply:true,input_field_placeholder:'Хэрэглэгчид хариу бичих'}});store.delivered(message,chatId,sent.message_id)}catch{store.failed(message.id)}}}
export async function runBridge(){
 const token=process.env.TELEGRAM_BOT_TOKEN,chatId=process.env.TELEGRAM_CHAT_ID;if(!token||!chatId){console.log('Support bridge: Telegram configuration missing');return}
 const store=chatStore(),api=telegramApi(token);let stopping=false;process.on('SIGTERM',()=>{stopping=true});
 await Promise.all([
  (async()=>{while(!stopping){await flushOutbox(store,api,chatId);await delay(2000)}})(),
  (async()=>{while(!stopping){try{
   const info=await api('getWebhookInfo');if(info.url){store.setState('bridge_error','webhook');store.setState('heartbeat',0);console.error('Support bridge: bot has an existing webhook; use a dedicated bot or remove its webhook manually');await delay(30000);continue}
   const updates=await api('getUpdates',{offset:Number(store.getState('offset')||0),timeout:20,allowed_updates:['message']},30000);
   for(const update of updates)store.applyUpdate(update,chatId);store.setState('heartbeat',Date.now());store.setState('bridge_error','');
  }catch{store.setState('bridge_error','connection');console.error('Support bridge: Telegram connection unavailable, retrying');await delay(5000)}}})()
 ]);
}
