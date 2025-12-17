/**
 * Analytics Helpers - Shared Module
 * Funciones para tracking de eventos en GA4 via GTM
 * Usado por todos los frontends (main, portfolio, admin)
 */

import { logger } from './logger';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export interface GA4Event {
  event: string;
  source?: string;
  [key: string]: any;
}

/**
 * Push evento a dataLayer de GTM
 */
export function trackEvent(event: GA4Event): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      ...event,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error tracking event', error, 'Analytics');
  }
}

/**
 * Track login exitoso
 */
export function trackLoginSuccess(source: string, method: string = 'email'): void {
  trackEvent({
    event: 'login_success',
    source,
    method,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track login fallido
 */
export function trackLoginFailed(source: string, reason: string, method: string = 'email'): void {
  trackEvent({
    event: 'login_failed',
    source,
    method,
    reason,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track error de login
 */
export function trackLoginError(source: string, reason: string, method: string = 'email'): void {
  trackEvent({
    event: 'login_error',
    source,
    method,
    reason,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track envío de formulario de contacto
 */
export function trackContactSubmit(source: string, formName: string): void {
  trackEvent({
    event: 'contact_submit',
    source,
    form_name: formName,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track suscripción a newsletter
 */
export function trackNewsletterSubscribe(source: string, formName: string): void {
  trackEvent({
    event: 'newsletter_subscribe',
    source,
    form_name: formName,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track navegación de página
 */
export function trackPageView(source: string, pagePath: string, pageTitle?: string): void {
  trackEvent({
    event: 'page_view',
    source,
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== 'undefined' ? document.title : undefined),
  });
}

/**
 * Track acción del usuario
 */
export function trackUserAction(
  source: string,
  action: string,
  category?: string,
  label?: string,
  value?: number
): void {
  trackEvent({
    event: 'user_action',
    source,
    action,
    category,
    label,
    value,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track descarga
 */
export function trackDownload(source: string, fileName: string, fileType?: string): void {
  trackEvent({
    event: 'download',
    source,
    file_name: fileName,
    file_type: fileType,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track click en enlace externo
 */
export function trackOutboundLink(source: string, url: string, linkText?: string): void {
  trackEvent({
    event: 'outbound_link',
    source,
    url,
    link_text: linkText,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(source: string, depth: number): void {
  trackEvent({
    event: 'scroll_depth',
    source,
    depth_percentage: depth,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track tiempo en página
 */
export function trackTimeOnPage(source: string, seconds: number): void {
  trackEvent({
    event: 'time_on_page',
    source,
    seconds,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  });
}

/**
 * Track error general
 */
export function trackError(
  source: string,
  errorType: string,
  errorMessage: string,
  errorStack?: string,
  context?: string
): void {
  trackEvent({
    event: 'error',
    source,
    error_type: errorType,
    error_message: errorMessage,
    error_stack: errorStack,
    context,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  });
}
