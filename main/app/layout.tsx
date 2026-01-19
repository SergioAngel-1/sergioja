import type { Metadata } from 'next';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Orbitron, Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AlertContainer from '@/components/molecules/AlertContainer';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { ModelTargetProvider } from '@/lib/contexts/ModelTargetContext';
import { generateMetadata, generatePersonSchema, generateWebSiteSchema, toJsonLd } from '@/shared/seo';
import { defaultSEO, siteConfig } from '@/lib/seo/config';

// Import client-only components dynamically to avoid hydration errors
const CookieConsentProvider = dynamic(
  () => import('@/contexts/CookieConsentContext').then(mod => ({ default: mod.CookieConsentProvider })),
  { ssr: false }
);

const CookieConsentWrapper = dynamic(
  () => import('@/components/CookieConsentWrapper'),
  { ssr: false }
);

const GTMLoader = dynamic(
  () => import('@/components/GTMLoader'),
  { ssr: false }
);

const WebVitalsTracker = dynamic(
  () => import('@/components/WebVitalsTracker'),
  { ssr: false }
);

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900'],
  display: 'swap',
  preload: true,
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sergioja.com';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const isProd = process.env.NODE_ENV === 'production';

export const metadata: Metadata = {
  ...generateMetadata(defaultSEO, SITE_URL),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  metadataBase: new URL(SITE_URL),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    shortcut: ['/favicon/favicon.ico'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SergioJA',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Canonical URL - Todas las rutas de modales apuntan a la homepage */}
        <link rel="canonical" href={SITE_URL} />
        
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
        
        {/* Theme Color */}
        <meta name="theme-color" content="#00F7C0" />
      </head>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} font-rajdhani bg-background-light text-text-primary antialiased`}
      >
        <CookieConsentProvider>
          {isProd && GTM_ID && <GTMLoader gtmId={GTM_ID} />}
          <Script id="ld-person" type="application/ld+json" strategy="beforeInteractive">
          {toJsonLd(generatePersonSchema({
            name: siteConfig.author.name,
            url: siteConfig.url,
            sameAs: [siteConfig.author.social.github, siteConfig.author.social.linkedin],
          }))}
        </Script>
          <Script id="ld-website" type="application/ld+json" strategy="beforeInteractive">
          {toJsonLd(generateWebSiteSchema({
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
          }))}
        </Script>
          <CookieConsentWrapper />
          <LanguageProvider>
            <ModelTargetProvider>
              <main className="h-viewport overflow-hidden">{children}</main>
              <AlertContainer />
            </ModelTargetProvider>
          </LanguageProvider>
          <WebVitalsTracker />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
