'use client';

import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerformance } from '@/lib/contexts/PerformanceContext';
import { logger } from '@/lib/logger';

interface NavigationContentProps {
  onNavigate?: (modal: string) => void;
}

export default function NavigationContent({ onNavigate }: NavigationContentProps) {
  const { language, setLanguage, t } = useLanguage();
  const { mode, setMode } = usePerformance();

  const handleSecondaryClick = (modal: string) => {
    if (onNavigate) {
      onNavigate(modal);
    }
  };

  const secondaryLinks = [
    { label: t('nav.identity'), modal: 'identity' },
    { label: t('nav.purpose'), modal: 'purpose' },
    { label: t('nav.connection'), modal: 'connection' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-fluid-xs">
          <span className="bg-black text-white/40 font-mono" style={{ padding: `0 ${fluidSizing.space.sm}` }}>{t('nav.sections')}</span>
        </div>
      </div>

      {/* Enlaces secundarios */}
      <div className="grid grid-cols-3" style={{ gap: fluidSizing.space.sm }}>
        {secondaryLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => handleSecondaryClick(link.modal)}
            className="group flex flex-col items-center rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            style={{ gap: fluidSizing.space.xs, padding: fluidSizing.space.sm }}
          >
            <div className="rounded-full bg-white/40 group-hover:bg-white transition-colors" style={{ width: fluidSizing.space.sm, height: fluidSizing.space.sm }} />
            <span className="text-white/70 group-hover:text-white font-medium text-center leading-tight text-fluid-sm">
              {link.label}
            </span>
          </button>
        ))}
      </div>

      {/* Nota informativa (movida arriba de traducciones) */}
      <div style={{ paddingTop: fluidSizing.space.sm }}>
        <p className="text-white/40 text-center leading-relaxed text-fluid-xs">
          {t('nav.clickToView')}
        </p>
      </div>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-fluid-xs">
          <span className="bg-black text-white/40 font-mono" style={{ padding: `0 ${fluidSizing.space.sm}` }}>{t('nav.language')}</span>
        </div>
      </div>

      {/* Botón de cambio de idioma */}
      <div className="grid grid-cols-1" style={{ gap: fluidSizing.space.sm }}>
        <button
          onClick={() => setLanguage('es')}
          className={`${language === 'es' ? 'border-white/40 bg-white/10 text-white' : 'border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/10'} rounded-lg border transition-all duration-300`}
          style={{ padding: fluidSizing.space.md }}
        >
          <div className="flex items-center justify-center" style={{ gap: fluidSizing.space.sm }}>
            <span className="text-lg">🇪🇸</span>
            <span className="font-medium text-fluid-sm">Español</span>
          </div>
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`${language === 'en' ? 'border-white/40 bg-white/10 text-white' : 'border-white/20 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/10'} rounded-lg border transition-all duration-300`}
          style={{ padding: fluidSizing.space.md }}
        >
          <div className="flex items-center justify-center" style={{ gap: fluidSizing.space.sm }}>
            <span className="text-lg">🇬🇧</span>
            <span className="font-medium text-fluid-sm">English</span>
          </div>
        </button>
      </div>

      <div style={{ paddingTop: fluidSizing.space.sm }}>
        <p className="text-white/40 text-center leading-relaxed text-fluid-xs">
          {t('nav.clickToChangeLanguage')}
        </p>
      </div>

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-fluid-xs">
          <span className="bg-black text-white/40 font-mono" style={{ padding: `0 ${fluidSizing.space.sm}` }}>{t('performance.title')}</span>
        </div>
      </div>

      {/* Botones de modo de rendimiento */}
      <div className="grid grid-cols-3" style={{ gap: fluidSizing.space.sm }}>
        <button
          onClick={() => {
            logger.info('Performance mode changed to low', 'NavigationContent');
            setMode('low');
          }}
          className={`${
            mode === 'low'
              ? 'border-white/40 bg-white/10 text-white'
              : 'border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5'
          } rounded-lg border transition-all duration-300 flex flex-col items-center justify-center`}
          style={{ padding: fluidSizing.space.sm, gap: fluidSizing.space.xs }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium text-fluid-xs">{t('performance.low')}</span>
        </button>
        <button
          onClick={() => {
            logger.info('Performance mode changed to high', 'NavigationContent');
            setMode('high');
          }}
          className={`${
            mode === 'high'
              ? 'border-white/40 bg-white/10 text-white'
              : 'border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/5'
          } rounded-lg border transition-all duration-300 flex flex-col items-center justify-center`}
          style={{ padding: fluidSizing.space.sm, gap: fluidSizing.space.xs }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-medium text-fluid-xs">{t('performance.high')}</span>
        </button>
        <button
          onClick={() => {
            logger.info('Matrix mode disabled - coming soon', 'NavigationContent');
          }}
          disabled
          aria-disabled="true"
          className={`group relative rounded-lg border transition-all duration-300 flex flex-col items-center justify-center cursor-not-allowed opacity-50 border-white/20 text-white/40`}
          style={{ padding: fluidSizing.space.sm, gap: fluidSizing.space.xs }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="font-medium text-fluid-xs">{t('performance.matrix')}</span>
          <span className="absolute -top-2 right-2 text-[10px] font-mono bg-white/10 border border-white/20 rounded px-2 py-0.5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {t('performance.comingSoon')}
          </span>
        </button>
      </div>

      <div style={{ paddingTop: fluidSizing.space.sm }}>
        <p className="text-white/40 text-center leading-relaxed text-fluid-xs">
          {mode === 'low' && t('performance.lowDesc')}
          {mode === 'high' && t('performance.highDesc')}
          {mode === 'matrix' && t('performance.matrixDesc')}
        </p>
      </div>

      {/* Legal links - subtle at the bottom */}
      <div style={{ paddingTop: fluidSizing.space.lg, marginTop: fluidSizing.space.md, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="flex items-center justify-center flex-wrap" style={{ gap: fluidSizing.space.sm }}>
          <button
            onClick={() => {
              const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://portfolio.sergioja.com';
              window.open(`${portfolioUrl}/faq`, '_blank', 'noopener,noreferrer');
              logger.info('FAQ link clicked - redirected to Portfolio', 'NavigationContent');
            }}
            className="text-white/30 hover:text-white/60 transition-colors duration-200 text-fluid-xs font-mono"
          >
            FAQ
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => {
              const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://portfolio.sergioja.com';
              window.open(`${portfolioUrl}/privacy`, '_blank', 'noopener,noreferrer');
              logger.info('Privacy link clicked - redirected to Portfolio', 'NavigationContent');
            }}
            className="text-white/30 hover:text-white/60 transition-colors duration-200 text-fluid-xs font-mono"
          >
            Privacidad
          </button>
          <span className="text-white/20">•</span>
          <button
            onClick={() => {
              const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://portfolio.sergioja.com';
              window.open(`${portfolioUrl}/terms`, '_blank', 'noopener,noreferrer');
              logger.info('Terms link clicked - redirected to Portfolio', 'NavigationContent');
            }}
            className="text-white/30 hover:text-white/60 transition-colors duration-200 text-fluid-xs font-mono"
          >
            Términos
          </button>
        </div>
      </div>

    </div>
  );
}
