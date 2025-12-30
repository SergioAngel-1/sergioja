'use client';

import React, { useEffect, useState } from 'react';
import { generateCanonicalUrl } from '@/shared/seo/canonical';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sergioja.com';

export default function Head() {
  const [canonicalUrl, setCanonicalUrl] = useState<string>(SITE_URL);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      setCanonicalUrl(generateCanonicalUrl(SITE_URL, pathname));
    }
  }, []);

  return (
    <>
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Preconnect to external CDNs */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://api.sergioja.com" />
      
      {/* DNS prefetch fallback */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://api.sergioja.com" />
      
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
    </>
  );
}
