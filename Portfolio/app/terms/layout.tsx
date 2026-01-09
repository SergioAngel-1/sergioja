import type { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata, mergeMetadata, generateBreadcrumbSchema, toJsonLd } from '@/shared/seo';
import { defaultSEO, siteConfig } from '@/lib/seo/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
const termsConfig = mergeMetadata(defaultSEO, {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso del sitio web y servicios profesionales de desarrollo web.',
  alternates: { canonical: `${siteConfig.url}/terms` },
});

export const metadata: Metadata = generateMetadata(termsConfig, BASE_URL);

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: siteConfig.name, url: siteConfig.url },
    { name: 'Términos y Condiciones', url: `${BASE_URL}/terms` },
  ]);
  return (
    <>
      <Script id="ld-breadcrumb-terms" type="application/ld+json" strategy="beforeInteractive">
        {toJsonLd(breadcrumb)}
      </Script>
      {children}
    </>
  );
}
