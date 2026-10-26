import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {drizzle} from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';
let database:ReturnType<typeof createDb>|undefined;
function createDb(){
 const path=process.env.SQLITE_PATH||'/data/orders.sqlite';mkdirSync(dirname(path),{recursive:true});
 const sqlite=new DatabaseSync(path);sqlite.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,name TEXT NOT NULL,phone TEXT NOT NULL,service TEXT NOT NULL,description TEXT NOT NULL,time TEXT NOT NULL,tool TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Шинэ',created INTEGER NOT NULL,user_id TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS orders_user_created ON orders(user_id,created);`);
 return drizzle(async(sql,params,method)=>{const stmt=sqlite.prepare(sql);if(method==='run'){stmt.run(...params);return {rows:[]}}const rows=stmt.all(...params).map(row=>Object.values(row));return {rows:method==='get'?(rows[0]||[]):rows}},{schema});
}
export function getDb(){return database??=createDb()}
