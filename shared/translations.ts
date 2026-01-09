/**
 * Sistema de traducciones compartido y extensible
 * Cada frontend puede extender estas traducciones base con las suyas propias
 */

import { logger } from './logger';
import { sharedTranslations } from './i18n';

const ENABLE_TRANSLATION_DEBUG =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DEBUG_TRANSLATIONS === 'true';

export type Language = 'es' | 'en';

/**
 * Traducciones base compartidas entre todos los frontends
 */
export interface BaseTranslations {
  // Navigation
  'nav.portfolio': string;
  'nav.portfolioDesc': string;
  'nav.identity': string;
  'nav.projects': string;
  'nav.purpose': string;
  'nav.connection': string;
  'nav.navigation': string;
  'nav.menu': string;
  'nav.sections': string;
  'nav.language': string;
  'nav.clickToView': string;
  'nav.clickToChangeLanguage': string;
  'nav.faq': string;
  'nav.privacy': string;
  'nav.terms': string;
  'nav.cookies': string;
  
  // Performance
  'performance.title': string;
  'performance.low': string;
  'performance.high': string;
  'performance.matrix': string;
  'performance.lowDesc': string;
  'performance.highDesc': string;
  'performance.matrixDesc': string;
  'performance.comingSoon': string;
  'performance.modeActive': string;
  
  // Identity
  'identity.title': string;
  'identity.paragraph1': string;
  'identity.paragraph2': string;
  'identity.available': string;
  'identity.busy': string;
  'identity.unavailable': string;
  'identity.statusAvailableTag': string;
  'identity.statusBusyTag': string;
  'identity.statusUnavailableTag': string;
  'purpose.title': string;
  'purpose.paragraph1': string;
  'purpose.paragraph2': string;
  
  // Projects
  'projects.featured': string;
  'projects.loading': string;
  'projects.noProjects': string;
  'projects.viewFull': string;
  'projects.viewAll': string;
  'projects.viewDemo': string;
  'projects.github': string;
  'projects.inProgress': string;
  'projects.preview': string;
  'projects.gallery': string;
  'projects.galleryTitle': string;
  'projects.backToDemo': string;
  'projects.viewPage': string;
  'projects.viewCode': string;
  'projects.privateCode': string;
  'projects.actions': string;
  'projects.previewDisabledPerformance': string;
  'projects.noPreview': string;
  
  // Contact form
  'contact.name': string;
  'contact.email': string;
  'contact.subject': string;
  'contact.message': string;
  'contact.send': string;
  'contact.sending': string;
  'contact.success': string;
  'contact.error': string;
  'contact.recaptchaRequired': string;
  
  // Connection modal
  'connection.title': string;
  'connection.subtitle': string;
  'connection.github': string;
  'connection.githubHandle': string;
  'connection.githubDesc': string;
  'connection.linkedin': string;
  'connection.linkedinHandle': string;
  'connection.linkedinDesc': string;
  'connection.emailLabel': string;
  'connection.emailHandle': string;
  'connection.emailDesc': string;
  'connection.formTitle': string;
  'connection.namePlaceholder': string;
  'connection.emailPlaceholder': string;
  'connection.messagePlaceholder': string;
  'connection.sendButton': string;
  'connection.sendingButton': string;
  'connection.consoleInit': string;
  'connection.consoleWaiting': string;
  'connection.consoleSending': string;
  'connection.consoleSuccess': string;
  'connection.consoleSuccessMsg': string;
  'connection.consoleError': string;
  'connection.consoleErrorRetry': string;
  'connection.consoleNetError': string;
  'connection.consoleNetErrorMsg': string;
  'connection.consoleWaitingResponse': string;
  
  // Alerts
  'alerts.success': string;
  'alerts.error': string;
  'alerts.warning': string;
  'alerts.info': string;
  'alerts.messageSent': string;
  'alerts.messageSentDesc': string;
  'alerts.sendError': string;
  'alerts.connectionError': string;
  'alerts.connectionErrorDesc': string;
  'alerts.validationError': string;
  'alerts.checkForm': string;
  
  // Validations
  'validation.emailRequired': string;
  'validation.emailInvalid': string;
  'validation.emailDomain': string;
  'validation.nameRequired': string;
  'validation.nameInvalid': string;
  'validation.nameMinLength': string;
  'validation.nameMaxLength': string;
  'validation.subjectRequired': string;
  'validation.subjectMinLength': string;
  'validation.subjectMaxLength': string;
  'validation.messageRequired': string;
  'validation.messageMinLength': string;
  'validation.messageMaxLength': string;
  
