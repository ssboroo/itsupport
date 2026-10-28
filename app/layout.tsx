import type {Metadata} from 'next';
import { pageMetadata, SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '../lib/seo';
import './globals.css';
export const metadata: Metadata = {
  ...pageMetadata(SITE_TITLE, SITE_DESCRIPTION, '/'), metadataBase: new URL(SITE_URL),
  icons: { icon: '/favicon.svg' },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION, other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="mn" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{var theme=localStorage.getItem('rainy-theme')==='dark'?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch{}`}}/></head><body>{children}</body></html>}
