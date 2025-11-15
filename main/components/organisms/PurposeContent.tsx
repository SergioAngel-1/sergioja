'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import DevTipsModal from '@/components/molecules/DevTipsModal';
import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { api } from '@/lib/api-client';
import { alerts } from '../../../shared/alertSystem';

export default function PurposeContent() {
  const { t, language } = useLanguage();
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const getReCaptchaToken = async (): Promise<string | null> => {
    if (process.env.NODE_ENV === 'development') {
      return 'dev-bypass-token';
    }
    try {
      if (typeof window !== 'undefined' && (window as any).grecaptcha?.enterprise) {
        await new Promise<void>((resolve) => (window as any).grecaptcha.enterprise.ready(() => resolve()));
        return await (window as any).grecaptcha.enterprise.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
          { action: 'subscribe_newsletter' }
        );
      }
      return null;
    } catch {
      return null;
    }
  };

  // Tarjetas fijas: Portfolio, Blog y Newsletter
  const isDev = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';
  const portfolioCard = {
    id: 'portfolio',
    title: t('nav.portfolio'),
    description: t('nav.portfolioDesc'),
    href: isDev ? 'http://localhost:3000' : 'https://portfolio.sergioja.com',
  } as const;

  const blogCard = {
    id: 'blog',
    title: 'Blog',
    description: language === 'es' ? 'Notas, ideas y bitácora de proceso' : 'Notes, ideas, and build log',
    href: isDev ? 'http://localhost:3000/blog' : 'https://portfolio.sergioja.com/blog',
  } as const;

  const newsletterCard = {
    id: 'newsletter',
    title: t('newsletter.label'),
    description: t('devTips.description'),
  } as const;

  const cards = [portfolioCard, blogCard, newsletterCard] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      {/* Propósito */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}
      >
        <h3 className="text-white font-bold text-fluid-lg">{t('purpose.title')}</h3>
        <div className="h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
      </motion.div>

      {/* Texto: propósito */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.sm }}>
        <p className="text-white/70 leading-relaxed text-fluid-sm">{t('purpose.paragraph1')}</p>
        <p className="text-white/70 leading-relaxed text-fluid-sm">{t('purpose.paragraph2')}</p>
      </div>

      {/* Tarjetas: Portfolio, Blog y Newsletter (estilo conexiones) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
        {cards.map((item, index) => (
          item.id === 'newsletter' ? (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setNewsletterOpen(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 text-left"
              style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md }}
            >
              <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
                <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-fluid-sm">{item.title}</h4>
                <p className="text-white/60 truncate text-fluid-sm">{item.description}</p>
              </div>
              <div className="text-white/40 group-hover:text-white/60 transition-colors">
                <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ) : (
            <motion.a
              key={item.id}
              href={item.href || '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md }}
            >
              {/* Icono */}
              <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
                {item.id === 'portfolio' ? (
                  <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-9 4h6" />
                  </svg>
                ) : (
                  <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h6M5 5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9l-6-4H5z" />
                  </svg>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-fluid-sm">{item.title}</h4>
                <p className="text-white/60 truncate text-fluid-sm">{item.description}</p>
              </div>

              {/* Flecha */}
              <div className="text-white/40 group-hover:text-white/60 transition-colors">
                <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          )
        ))}
      </div>

      {/* Modal Newsletter */}
      <DevTipsModal
        isOpen={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        onSubmit={async (email: string) => {
          const recaptchaToken = await getReCaptchaToken();
          try {
            const res = await api.subscribeNewsletter({
              email,
              recaptchaToken: recaptchaToken || undefined,
              recaptchaAction: 'subscribe_newsletter',
            });
            if (res.success) {
              alerts.success(
                t('alerts.success'),
                language === 'es' ? 'Suscripción completada' : 'Subscription completed',
                6000
              );
              return;
            }
            throw new Error(res.error?.message || 'Subscription failed');
          } catch (err) {
            alerts.error(
              t('alerts.error'),
              language === 'es' ? 'No se pudo suscribir' : 'Could not subscribe',
              6000
            );
            throw err;
          }
        }}
      />
    </div>
  );
}
