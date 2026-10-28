import BusinessCallout from '../../../components/business-callout';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services } from '../../../lib/services';
import { SITE_URL, pageMetadata, jsonLd } from '../../../lib/seo';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return services.map(({slug})=>({slug})); }
export async function generateMetadata({params}: Props) { const {slug}=await params; const service=services.find(s=>s.slug===slug); if(!service) notFound(); return pageMetadata(`${service.title} — зайны үйлчилгээ | RAINY IT`,service.description,`/services/${slug}`); }
export default async function ServicePage({params}: Props) {
 const {slug}=await params; const s=services.find(s=>s.slug===slug); if(!s) notFound();
 const url=`${SITE_URL}/services/${s.slug}`;
 const schema={'@context':'https://schema.org','@graph':[{'@type':'Service',name:s.title,description:s.description,url,provider:{'@type':'Organization',name:'RAINY IT',url:SITE_URL},availableChannel:{'@type':'ServiceChannel',serviceUrl:`${SITE_URL}/#services`}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Нүүр',item:SITE_URL},{'@type':'ListItem',position:2,name:'Үйлчилгээ',item:`${SITE_URL}/services`},{'@type':'ListItem',position:3,name:s.title,item:url}]}]};
 return <main className="seo-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(schema)}}/><Link className="seo-brand" href="/">RAINY IT ↗</Link><nav aria-label="Хуудасны зам"><Link href="/">Нүүр</Link> / <Link href="/services">Үйлчилгээ</Link> / {s.title}</nav><p className="seo-kicker">КОМПЬЮТЕРИЙН ЗАЙНЫ ТУСЛАМЖ</p><h1>{s.title}</h1><p className="seo-lead">{s.description}</p><section><h2>Ямар үед хандах вэ?</h2><ul>{s.symptoms.map(t=><li key={t}>{t}</li>)}</ul></section><section><h2>Хэрхэн туслах вэ?</h2><p>{s.details}</p><p className="seo-note">{s.limit}</p></section><section><h2>Үнэ болон холболт</h2><p>Асуудлаа тодруулсны дараа ажлын хүрээ, үнийг тохиролцоно. Таны зөвшөөрлөөр зайнаас холбогдоно. Нууц үг, банкны мэдээллээ чатад илгээх шаардлагагүй. Ажил дууссаны дараа зайны холболтыг хаагаарай.</p></section><Link className="seo-cta" href="/#services">Асуудлаа хэлж, захиалга өгөх →</Link><BusinessCallout/><section><h2>Бусад үйлчилгээ</h2><div className="seo-related">{services.filter(x=>x.slug!==slug).map(x=><Link key={x.slug} href={`/services/${x.slug}`}>{x.title} →</Link>)}</div></section></main>;
}
