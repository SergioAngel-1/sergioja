/**
 * Structured Data (JSON-LD) Generators
 * Genera datos estructurados para Schema.org
 */

import type {
  PersonSchema,
  OrganizationSchema,
  WebSiteSchema,
  BreadcrumbListSchema,
  BreadcrumbItemSchema,
  ArticleSchema,
  ProjectSchema,
  FAQPageSchema,
} from './types';

/**
 * Genera schema de Person (para perfil personal)
 */
export function generatePersonSchema(data: {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  email?: string;
  sameAs?: string[];
}): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    url: data.url,
    image: data.image,
    jobTitle: data.jobTitle,
    email: data.email,
    sameAs: data.sameAs,
  };
}

/**
 * Genera schema de Organization
 */
export function generateOrganizationSchema(data: {
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    sameAs: data.sameAs,
  };
}

/**
 * Genera schema de WebSite con SearchAction
 */
export function generateWebSiteSchema(data: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}): WebSiteSchema {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
  };

  if (data.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: `${data.searchUrl}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

/**
 * Genera schema de BreadcrumbList
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Genera schema de Article
 */
export function generateArticleSchema(data: {
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: PersonSchema;
  publisher?: OrganizationSchema;
  url?: string;
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: data.author,
    publisher: data.publisher,
    mainEntityOfPage: data.url,
  };
}

/**
 * Genera schema de Project (CreativeWork)
 */
export function generateProjectSchema(data: {
  name: string;
  description?: string;
  url?: string;
  image?: string | string[];
  creator?: PersonSchema;
  dateCreated?: string;
  dateModified?: string;
  keywords?: string[];
  inLanguage?: string;
}): ProjectSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    creator: data.creator,
    dateCreated: data.dateCreated,
    dateModified: data.dateModified,
    keywords: data.keywords,
    inLanguage: data.inLanguage,
  };
}

/**
 * Genera schema de FAQPage para rich snippets de Google
 */
export function generateFAQPageSchema(data: {
  questions: Array<{ question: string; answer: string }>;
}): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Convierte schema a JSON-LD script tag
 */
export function toJsonLd(schema: any): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Genera múltiples schemas combinados
 */
export function combineSchemas(...schemas: any[]): any[] {
  return schemas.filter(Boolean);
}
