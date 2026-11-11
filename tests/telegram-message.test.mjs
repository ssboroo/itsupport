import test from 'node:test';
import assert from 'node:assert/strict';
import { formatOrderTelegramMessage } from '../lib/telegram-message.ts';

test('Telegram order notification includes all actionable customer details',()=>{
 const message=formatOrderTelegramMessage({id:'order-123',kind:'individual',service:'Өгөгдөл сэргээх, нөөцлөлт',phone:'+97699112233',time:'Маргааш 18:00',tool:'AnyDesk',description:'USB диск RAW болсон.',created:Date.UTC(2026,10,11,12,0),adminUrl:'https://it.rainy.studio/admin'});
 for(const value of ['ХУВЬ ХҮНИЙ ЗАХИАЛГА','order-123','Өгөгдөл сэргээх, нөөцлөлт','+97699112233','Маргааш 18:00','AnyDesk','USB диск RAW болсон.','https://it.rainy.studio/admin']) assert.ok(message.includes(value),value);
 assert.ok(message.includes('\n'));
});

test('Telegram business notification is clearly labelled',()=>{
 const message=formatOrderTelegramMessage({id:'business-456',kind:'business',service:'Байгууллагын IT үйлчилгээ',phone:'99112233',time:'Боломжтой үед',tool:'Утсаар ярилцаж тохиролцоно',description:'Байгууллага: Тест ХХК',created:Date.UTC(2026,10,11,12,0),adminUrl:'https://it.rainy.studio/admin'});
 assert.ok(message.startsWith('🏢 БАЙГУУЛЛАГЫН ХҮСЭЛТ'));
 assert.ok(message.includes('Тест ХХК'));
});
