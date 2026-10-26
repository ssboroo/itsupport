import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'RAINY IT — Зайнаас, хялбархан.',description:'Компьютер засвар, программ суулгалтын онлайн захиалга.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="mn" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{var theme=localStorage.getItem('rainy-theme')==='dark'?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch{}`}}/></head><body>{children}</body></html>}
