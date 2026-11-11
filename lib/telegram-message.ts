export type TelegramOrderMessage = {id:string;kind:'business'|'individual';service:string;phone:string;time:string;tool:string;description:string;created:number;adminUrl:string};
export function formatOrderTelegramMessage(order:TelegramOrderMessage){
 const date=new Date(order.created).toLocaleString('mn-MN',{timeZone:'Asia/Ulaanbaatar',dateStyle:'medium',timeStyle:'short'});
 const type=order.kind==='business'?'🏢 БАЙГУУЛЛАГЫН ХҮСЭЛТ':'🆕 ХУВЬ ХҮНИЙ ЗАХИАЛГА';
 return [type,'━━━━━━━━━━━━━━━━━━','Захиалгын дугаар: '+order.id,'Үйлчилгээ: '+order.service,'Утас: '+order.phone,'Холбогдох цаг: '+order.time,'Холболт: '+order.tool,'Ирсэн: '+date,'','📝 ХҮСЭЛТИЙН ДЭЛГЭРЭНГҮЙ',order.description,'','Удирдлага: '+order.adminUrl].join('\\n');
}
