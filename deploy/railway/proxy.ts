import {NextResponse,type NextRequest} from 'next/server';
import {validAdmin} from './lib/railway-auth';
export function proxy(request:NextRequest){const admin=request.nextUrl.pathname.startsWith('/admin')||(['GET','PATCH'].includes(request.method)&&request.nextUrl.pathname==='/api/orders');if(admin&&!validAdmin(request.headers.get('authorization')))return new NextResponse('Удирдлагын хэсэгт нэвтэрнэ үү.',{status:401,headers:{'WWW-Authenticate':'Basic realm="RAINY IT Admin", charset="UTF-8"','Cache-Control':'no-store'}});return NextResponse.next()}
export const config={matcher:['/admin/:path*','/api/orders']};