  // reCAPTCHA disclaimer
  'recaptcha.disclaimer': string;
  'recaptcha.privacy': string;
  'recaptcha.terms': string;
  
  // Matrix mode
  'matrix.warning': string;
  'matrix.systemAlert': string;
  'matrix.message': string;
  'matrix.highCPU': string;
  'matrix.highGPU': string;
  'matrix.batteryDrain': string;
  'matrix.recommendation': string;
  'matrix.cancel': string;
  'matrix.activate': string;
  
  // Dev Tips Modal
  'devTips.title': string;
  'devTips.description': string;
  'devTips.benefit1': string;
  'devTips.benefit2': string;
  'devTips.benefit3': string;
  'devTips.emailLabel': string;
  'devTips.emailPlaceholder': string;
  'devTips.emailRequired': string;
  'devTips.emailInvalid': string;
  'devTips.submitError': string;
  'devTips.submitting': string;
  'devTips.subscribe': string;
  'devTips.success': string;
  
  // Common
  'common.cancel': string;

  // Not Found 404
  'notfound.title': string;
  'notfound.subtitle': string;
  'notfound.message': string;
  'notfound.description': string;
  'notfound.backHome': string;
  'notfound.viewProjects': string;
  'notfound.contact': string;
  'notfound.errorCodeLabel': string;
  'notfound.errorCode': string;
  'notfound.statusLabel': string;

  // Gyroscope
  'gyro.movePhone': string;
  'gyro.enable': string;
  'newsletter.label': string;

  // Loader
  'loader.loadingModel': string;
  'loader.initializing': string;
}

// Alias para compatibilidad
export type Translations = BaseTranslations;

export const translations: Record<Language, Translations> = sharedTranslations as any;

/**
 * Función de traducción base
 */
export function translate(key: keyof BaseTranslations, language: Language = 'es'): string {
  const translation = translations[language][key];
  
  if (!translation) {
    logger.warn(`Translation key not found: ${key}`, { language, key }, 'Translations');
    return key;
  }
  
  if (ENABLE_TRANSLATION_DEBUG) {
    logger.debug(`Translation lookup: ${key}`, { language, value: translation }, 'Translations');
  }
  return translation;
}

/**
 * Función para crear un traductor extendido que combina traducciones base con específicas del frontend
 */
export function createExtendedTranslator<T extends Record<string, any>>(
  language: Language,
  extendedTranslations: Record<Language, T>
) {
  if (ENABLE_TRANSLATION_DEBUG) {
    logger.info('Creating extended translator', { language, hasExtended: !!extendedTranslations }, 'Translations');
  }
  
  return (key: string): string => {
    // Primero buscar en traducciones extendidas
    const extended = extendedTranslations[language]?.[key];
    if (extended !== undefined) {
      if (ENABLE_TRANSLATION_DEBUG) {
        logger.debug(`Extended translation found: ${key}`, { language, source: 'extended' }, 'Translations');
      }
      return extended;
    }
    
    // Luego buscar en traducciones base
    const base = translations[language]?.[key as keyof BaseTranslations];
    if (base !== undefined) {
      if (ENABLE_TRANSLATION_DEBUG) {
        logger.debug(`Base translation found: ${key}`, { language, source: 'base' }, 'Translations');
      }
      return base;
    }
    
    // Fallback: retornar la key
    logger.warn(`Translation key not found in extended translator: ${key}`, { language, key }, 'Translations');
    return key;
  };
}

/**
 * Función para combinar traducciones base con extendidas
 */
export function mergeTranslations<T extends Record<string, any>>(
  extendedTranslations: Record<Language, T>
): Record<Language, BaseTranslations & T> {
  if (!extendedTranslations) {
    logger.debug('No extended translations provided, using base only', {}, 'Translations');
    return translations as Record<Language, BaseTranslations & T>;
  }
  
  const esKeys = Object.keys(extendedTranslations.es || {}).length;
  const enKeys = Object.keys(extendedTranslations.en || {}).length;
  
  logger.info('Merging translations', { esExtendedKeys: esKeys, enExtendedKeys: enKeys }, 'Translations');
  
  return {
    es: { ...translations.es, ...(extendedTranslations.es || {}) },
    en: { ...translations.en, ...(extendedTranslations.en || {}) },
  };
}
