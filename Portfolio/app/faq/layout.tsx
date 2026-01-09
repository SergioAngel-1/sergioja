import type { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata, mergeMetadata, generateBreadcrumbSchema, toJsonLd } from '@/shared/seo';
import { defaultSEO, siteConfig } from '@/lib/seo/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
const faqConfig = mergeMetadata(defaultSEO, {
  title: 'Preguntas Frecuentes',
  description: 'Encuentra respuestas rápidas a las preguntas más comunes sobre mi trabajo, metodología y servicios de desarrollo Full Stack.',
  alternates: { canonical: `${siteConfig.url}/faq` },
});

export const metadata: Metadata = generateMetadata(faqConfig, BASE_URL);

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: siteConfig.name, url: siteConfig.url },
    { name: 'FAQ', url: `${BASE_URL}/faq` },
  ]);
  return (
    <>
      <Script id="ld-breadcrumb-faq" type="application/ld+json" strategy="beforeInteractive">
        {toJsonLd(breadcrumb)}
      </Script>
      {children}
    </>
  );
}
