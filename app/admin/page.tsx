import {requireChatGPTUser} from '../chatgpt-auth';
import {notFound} from 'next/navigation';
import {env} from 'cloudflare:workers';
import SupportApp from '../../components/support-app';
export const dynamic='force-dynamic';
export default async function Admin(){const user=await requireChatGPTUser('/admin');const email=(env as unknown as Record<string,string>).ADMIN_EMAIL;if(!email||user.email.toLowerCase()!==email.toLowerCase())notFound();return <SupportApp initialView="admin"/>}
