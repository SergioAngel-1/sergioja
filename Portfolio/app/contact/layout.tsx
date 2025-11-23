import type { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata, mergeMetadata, generateBreadcrumbSchema, toJsonLd } from '@/shared/seo';
import { defaultSEO, siteConfig } from '@/lib/seo/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
const contactConfig = mergeMetadata(defaultSEO, {
  title: 'Contacto',
  description: '¿Tienes un proyecto en mente? Contáctame para discutir cómo puedo ayudarte a hacerlo realidad.',
  alternates: { canonical: `${siteConfig.url}/contact` },
});

export const metadata: Metadata = generateMetadata(contactConfig, BASE_URL);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: siteConfig.name, url: siteConfig.url },
    { name: 'Contacto', url: `${BASE_URL}/contact` },
  ]);
  return (
    <>
      <Script id="ld-breadcrumb-contact" type="application/ld+json" strategy="beforeInteractive">
        {toJsonLd(breadcrumb)}
      </Script>
      {children}
    </>
  );
}
