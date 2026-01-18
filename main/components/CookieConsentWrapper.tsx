'use client';

import CookieConsentBanner from '@/shared/components/CookieConsentBanner';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function CookieConsentWrapper() {
  const { language, t } = useLanguage();
  
  // Wrapper function to match expected signature
  const translateWrapper = (key: string): string => {
    return t(key as any);
  };
  
  return <CookieConsentBanner variant="main" language={language} t={translateWrapper} />;
}
