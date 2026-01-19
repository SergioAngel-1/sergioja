'use client';

import { useState, useEffect } from 'react';
import CookieConsentBanner from '@/components/CookieConsentBanner';

type Language = 'es' | 'en';

export default function CookieConsentWrapper() {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('language');
      if (stored === 'en' || stored === 'es') {
        setLanguage(stored);
      } else {
        const browserLang = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
        setLanguage(browserLang);
      }
    }
  }, []);
  
  return <CookieConsentBanner variant="main" language={language} />;
}
