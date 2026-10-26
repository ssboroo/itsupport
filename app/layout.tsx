import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'RAINY IT — Зайнаас, хялбархан.',description:'Компьютер засвар, программ суулгалтын онлайн захиалга.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="mn"><body>{children}</body></html>}
