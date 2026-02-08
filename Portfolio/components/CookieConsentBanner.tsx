'use client';

import { useEffect, useState } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

type Language = 'es' | 'en';

interface CookieConsentBannerProps {
  variant?: 'main' | 'portfolio';
  language?: Language;
}

const translations = {
  es: {
    'cookies.title': 'Gestión de Cookies',
    'cookies.description': 'Usamos cookies para mejorar tu experiencia y analizar el rendimiento de nuestro sitio. Al aceptar, consientes el uso de cookies analíticas.',
    'cookies.acceptAll': 'Aceptar todas',
    'cookies.onlyEssential': 'Solo esenciales',
  },
  en: {
    'cookies.title': 'Cookie Management',
    'cookies.description': 'We use cookies to enhance your experience and analyze our site\'s performance. By accepting, you consent to the use of analytical cookies.',
    'cookies.acceptAll': 'Accept All',
    'cookies.onlyEssential': 'Essential Only',
  }
};

export default function CookieConsentBanner({ variant = 'portfolio', language = 'es' }: CookieConsentBannerProps) {
  const { consentStatus, acceptCookies, rejectCookies } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  const getText = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  useEffect(() => {
    if (consentStatus === 'pending') {
      // Show immediately - animation is handled by CSS
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [consentStatus]);

  useEffect(() => {
    try {
      if (consentStatus === 'pending' && isVisible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    } catch (error) {
      // Silent fail if body is not accessible (edge case in iframes)
      console.warn('Failed to toggle body scroll lock:', error);
    }

    return () => {
      try {
        document.body.style.overflow = '';
      } catch (error) {
        // Silent fail on cleanup
      }
    };
  }, [consentStatus, isVisible]);

  if (consentStatus !== 'pending' || !isVisible) {
    return null;
  }

  const isMain = variant === 'main';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-cookie-fade-in"
      style={{ zIndex: 999999 }}
    >
      {/* Modal */}
      <div
        className={`relative max-w-lg w-full sm:w-auto ${isMain ? 'bg-black' : 'bg-background-surface'} border border-white/30 rounded-lg overflow-hidden animate-cookie-scale-in`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/20 p-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 border-2 border-white/30">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-white">
            {getText('cookies.title')}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            {getText('cookies.description')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 border-t border-white/20 p-6">
          <button
            onClick={rejectCookies}
            className="flex-1 px-6 py-3 border border-white/30 hover:border-white/50 hover:bg-white/10 bg-white/5 text-white font-bold text-sm sm:text-base transition-all duration-200"
          >
            {getText('cookies.onlyEssential')}
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 px-6 py-3 bg-white hover:bg-white/90 text-black font-bold text-sm sm:text-base transition-all duration-200"
          >
            {getText('cookies.acceptAll')}
          </button>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/30" />
      </div>

    </div>
  );
}
