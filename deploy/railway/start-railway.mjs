import {spawn} from 'node:child_process';
import {runBridge} from './lib/telegram-bridge.mjs';
const server=spawn(process.execPath,['server.js'],{stdio:'inherit',env:process.env});
let shuttingDown=false;
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{if(!shuttingDown){shuttingDown=true;server.kill(signal);setTimeout(()=>process.exit(0),8000).unref()}});
server.on('exit',code=>process.exit(code??1));
runBridge().catch(()=>{console.error('Support bridge failed to start');server.kill('SIGTERM');process.exitCode=1});
