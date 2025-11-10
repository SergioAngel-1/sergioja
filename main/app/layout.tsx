import type { Metadata } from 'next';
import { Orbitron, Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
  title: 'Sergio Jáuregui | Inicio',
  description: 'Página principal de Sergio Jáuregui - Desarrollador Full Stack',
  keywords: [
    'desarrollador full stack',
    'desarrollo web',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
  ],
  authors: [{ name: 'Sergio Jáuregui' }],
  openGraph: {
    title: 'Sergio Jáuregui | Inicio',
    description: 'Desarrollador Full Stack',
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
    <html lang="es">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} font-rajdhani bg-background-light text-text-primary antialiased`}
      >
        <main className="h-screen overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
