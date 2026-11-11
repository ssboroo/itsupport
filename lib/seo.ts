import type { Metadata } from 'next';
export const SITE_URL = 'https://it.rainy.studio';
export const SITE_TITLE = 'RAINY IT Тусламж | Компьютер, кибер аюулгүй байдал, IT үйлчилгээ';
export const SITE_DESCRIPTION = 'RAINY IT Тусламж — компьютер, Mac, сүлжээ, кибер аюулгүй байдал, программ, өгөгдөл сэргээх болон байгууллагын IT үйлчилгээ. Монгол хэлээр хүсэлтээ шууд илгээгээрэй.';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = SITE_URL + path;
  return { title: { absolute: title }, description, alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'mn_MN', siteName: 'IT Тусламж by RAINY', title, description, url,
      images: [{ url: `${SITE_URL}/social/rainy-it.png`, width: 1200, height: 630, alt: 'IT Тусламж by RAINY — Таны IT асуудлыг бид шийднэ' }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/social/rainy-it.png`] } };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
