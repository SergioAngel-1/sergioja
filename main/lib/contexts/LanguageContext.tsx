'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, translate, Translations } from '@/shared/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize language from localStorage to prevent hydration mismatch
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved === 'es' || saved === 'en') return saved;
    }
    return 'es';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    if (mounted) {
      localStorage.setItem('language', lang);
    }
  }, [mounted]);

  const toggleLanguage = useCallback(() => {
    const newLang: Language = language === 'es' ? 'en' : 'es';
    handleSetLanguage(newLang);
  }, [language, handleSetLanguage]);

  const t = useCallback((key: keyof Translations): string => {
    return translate(key, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
