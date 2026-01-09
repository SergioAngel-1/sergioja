'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useLogger } from '@/shared/hooks/useLogger';
import { usePageAnalytics } from '@/shared/hooks/usePageAnalytics';
import PageHeader from '@/components/organisms/PageHeader';
import FloatingParticles from '@/components/atoms/FloatingParticles';
import GlowEffect from '@/components/atoms/GlowEffect';
import Button from '@/components/atoms/Button';
import TermsCard from '@/components/molecules/TermsCard';
import { fluidSizing } from '@/lib/utils/fluidSizing';
import { generateArticleSchema, toJsonLd } from '@/shared/seo';
import { siteConfig } from '@/lib/seo/config';

export default function TermsPage() {
  const { t } = useLanguage();
  const log = useLogger('TermsPage');
  const router = useRouter();

  usePageAnalytics(
    (depth: number) => log.interaction('scroll_depth', depth.toString()),
    (seconds: number) => log.interaction('time_on_page', seconds.toString())
  );

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.sergioja.com';

  // Generate Article schema for better indexation
  const articleSchema = generateArticleSchema({
    headline: t('terms.title'),
    description: t('terms.intro'),
    url: `${SITE_URL}/terms`,
    datePublished: '2024-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    author: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  });

  const sections = [
    { key: 'section1', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'section2', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { key: 'section3', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { key: 'section4', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { key: 'section5', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { key: 'section6', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { key: 'section7', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { key: 'section8', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { key: 'section9', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
    { key: 'section10', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <>
      <Script id="ld-terms" type="application/ld+json" strategy="beforeInteractive">
        {toJsonLd(articleSchema)}
      </Script>
      <div className="relative min-h-screen overflow-hidden pl-0 md:pl-20 with-bottom-nav-inset">
      <div className="absolute inset-0 cyber-grid opacity-10" />

      <GlowEffect
        color="white"
        size="lg"
        position={{ top: '10rem', right: '5rem' }}
        opacity={0.1}
        duration={4}
        animationType="pulse"
      />

      <GlowEffect
        color="white"
        size="lg"
        position={{ bottom: '10rem', left: '5rem' }}
        opacity={0.15}
        duration={3}
        delay={0.5}
        animationType="pulse"
      />

      <FloatingParticles count={50} color="bg-white" />

      <div 
        className="relative z-10 mx-auto w-full" 
        style={{ 
          maxWidth: '1600px', 
          padding: `${fluidSizing.space['2xl']} ${fluidSizing.space.lg}`, 
          paddingTop: `calc(${fluidSizing.header.height} + ${fluidSizing.space.md})` 
        }}
      >
        <div className="mb-8 md:mb-16">
          <PageHeader 
            title={t('terms.title')} 
            subtitle={t('terms.intro')} 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg p-4 inline-block">
            <p className="text-text-muted font-rajdhani text-sm">
              <span className="font-semibold">{t('terms.lastUpdate')}:</span> {t('terms.date')}
            </p>
          </div>
        </motion.div>

        <div className="space-y-8 md:space-y-12">
          {sections.map((section, index) => (
            <TermsCard
              key={section.key}
              title={t(`terms.${section.key}.title`)}
              content={t(`terms.${section.key}.content`)}
              icon={section.icon}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 md:mt-24"
        >
          <div className="relative bg-background-surface/50 backdrop-blur-sm border border-white/30 rounded-lg p-8 md:p-12 text-center overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-orbitron font-bold text-white text-2xl md:text-3xl mb-4">
                {t('terms.ctaTitle')}
              </h2>
              <p className="text-text-secondary font-rajdhani text-base md:text-lg mb-6 max-w-2xl mx-auto">
                {t('terms.ctaDescription')}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-black border-white hover:bg-transparent hover:text-white"
                onClick={() => {
                  log.interaction('click_terms_cta', 'contact');
                  window.dispatchEvent(new Event('app:navigation-start'));
                  router.push('/contact');
                }}
              >
                <span className="flex items-center gap-2">
                  {t('terms.ctaButton')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Button>
            </div>

            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
