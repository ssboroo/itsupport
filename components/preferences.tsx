'use client';
import {Children,cloneElement,createContext,isValidElement,useContext,useEffect,useState,type ReactNode,type ReactElement} from 'react';
import {Moon,Sun,Languages} from 'lucide-react';
import {languages,translate,type Language} from '../lib/translations';
type Preferences={language:Language;theme:'light'|'dark';setLanguage:(v:Language)=>void;toggleTheme:()=>void;t:(s:string)=>string};
const Context=createContext<Preferences>({language:'mn',theme:'light',setLanguage:()=>{},toggleTheme:()=>{},t:s=>s});
export const usePreferences=()=>useContext(Context);
export function PreferencesProvider({children}:{children:ReactNode}){const [language,setLanguage]=useState<Language>('mn'),[theme,Theme]=useState<'light'|'dark'>('light'),[ready,Ready]=useState(false);
useEffect(()=>{try{const l=localStorage.getItem('rainy-language');if(languages.includes(l as Language))setLanguage(l as Language);if(localStorage.getItem('rainy-theme')==='dark')Theme('dark')}catch{}Ready(true)},[]);
useEffect(()=>{if(!ready)return;document.documentElement.dataset.theme=theme;document.documentElement.lang=language;document.title=({mn:'RAINY IT — Зайнаас, хялбархан.',en:'RAINY IT — Remote IT support',ko:'RAINY IT — 원격 컴퓨터 지원',zh:'RAINY IT — 远程电脑支持',ru:'RAINY IT — Удалённая IT помощь'}[language]);document.documentElement.style.colorScheme=theme;try{localStorage.setItem('rainy-language',language);localStorage.setItem('rainy-theme',theme)}catch{}},[theme,language,ready]);
return <Context.Provider value={{language,theme,setLanguage,t:s=>translate(s,language),toggleTheme:()=>Theme(v=>v==='light'?'dark':'light')}}>{children}</Context.Provider>}
export function PreferencesControls(){const {t,language,setLanguage,theme,toggleTheme}=usePreferences();return <div className="preference-controls"><div className="language-control"><Languages size={15}/><select aria-label={t('Хэл')} value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="mn">Монгол</option><option value="en">English</option><option value="ko">한국어</option><option value="zh">中文</option><option value="ru">Русский</option></select></div><button className="theme-toggle" aria-label={t(theme==='light'?'Бараан горим':'Гэрэлтэй горим')} title={t(theme==='light'?'Бараан горим':'Гэрэлтэй горим')} onClick={toggleTheme}>{theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</button></div>}
function localize(node:ReactNode,language:Language):ReactNode{if(typeof node==='string')return translate(node,language);if(Array.isArray(node))return node.map(child=>localize(child,language));if(!isValidElement(node))return node;const element=node as ReactElement<Record<string,unknown>>;const props:Record<string,unknown>={};for(const key of ['placeholder','title','alt','aria-label'])if(typeof element.props[key]==='string')props[key]=translate(element.props[key] as string,language);
// Keep form values in canonical Mongolian while translating the displayed option.
if(element.type==='option'&&element.props.value===undefined&&typeof element.props.children==='string')props.value=element.props.children;
if(element.props.children!==undefined)props.children=Children.map(element.props.children as ReactNode,child=>localize(child,language));return cloneElement(element,props)}
export function Translated({children}:{children:ReactNode}){const {language}=usePreferences();return <>{localize(children,language)}</>}
