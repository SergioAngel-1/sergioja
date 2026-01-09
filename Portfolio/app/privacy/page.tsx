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

export default function PrivacyPage() {
  const { t } = useLanguage();
  const log = useLogger('PrivacyPage');
  const router = useRouter();

  usePageAnalytics(
    (depth: number) => log.interaction('scroll_depth', depth.toString()),
    (seconds: number) => log.interaction('time_on_page', seconds.toString())
  );

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.sergioja.com';

  // Generate Article schema for better indexation
  const articleSchema = generateArticleSchema({
    headline: t('privacy.title'),
    description: t('privacy.intro'),
    url: `${SITE_URL}/privacy`,
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
    { key: 'section1', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'section2', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { key: 'section3', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key: 'section4', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'section5', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { key: 'section6', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { key: 'section7', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { key: 'section8', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { key: 'section9', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { key: 'section10', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <>
      <Script id="ld-privacy" type="application/ld+json" strategy="beforeInteractive">
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
            title={t('privacy.title')} 
            subtitle={t('privacy.intro')} 
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
              <span className="font-semibold">{t('privacy.lastUpdate')}:</span> {t('privacy.date')}
            </p>
          </div>
        </motion.div>

        <div className="space-y-8 md:space-y-12">
          {sections.map((section, index) => (
            <TermsCard
              key={section.key}
              title={t(`privacy.${section.key}.title`)}
              content={t(`privacy.${section.key}.content`)}
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
                {t('privacy.ctaTitle')}
              </h2>
              <p className="text-text-secondary font-rajdhani text-base md:text-lg mb-6 max-w-2xl mx-auto">
                {t('privacy.ctaDescription')}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-black border-white hover:bg-transparent hover:text-white"
                onClick={() => {
                  log.interaction('click_privacy_cta', 'contact');
                  window.dispatchEvent(new Event('app:navigation-start'));
                  router.push('/contact');
                }}
              >
                <span className="flex items-center gap-2">
                  {t('privacy.ctaButton')}
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
