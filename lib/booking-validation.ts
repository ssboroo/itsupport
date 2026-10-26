export const SERVICE_NAMES=['Программ суулгах','Алдаа засвар','Драйвер, принтер','Компьютер хурдлуулах','AI эрх авах','Вэб сайт хийлгэх','Вирусийн хамгаалалт','Программын лиценз авах','Холболтын программ бэлдэх тусламж'];
export const TOOL_NAMES=['Сонгоход тусламж хэрэгтэй','AnyDesk','UltraViewer','Утсаар ярилцаж тохиролцоно','Чатаар мэдээлэл авна','Зайнаас холбогдох шаардлагатай'];
export function normalizePhone(value:unknown){return typeof value==='string'?value.trim().replace(/[\s()-]/g,''):''}
export function isValidPhone(value:unknown){return /^(?:\+[1-9]\d{7,14}|\d{8})$/.test(normalizePhone(value))}
export function validateBooking(body:unknown){
 if(!body||typeof body!=='object'||Array.isArray(body))return {ok:false as const,error:'Хүсэлтийн мэдээлэл буруу байна.'};
 const b=body as Record<string,unknown>;
 if(!isValidPhone(b.phone))return {ok:false as const,error:'8 оронтой дугаар эсвэл улсын кодтой дугаар (+976…) оруулна уу.'};
 if(b.consent!==true)return {ok:false as const,error:'Тантай холбогдох зөвшөөрлийг тэмдэглэнэ үү.'};
 if(typeof b.service!=='string'||!SERVICE_NAMES.includes(b.service))return {ok:false as const,error:'Үйлчилгээгээ сонгоно уу.'};
 if(typeof b.description!=='string'||!b.description.trim()||b.description.length>2000)return {ok:false as const,error:'Хүсэлтээ 2000 тэмдэгтэд багтаан дэлгэрэнгүй бичнэ үү.'};
 if(typeof b.tool!=='string'||!TOOL_NAMES.includes(b.tool))return {ok:false as const,error:'Холбогдох хэлбэрээ сонгоно уу.'};
 if(b.time!==undefined&&(typeof b.time!=='string'||b.time.length>100))return {ok:false as const,error:'Холбогдох цагийг 100 тэмдэгтэд багтаана уу.'};
 return {ok:true as const,data:{phone:normalizePhone(b.phone),service:b.service,description:b.description.trim(),tool:b.tool,time:typeof b.time==='string'&&b.time.trim()?b.time.trim():'Боломжтой үед холбогдох'}};
}
