'use client';

import CookieConsentBanner from '@/shared/components/CookieConsentBanner';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function CookieConsentWrapper() {
  const { language, t } = useLanguage();
  
  return <CookieConsentBanner variant="portfolio" language={language} t={t} />;
}
