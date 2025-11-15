'use client';

import { fluidSizing } from '@/lib/fluidSizing';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface NavigationContentProps {
  onNavigate?: (modal: string) => void;
}

export default function NavigationContent({ onNavigate }: NavigationContentProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleSecondaryClick = (modal: string) => {
    if (onNavigate) {
      onNavigate(modal);
    }
  };

  const secondaryLinks = [
    { label: t('nav.identity'), modal: 'identity' },
    { label: t('nav.purpose'), modal: 'projects' },
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

    </div>
  );
}
