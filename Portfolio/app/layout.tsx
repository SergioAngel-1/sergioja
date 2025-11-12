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

export const metadata: Metadata = {
  title: 'Sergio Jáuregui | Desarrollador Full Stack',
  description:
    'Desarrollador Full Stack especializado en automatización, tecnología escalable y estrategia para generar valor de negocio.',
  keywords: [
    'desarrollador full stack',
    'desarrollo web',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'portafolio',
    'Laravel',
    'Django',
    'NestJS',
  ],
  authors: [{ name: 'Sergio Jáuregui' }],
  openGraph: {
    title: 'Sergio Jáuregui | Desarrollador Full Stack',
    description: 'Construyendo el futuro con código y automatización',
    type: 'website',
  },
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
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            async
            defer
          />
        )}
      </head>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} font-rajdhani bg-background-dark text-text-primary antialiased`}
      >
        <LanguageProvider>
          <PerformanceProvider>
            <MatrixProvider>
              <ModalProvider>
                <ErrorBoundary>
                  <PageLoader />
                  <HeaderWrapper />
                  <Navbar />
                  <main className="min-h-screen">{children}</main>
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
