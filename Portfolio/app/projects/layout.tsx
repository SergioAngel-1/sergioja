import type { Metadata } from 'next';
import Script from 'next/script';
import { generateMetadata, mergeMetadata, generateBreadcrumbSchema, toJsonLd } from '@/shared/seo';
import { defaultSEO, siteConfig } from '@/lib/seo/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
const projectsConfig = mergeMetadata(defaultSEO, {
  title: 'Proyectos',
  description: 'Descubre los proyectos en los que he trabajado. Aplicaciones web modernas, e-commerce, dashboards y más.',
  alternates: { canonical: `${siteConfig.url}/projects` },
});

export const metadata: Metadata = generateMetadata(projectsConfig, BASE_URL);

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = generateBreadcrumbSchema([
    { name: siteConfig.name, url: siteConfig.url },
    { name: 'Proyectos', url: `${BASE_URL}/projects` },
  ]);
  return (
    <>
      <Script id="ld-breadcrumb-projects" type="application/ld+json" strategy="beforeInteractive">
        {toJsonLd(breadcrumb)}
      </Script>
      {children}
    </>
  );
}
