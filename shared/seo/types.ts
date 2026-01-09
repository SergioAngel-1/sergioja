/**
 * SEO Types - Shared across frontends
 * Tipos para metadata, Open Graph, Twitter Cards, y Structured Data
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  canonical?: string;
  robots?: RobotsConfig;
  openGraph?: OpenGraphMetadata;
  twitter?: TwitterCardMetadata;
  alternates?: AlternateLinks;
}

export interface RobotsConfig {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
}

export interface OpenGraphMetadata {
  type?: 'website' | 'article' | 'profile' | 'book';
  title?: string;
  description?: string;
  url?: string;
  siteName?: string;
  locale?: string;
  images?: OpenGraphImage[];
  videos?: OpenGraphVideo[];
  article?: OpenGraphArticle;
  profile?: OpenGraphProfile;
}

export interface OpenGraphImage {
  url: string;
  secureUrl?: string;
  type?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface OpenGraphVideo {
  url: string;
  secureUrl?: string;
  type?: string;
  width?: number;
  height?: number;
}

export interface OpenGraphArticle {
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export interface OpenGraphProfile {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: string;
}

export interface TwitterCardMetadata {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  images?: string[];
}

export interface AlternateLinks {
  canonical?: string;
  languages?: Record<string, string>;
}

export interface SitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: {
    languages: Record<string, string>;
  };
}

export interface StructuredDataBase {
  '@context': 'https://schema.org';
  '@type': string;
}

export interface PersonSchema extends StructuredDataBase {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  worksFor?: OrganizationSchema;
  sameAs?: string[];
  email?: string;
  telephone?: string;
  address?: PostalAddressSchema;
}

export interface OrganizationSchema extends StructuredDataBase {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: ContactPointSchema[];
}

export interface ContactPointSchema {
  '@type': 'ContactPoint';
  telephone?: string;
  contactType?: string;
  email?: string;
  availableLanguage?: string[];
}

export interface PostalAddressSchema {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface WebSiteSchema extends StructuredDataBase {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  publisher?: OrganizationSchema | PersonSchema;
  potentialAction?: SearchActionSchema;
}

export interface SearchActionSchema {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

export interface BreadcrumbListSchema extends StructuredDataBase {
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItemSchema[];
}

export interface BreadcrumbItemSchema {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

export interface ArticleSchema extends StructuredDataBase {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: PersonSchema | OrganizationSchema;
  publisher?: OrganizationSchema;
  mainEntityOfPage?: string;
}

export interface ProjectSchema extends StructuredDataBase {
  '@type': 'CreativeWork';
  name: string;
  description?: string;
  url?: string;
  image?: string | string[];
  creator?: PersonSchema;
  dateCreated?: string;
  dateModified?: string;
  keywords?: string[];
  inLanguage?: string;
}

export interface FAQPageSchema extends StructuredDataBase {
  '@type': 'FAQPage';
  mainEntity: QuestionSchema[];
}

export interface QuestionSchema {
  '@type': 'Question';
  name: string;
  acceptedAnswer: AnswerSchema;
}

export interface AnswerSchema {
  '@type': 'Answer';
  text: string;
}
