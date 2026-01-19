'use client';

import { useEffect, useState, useCallback } from 'react';

type Language = 'es' | 'en';
type ConsentStatus = 'pending' | 'accepted' | 'rejected';

interface CookieConsentBannerProps {
  variant?: 'main' | 'portfolio';
  language?: Language;
}

const STORAGE_KEY = 'cookie-consent';
const PREVIOUS_STATUS_KEY = 'cookie-consent-previous';
const TRACKING_COOKIE_PREFIXES = ['_ga', '_gid', '_gat', '_ga_', '_gcl_', '_fbp'];

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

// Helper functions - self-contained, no context dependency
const getStoredStatus = (): ConsentStatus | null => {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'accepted' || stored === 'rejected' ? stored : null;
};

const clearTrackingCookies = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  const host = window.location.hostname;
  const parts = host.split('.');
  const domains = ['', host];
  if (parts.length >= 2) {
    domains.push(`.${parts.slice(-2).join('.')}`);
  }

  cookies.forEach((cookie) => {
    const [rawName] = cookie.split('=');
    const name = rawName?.trim();
    if (!name) return;
    const shouldClear = TRACKING_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix));
    if (!shouldClear) return;

    domains.forEach((domain) => {
      const baseStr = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;${domain ? ` domain=${domain};` : ''}`;
      [baseStr, `${baseStr} SameSite=Lax`, `${baseStr} SameSite=None; Secure`, `${baseStr} SameSite=Strict`].forEach(cookieStr => {
        try { document.cookie = cookieStr; } catch {}
      });
    });
  });
};

export default function CookieConsentBanner({ variant = 'portfolio', language = 'es' }: CookieConsentBannerProps) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [previousStatus, setPreviousStatus] = useState<ConsentStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const getText = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  // Initialize on client
  useEffect(() => {
    setIsClient(true);
    const stored = getStoredStatus();
    
    // Check if there's a previous decision stored in sessionStorage
    const previous = window.sessionStorage.getItem(PREVIOUS_STATUS_KEY);
    if (previous === 'accepted' || previous === 'rejected') {
      setPreviousStatus(previous);
    }
    
    if (stored) {
      setConsentStatus(stored);
    } else {
      setConsentStatus('pending');
      setIsVisible(true);
    }
  }, []);

  // Listen for openCookiePreferences event to show banner dynamically
  useEffect(() => {
    const handleOpenPreferences = () => {
      const currentConsent = getStoredStatus();
      // Save previous decision for comparison
      if (currentConsent) {
        window.sessionStorage.setItem(PREVIOUS_STATUS_KEY, currentConsent);
        setPreviousStatus(currentConsent);
      }
      // Clear consent and show banner
      window.localStorage.removeItem(STORAGE_KEY);
      setConsentStatus('pending');
      setIsVisible(true);
    };

    window.addEventListener('openCookiePreferences', handleOpenPreferences);
    return () => window.removeEventListener('openCookiePreferences', handleOpenPreferences);
  }, []);

  // Handle visibility
  useEffect(() => {
    if (!isClient) return;
    if (consentStatus === 'pending') {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [consentStatus, isClient]);

  const acceptCookies = useCallback(() => {
    const isChangingDecision = previousStatus && previousStatus !== 'accepted';
    
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    window.sessionStorage.removeItem(PREVIOUS_STATUS_KEY);
    setConsentStatus('accepted');
    setIsVisible(false);
    
    // Reload if changing from a different decision
    if (isChangingDecision) {
      setTimeout(() => window.location.reload(), 100);
    }
  }, [previousStatus]);

  const rejectCookies = useCallback(() => {
    const isChangingDecision = previousStatus && previousStatus !== 'rejected';
    
    window.localStorage.setItem(STORAGE_KEY, 'rejected');
    window.sessionStorage.removeItem(PREVIOUS_STATUS_KEY);
    clearTrackingCookies();
    setConsentStatus('rejected');
    setIsVisible(false);
    
    // Reload if changing from a different decision
    if (isChangingDecision) {
      setTimeout(() => window.location.reload(), 100);
    }
  }, [previousStatus]);

  // Don't render on server or if already has consent
  if (!isClient || consentStatus !== 'pending' || !isVisible) {
    return null;
  }

  const isMain = variant === 'main';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      style={{
        zIndex: 999999,
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      {/* Modal */}
      <div
        className={`relative max-w-lg w-full sm:w-auto ${isMain ? 'bg-black' : 'bg-background-surface'} border border-white/30 rounded-lg overflow-hidden`}
        style={{
          animation: 'scaleIn 0.4s ease-out forwards',
        }}
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
