import SupportApp from '../components/support-app';
import { SITE_URL, jsonLd } from '../lib/seo';
export default function Page(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':`${SITE_URL}/#organization`,name:'RAINY IT',url:SITE_URL,logo:`${SITE_URL}/favicon.svg`},{'@type':'WebSite','@id':`${SITE_URL}/#website`,url:SITE_URL,name:'RAINY IT',inLanguage:'mn',publisher:{'@id':`${SITE_URL}/#organization`}}]})}}/><SupportApp/></>}
