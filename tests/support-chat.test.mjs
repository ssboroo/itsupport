import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {createChatStore} from '../deploy/railway/chat-store.mjs';import {flushOutbox} from '../deploy/railway/telegram-bridge.mjs';
function fixture(){const dir=mkdtempSync(join(tmpdir(),'rainy-chat-'));return {dir,path:join(dir,'chat.sqlite')}}
test('private sessions, idempotent sends, retry outbox and replies survive restart',async()=>{const f=fixture();let store=createChatStore(f.path);try{
 const a=store.createSession(),b=store.createSession();assert.equal(store.session(a.token).id,a.id);assert.equal(store.session('invalid'),undefined);
 const message=store.addMessage(a.id,'Тусламж хэрэгтэй','request-1','ip-a');store.addMessage(a.id,'Тусламж хэрэгтэй','request-1','ip-a');assert.equal(store.messages(a.id).length,1);assert.equal(store.messages(b.id).length,0);
 await flushOutbox(store,async()=>{throw Error('offline')},'42');assert.equal(store.messages(a.id)[0].delivery,'queued');
 // A later retry sends the durable message and creates an exact Telegram reply mapping.
 const pending={id:message.id,session_id:a.id};store.delivered(pending,'42',900);
 const reply={update_id:50,message:{message_id:901,chat:{id:42},from:{is_bot:false},reply_to_message:{message_id:900},text:'Сайн байна уу, ямар алдаа гарсан бэ?'}};
 assert.equal(store.applyUpdate({...reply,update_id:48,message:{...reply.message,chat:{id:99}}},'42'),false);
 assert.equal(store.applyUpdate({...reply,update_id:49,message:{...reply.message,reply_to_message:{message_id:123}}},'42'),false);
 assert.equal(store.applyUpdate(reply,'42'),true);assert.equal(store.applyUpdate(reply,'42'),false);assert.equal(store.messages(a.id).length,2);assert.equal(store.messages(b.id).length,0);
 assert.equal(store.applyUpdate({update_id:51,message:{...reply.message,message_id:902,reply_to_message:{message_id:901},text:'Нэмэлт хариу'}},'42'),true);
 store.close();store=createChatStore(f.path);assert.equal(store.session(a.token).id,a.id);assert.equal(store.messages(a.id).at(-1).text,'Нэмэлт хариу');assert.equal(Number(store.getState('offset')),52);
 }finally{store.close();rmSync(f.dir,{recursive:true,force:true})}});
test('outbox uses Telegram reply prompt and does not mark failed sends as delivered',async()=>{const f=fixture(),store=createChatStore(f.path);try{const a=store.createSession();store.addMessage(a.id,'Test','id-1','ip-a');let calls=0;await flushOutbox(store,async(method,data)=>{calls++;assert.equal(method,'sendMessage');assert.equal(data.chat_id,'42');assert.equal(data.reply_markup.force_reply,true);assert.ok(data.text.includes(a.id.slice(0,8)));return {message_id:700}},'42');assert.equal(calls,1);assert.equal(store.pending().length,0);assert.equal(store.messages(a.id)[0].delivery,'sent')}finally{store.close();rmSync(f.dir,{recursive:true,force:true})}});
test('per-client throttling also applies across separate sessions',()=>{const f=fixture(),store=createChatStore(f.path);try{const a=store.createSession(),b=store.createSession();for(let i=0;i<5;i++)assert.ok(store.addMessage(a.id,'Hello','id-'+i,'same-ip').id);assert.equal(store.addMessage(b.id,'Hello','sixth','same-ip').limited,true);assert.ok(store.addMessage(b.id,'Hello','other','different-ip').id)}finally{store.close();rmSync(f.dir,{recursive:true,force:true})}});
