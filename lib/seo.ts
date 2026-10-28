import type { Metadata } from 'next';
export const SITE_URL = 'https://it.rainy.studio';
export const SITE_TITLE = 'Компьютерийн зайны засвар, программ суулгалт | RAINY IT';
export const SITE_DESCRIPTION = 'Windows алдаа засвар, программ суулгалт, компьютер хурдлуулах, принтер тохируулах зайны үйлчилгээ. Монгол хэлээр зөвлөгөө авч, онлайнаар захиалаарай.';
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = SITE_URL + path;
  return { title: { absolute: title }, description, alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'mn_MN', siteName: 'RAINY IT', title, description, url,
      images: [{ url: `${SITE_URL}/social/rainy-it.png`, width: 1200, height: 630, alt: 'RAINY IT — Компьютерийн асуудлаа гэрээсээ шийдүүлээрэй' }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/social/rainy-it.png`] } };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
