/**
 * Analytics Helpers para Main
 * Re-exporta funciones compartidas con source='main' por defecto
 */

import {
  trackEvent as sharedTrackEvent,
  trackContactSubmit as sharedTrackContactSubmit,
  trackNewsletterSubscribe as sharedTrackNewsletterSubscribe,
  trackPageView as sharedTrackPageView,
  trackUserAction as sharedTrackUserAction,
  trackError as sharedTrackError,
  trackConversion as sharedTrackConversion,
  trackSearch as sharedTrackSearch,
  trackDownload as sharedTrackDownload,
  trackOutboundLink as sharedTrackOutboundLink,
  trackScrollDepth as sharedTrackScrollDepth,
  trackTimeOnPage as sharedTrackTimeOnPage,
  type GA4Event,
} from '@/shared/analytics';

const SOURCE = 'main';

// Re-exportar tipo
export type { GA4Event };

/**
 * Track evento genérico con source='main'
 */
export function trackEvent(event: GA4Event): void {
  sharedTrackEvent({ ...event, source: SOURCE });
}

/**
 * Track envío de formulario de contacto
 */
export function trackContactSubmit(formName: string): void {
  sharedTrackContactSubmit(SOURCE, formName);
}

/**
 * Track suscripción a newsletter
 */
export function trackNewsletterSubscribe(formName: string): void {
  sharedTrackNewsletterSubscribe(SOURCE, formName);
}

/**
 * Track navegación de página
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  sharedTrackPageView(SOURCE, pagePath, pageTitle);
}

/**
 * Track acción del usuario
 */
export function trackUserAction(action: string, category?: string, label?: string, value?: number): void {
  sharedTrackUserAction(SOURCE, action, category, label, value);
}

/**
 * Track error
 */
export function trackError(errorType: string, errorMessage: string, errorStack?: string): void {
  sharedTrackError(SOURCE, errorType, errorMessage, errorStack);
}

/**
 * Track conversión
 */
export function trackConversion(conversionType: string, value?: number, currency?: string): void {
  sharedTrackConversion(SOURCE, conversionType, value, currency);
}

/**
 * Track búsqueda
 */
export function trackSearch(searchTerm: string, resultsCount?: number): void {
  sharedTrackSearch(SOURCE, searchTerm, resultsCount);
}

/**
 * Track descarga
 */
export function trackDownload(fileName: string, fileType?: string): void {
  sharedTrackDownload(SOURCE, fileName, fileType);
}

/**
 * Track click en enlace externo
 */
export function trackOutboundLink(url: string, linkText?: string): void {
  sharedTrackOutboundLink(SOURCE, url, linkText);
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: number): void {
  sharedTrackScrollDepth(SOURCE, depth);
}

/**
 * Track tiempo en página
 */
export function trackTimeOnPage(seconds: number): void {
  sharedTrackTimeOnPage(SOURCE, seconds);
}
