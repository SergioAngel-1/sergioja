import type { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata, mergeMetadata, generateBreadcrumbSchema, toJsonLd } from '@/shared/seo';
import { defaultSEO, siteConfig } from '@/lib/seo/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
const privacyConfig = mergeMetadata(defaultSEO, {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos personales del sitio web.',
  alternates: { canonical: `${siteConfig.url}/privacy` },
});

export const metadata: Metadata = generateMetadata(privacyConfig, BASE_URL);

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: siteConfig.name, url: siteConfig.url },
    { name: 'Privacidad', url: `${BASE_URL}/privacy` },
  ]);
  return (
    <>
      <Script id="ld-breadcrumb-privacy" type="application/ld+json" strategy="beforeInteractive">
        {toJsonLd(breadcrumb)}
      </Script>
      {children}
    </>
  );
}
