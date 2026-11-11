import BusinessCallout from '../../components/business-callout';
import Link from 'next/link';
import { services } from '../../lib/services';
import { pageMetadata } from '../../lib/seo';
export const metadata = pageMetadata('IT тусламж, компьютерийн үйлчилгээ | IT Тусламж by RAINY', 'Windows засвар, программ суулгалт, компьютер хурдлуулах, принтерийн тохиргоо. Үйлчилгээний дэлгэрэнгүй мэдээлэл, боломж болон хязгаар.', '/services');
export default function ServicesPage() { return <main className="seo-page"><Link href="/" className="seo-brand">IT ТУСЛАМЖ by RAINY ↗</Link><p className="seo-kicker">МОНГОЛ ХЭЛЭЭР · ЗАЙНААС</p><h1>Таны IT асуудалд<br/>найдвартай тусламж.</h1><p className="seo-lead">Асуудлаа сонгоод үйлчилгээний боломж, бэлтгэх зүйлсээ үзээрэй. Үнийг ажлын хүрээнээс хамаарч урьдчилан тохиролцоно.</p><BusinessCallout/><div className="seo-grid">{services.map(s=><Link className="seo-card" key={s.slug} href={`/services/${s.slug}`}><h2>{s.title}</h2><p>{s.description}</p><span>Дэлгэрэнгүй →</span></Link>)}</div><p><Link href="/business">Байгууллагын IT үйлчилгээ — үнийн санал авах →</Link></p><Link className="seo-cta" href="/#services">Үйлчилгээ захиалах →</Link></main>; }
