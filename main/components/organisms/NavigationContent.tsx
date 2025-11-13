'use client';

import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface NavigationContentProps {
  onNavigate?: (modal: string) => void;
}

export default function NavigationContent({ onNavigate }: NavigationContentProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const handlePortfolioClick = () => {
    const isDev = process.env.NODE_ENV === 'development';
    const url = isDev ? 'http://localhost:3000' : 'https://portfolio.sergioja.com';
    window.location.href = url;
  };

  const handleSecondaryClick = (modal: string) => {
    if (onNavigate) {
      onNavigate(modal);
    }
  };

  const secondaryLinks = [
    { label: t('nav.identity'), modal: 'identity' },
    { label: t('nav.projects'), modal: 'projects' },
    { label: t('nav.connection'), modal: 'connection' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: fluidSizing.space.md }}>
      {/* Opción principal: Portfolio */}
      <button
        onClick={handlePortfolioClick}
        className="group w-full flex items-center rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
        style={{ gap: fluidSizing.space.md, padding: fluidSizing.space.md }}
      >
        <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonLg, height: fluidSizing.size.buttonLg }}>
          <svg className="size-icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-white font-bold text-fluid-base">{t('nav.portfolio')}</h3>
          <p className="text-white/60 text-fluid-xs" style={{ marginTop: fluidSizing.space.xs }}>{t('nav.portfolioDesc')}</p>
        </div>
        <svg className="size-icon-md text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

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
            <span className="text-white/70 group-hover:text-white font-medium text-center leading-tight text-fluid-xs">
              {link.label}
            </span>
          </button>
        ))}
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
      <button
        onClick={toggleLanguage}
        className="group w-full flex items-center justify-between rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
        style={{ padding: fluidSizing.space.md }}
      >
        <div className="flex items-center" style={{ gap: fluidSizing.space.sm }}>
          <div className="rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors text-white" style={{ width: fluidSizing.size.buttonMd, height: fluidSizing.size.buttonMd }}>
            <svg className="size-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-fluid-sm">
              {language === 'es' ? 'Español' : 'English'}
            </p>
            <p className="text-white/60 text-fluid-xs">
              {language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
            </p>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: fluidSizing.space.xs }}>
          <span className="text-white/40 font-mono text-fluid-xs uppercase">{language}</span>
          <svg className="size-icon-sm text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
      </button>

      {/* Nota informativa */}
      <div className="border-t border-white/10" style={{ paddingTop: fluidSizing.space.sm }}>
        <p className="text-white/40 text-center leading-relaxed text-fluid-xs">
          {t('nav.clickToView')}
        </p>
      </div>
    </div>
  );
}
