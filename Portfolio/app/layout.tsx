import type { Metadata } from 'next';
import { Orbitron, Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/organisms/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import NextPageButton from '@/components/molecules/NextPageButton';
import PageLoader from '@/components/molecules/PageLoader';
import HeaderWrapper from '@/components/organisms/HeaderWrapper';
import AlertContainer from '@/components/molecules/AlertContainer';
import { PerformanceProvider } from '@/lib/contexts/PerformanceContext';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { MatrixProvider } from '@/lib/contexts/MatrixContext';
import { ModalProvider } from '@/lib/contexts/ModalContext';
import { homeMetadata } from '@/lib/seo/page-metadata';
import { toJsonLd, generatePersonSchema, generateWebSiteSchema } from '@/shared/seo';
import { siteConfig } from '@/lib/seo/config';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900'],
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.sergioja.com';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL(SITE_URL),
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Additional iOS Safari meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(
                function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                }
              )(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            async
            defer
          />
        )}
        {(() => {
          const person = generatePersonSchema({
            name: siteConfig.author.name,
            url: siteConfig.url,
            jobTitle: 'Full Stack Developer',
            email: siteConfig.author.email,
            sameAs: [
              siteConfig.author.social.github,
              siteConfig.author.social.linkedin,
            ],
          });
          const website = generateWebSiteSchema({
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
          });
          return (
            <>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(person) }} />
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(website) }} />
            </>
          );
        })()}
      </head>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} font-rajdhani bg-background-dark text-text-primary antialiased`}
      >
        {GTM_ID && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        <LanguageProvider>
          <PerformanceProvider>
            <MatrixProvider>
              <ModalProvider>
                <ErrorBoundary>
                  <PageLoader />
                  <HeaderWrapper />
                  <Navbar />
                  <main className="min-h-viewport">{children}</main>
                  <NextPageButton />
                  <AlertContainer />
                </ErrorBoundary>
              </ModalProvider>
            </MatrixProvider>
          </PerformanceProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
