import type { Metadata } from 'next';
import Script from 'next/script';
import { cache } from 'react';
import { generateTitle, normalizeUrl, generateBreadcrumbSchema, generateProjectSchema, generatePersonSchema, toJsonLd, mergeMetadata, generateMetadata as generateMeta, truncateDescription } from '@/shared/seo';
import type { ApiResponse, Project } from '@/shared/types';
import { siteConfig, defaultSEO } from '@/lib/seo/config';

type Params = { slug: string };

// Cached function to fetch project data (shared between metadata and layout)
const getProject = cache(async (slug: string): Promise<Project | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const res = await fetch(`${apiUrl}/api/portfolio/projects/${encodeURIComponent(slug)}`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const json = (await res.json()) as ApiResponse<Project>;
      return json.data || null;
    }
  } catch (error) {
    console.error('Error fetching project:', error);
  }
  
  return null;
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  const slug = params.slug;

  const p = await getProject(slug);
  
  if (p) {
    const description = truncateDescription(
      p.longDescriptionEs || p.longDescriptionEn || defaultSEO.description
    );
    const canonical = `${baseUrl}/projects/${p.slug}`;
    const image = p.image ? normalizeUrl(p.image, baseUrl) : `${baseUrl}/media/logo-sergioja.png`;

    const config = mergeMetadata(defaultSEO, {
      title: p.title,
      description,
      keywords: [p.title, 'Proyecto', ...(p.technologies?.map(t => t.name) || [])],
      alternates: { canonical },
      openGraph: {
        type: 'article',
        title: p.title,
        description,
        url: canonical,
        siteName: siteConfig.name,
        locale: 'es_ES',
        images: [{ url: image, width: 1200, height: 630, alt: p.title, type: 'image/png' }],
        article: {
          publishedTime: p.createdAt,
          modifiedTime: p.updatedAt,
        },
      },
      twitter: {
        card: 'summary_large_image',
        title: p.title,
        description,
        images: [image],
      },
      robots: {
        index: true,
        follow: true,
        maxImagePreview: 'large',
        maxSnippet: -1,
      },
    });
    return generateMeta(config, baseUrl);
  }

  const fallbackCanonical = `${baseUrl}/projects/${slug}`;
  const fallbackImage = `${baseUrl}/media/logo-sergioja.png`;
  const fallbackConfig = mergeMetadata(defaultSEO, {
    title: defaultSEO.title,
    description: truncateDescription(defaultSEO.description || ''),
    alternates: { canonical: fallbackCanonical },
    openGraph: {
      type: 'article',
      title: defaultSEO.title,
      description: truncateDescription(defaultSEO.description || ''),
      url: fallbackCanonical,
      siteName: siteConfig.name,
      locale: 'es_ES',
      images: [{ url: fallbackImage, width: 1200, height: 630, alt: defaultSEO.title, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultSEO.title,
      description: defaultSEO.description,
      images: [fallbackImage],
    },
  });
  return generateMeta(fallbackConfig, baseUrl);
}

export default async function ProjectLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  const slug = params.slug;

  // Reuse cached project data
  const p = await getProject(slug);

  let breadcrumbJsonLd = '';
  let projectJsonLd = '';

  if (p) {
    const canonical = `${baseUrl}/projects/${p.slug}`;
    const image = p.image ? normalizeUrl(p.image, baseUrl) : `${baseUrl}/media/logo-sergioja.png`;
    const breadcrumb = generateBreadcrumbSchema([
      { name: siteConfig.name, url: siteConfig.url },
      { name: 'Proyectos', url: `${baseUrl}/projects` },
      { name: p.title, url: canonical },
    ]);
    const project = generateProjectSchema({
      name: p.title,
      description: p.longDescriptionEs || p.longDescriptionEn || defaultSEO.description,
      url: canonical,
      image,
      creator: generatePersonSchema({ name: siteConfig.author.name, url: siteConfig.url, sameAs: [siteConfig.author.social.github, siteConfig.author.social.linkedin] }),
      dateCreated: p.createdAt,
      dateModified: p.updatedAt,
      keywords: p.technologies?.map(t => t.name) || [],
      inLanguage: 'es',
    });
    breadcrumbJsonLd = toJsonLd(breadcrumb);
    projectJsonLd = toJsonLd(project);
  }

  return (
    <>
      {breadcrumbJsonLd && (
        <Script id="ld-breadcrumb" type="application/ld+json" strategy="beforeInteractive">
          {breadcrumbJsonLd}
        </Script>
      )}
      {projectJsonLd && (
        <Script id="ld-project" type="application/ld+json" strategy="beforeInteractive">
          {projectJsonLd}
        </Script>
      )}
      {children}
    </>
  );
}
