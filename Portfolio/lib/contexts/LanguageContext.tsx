'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Language, mergeTranslations } from '../../../shared/translations';
import { portfolioTranslations, PortfolioTranslations } from '../translations/portfolio-translations';
import type { BaseTranslations } from '../../../shared/translations';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  // Combinar traducciones base (shared) con las específicas de Portfolio
  const translations = useMemo<Record<Language, BaseTranslations & PortfolioTranslations>>(() => {
    return mergeTranslations(portfolioTranslations);
  }, []);

  useEffect(() => {
    setMounted(true);
    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (mounted) {
      localStorage.setItem('language', newLanguage);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    changeLanguage(newLanguage);
  };

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: changeLanguage, t }}>
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
