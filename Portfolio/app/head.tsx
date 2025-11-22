import React from 'react';
import { toJsonLd, generatePersonSchema, generateWebSiteSchema } from '@/shared/seo';
import { siteConfig } from '@/lib/seo/config';

export default function Head() {
  const person = generatePersonSchema({
    name: siteConfig.author.name,
    url: siteConfig.url,
    jobTitle: 'Full Stack Developer',
    email: siteConfig.author.email,
    sameAs: [siteConfig.author.social.github, siteConfig.author.social.linkedin],
  });

  const website = generateWebSiteSchema({
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  });

  return (
    <>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(website) }} />
    </>
  );
}
