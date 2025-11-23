import type { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata, mergeMetadata, generateBreadcrumbSchema, toJsonLd } from '@/shared/seo';
import { defaultSEO, siteConfig } from '@/lib/seo/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
const aboutConfig = mergeMetadata(defaultSEO, {
  title: 'Sobre Mí',
  description: 'Conoce más sobre mi experiencia profesional, habilidades técnicas y trayectoria como desarrollador Full Stack.',
  alternates: { canonical: `${siteConfig.url}/about` },
});

export const metadata: Metadata = generateMetadata(aboutConfig, BASE_URL);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: siteConfig.name, url: siteConfig.url },
    { name: 'Sobre Mí', url: `${BASE_URL}/about` },
  ]);
  return (
    <>
      <Script id="ld-breadcrumb-about" type="application/ld+json" strategy="beforeInteractive">
        {toJsonLd(breadcrumb)}
      </Script>
      {children}
    </>
  );
}
