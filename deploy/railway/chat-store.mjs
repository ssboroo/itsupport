import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
export const hashToken=value=>createHash('sha256').update(value).digest('hex');
export function createChatStore(path=process.env.SQLITE_PATH||'/data/orders.sqlite'){
 mkdirSync(dirname(path),{recursive:true});const db=new DatabaseSync(path);db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS support_sessions(id TEXT PRIMARY KEY,token_hash TEXT UNIQUE NOT NULL,created INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS support_messages(id INTEGER PRIMARY KEY AUTOINCREMENT,session_id TEXT NOT NULL,role TEXT NOT NULL,text TEXT NOT NULL,created INTEGER NOT NULL,client_id TEXT, fingerprint TEXT,delivery TEXT NOT NULL DEFAULT 'queued',attempts INTEGER NOT NULL DEFAULT 0,next_attempt INTEGER NOT NULL DEFAULT 0,UNIQUE(session_id,client_id));
 CREATE INDEX IF NOT EXISTS support_session_messages ON support_messages(session_id,id);
 CREATE INDEX IF NOT EXISTS support_rate ON support_messages(fingerprint,created);
 CREATE TABLE IF NOT EXISTS support_telegram_links(chat_id TEXT NOT NULL,message_id INTEGER NOT NULL,session_id TEXT NOT NULL,PRIMARY KEY(chat_id,message_id));
 CREATE TABLE IF NOT EXISTS support_updates(update_id INTEGER PRIMARY KEY);
 CREATE TABLE IF NOT EXISTS support_state(key TEXT PRIMARY KEY,value TEXT NOT NULL);`);
 const statement=sql=>db.prepare(sql);
 return {
  close:()=>db.close(),
  session(token){return typeof token==='string'&&/^[a-f0-9]{64}$/.test(token)?statement('SELECT id FROM support_sessions WHERE token_hash=?').get(hashToken(token)):undefined},
  createSession(){const token=randomBytes(32).toString('hex'),id=randomUUID();statement('INSERT INTO support_sessions VALUES(?,?,?)').run(id,hashToken(token),Date.now());return {id,token}},
  messages(id,after=0){return after?statement('SELECT id,role,text,created,delivery FROM support_messages WHERE session_id=? AND id>? ORDER BY id LIMIT 200').all(id,after):statement('SELECT id,role,text,created,delivery FROM support_messages WHERE session_id=? ORDER BY id DESC LIMIT 200').all(id).reverse()},
  addMessage(sessionId,text,clientId,fingerprint){
   db.exec('BEGIN IMMEDIATE');try{
    const duplicate=statement('SELECT id FROM support_messages WHERE session_id=? AND client_id=?').get(sessionId,clientId);if(duplicate){db.exec('COMMIT');return {id:duplicate.id,duplicate:true}}
    const now=Date.now();const counts=statement("SELECT COUNT(*) AS daily,SUM(CASE WHEN created>? THEN 1 ELSE 0 END) AS recent FROM support_messages WHERE role='visitor' AND fingerprint=? AND created>?").get(now-60000,fingerprint,now-86400000);
    if(counts.recent>=5||counts.daily>=100){db.exec('ROLLBACK');return {limited:true}}
    const result=statement("INSERT INTO support_messages(session_id,role,text,created,client_id,fingerprint) VALUES(?,'visitor',?,?,?,?)").run(sessionId,text,now,clientId,fingerprint);db.exec('COMMIT');return {id:Number(result.lastInsertRowid)};
   }catch(e){db.exec('ROLLBACK');throw e}
  },
  pending(){return statement("SELECT id,session_id,text,attempts FROM support_messages WHERE role='visitor' AND delivery='queued' AND next_attempt<=? ORDER BY id LIMIT 10").all(Date.now())},
  delivered(message,chatId,telegramId){db.exec('BEGIN IMMEDIATE');try{statement('INSERT OR REPLACE INTO support_telegram_links VALUES(?,?,?)').run(String(chatId),telegramId,message.session_id);statement("UPDATE support_messages SET delivery='sent' WHERE id=?").run(message.id);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}},
  failed(id){statement("UPDATE support_messages SET attempts=attempts+1,next_attempt=?+MIN(300000,5000*(1 << MIN(attempts,6))) WHERE id=?").run(Date.now(),id)},
  applyUpdate(update,allowedChat){
   db.exec('BEGIN IMMEDIATE');try{
    const seen=statement('INSERT OR IGNORE INTO support_updates VALUES(?)').run(update.update_id);let accepted=false;
    const m=update.message;
    if(seen.changes&&m&&!m.from?.is_bot&&String(m.chat?.id)===String(allowedChat)&&typeof m.text==='string'&&m.text.trim()&&m.reply_to_message){
     const link=statement('SELECT session_id FROM support_telegram_links WHERE chat_id=? AND message_id=?').get(String(allowedChat),m.reply_to_message.message_id);
     if(link){statement("INSERT INTO support_messages(session_id,role,text,created,delivery) VALUES(?,'operator',?,?,'sent')").run(link.session_id,m.text.trim().slice(0,4096),Date.now());statement('INSERT OR REPLACE INTO support_telegram_links VALUES(?,?,?)').run(String(allowedChat),m.message_id,link.session_id);accepted=true}
    }
    statement("INSERT INTO support_state VALUES('offset',?) ON CONFLICT(key) DO UPDATE SET value=MAX(CAST(value AS INTEGER),CAST(excluded.value AS INTEGER))").run(String(update.update_id+1));db.exec('COMMIT');return accepted;
   }catch(e){db.exec('ROLLBACK');throw e}
  },
  getState(key){return statement('SELECT value FROM support_state WHERE key=?').get(key)?.value},
  setState(key,value){statement('INSERT INTO support_state VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,String(value))}
 };
}
let singleton;
export function chatStore(){return singleton??=createChatStore()}
