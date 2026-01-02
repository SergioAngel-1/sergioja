/**
 * reCAPTCHA Enterprise Helpers
 * Shared utilities for reCAPTCHA Enterprise integration across all forms
 */

/// <reference lib="dom" />

import { logger } from './logger';

// Declarar tipo global para grecaptcha Enterprise
declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKeyOrClientId: string | number, options?: { action: string }) => Promise<string>;
        render: (container: HTMLElement, options: { sitekey: string }) => number;
        reset: (clientId?: number) => void;
      };
    };
  }
}

/**
 * Verifica si reCAPTCHA Enterprise está cargado y disponible
 * 
 * @returns true si grecaptcha.enterprise está disponible
 */
export function isRecaptchaLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.grecaptcha?.enterprise;
}

/**
 * Espera a que reCAPTCHA Enterprise esté listo
 * 
 * @param timeoutMs - Tiempo máximo de espera en milisegundos (default: 10000)
 * @returns Promise que se resuelve cuando reCAPTCHA está listo o rechaza si timeout
 */
export async function waitForRecaptchaReady(timeoutMs: number = 10000): Promise<void> {
  if (!isRecaptchaLoaded()) {
    throw new Error('reCAPTCHA Enterprise not loaded');
  }

  return Promise.race([
    new Promise<void>((resolve) => window.grecaptcha.enterprise.ready(() => resolve())),
    new Promise<void>((_, reject) => 
      setTimeout(() => reject(new Error('reCAPTCHA ready timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Obtiene un token de reCAPTCHA Enterprise para la acción especificada
 * 
 * @param siteKey - La clave pública de reCAPTCHA Enterprise (NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
 * @param action - La acción a registrar (e.g., 'submit_contact', 'subscribe_newsletter')
 * @returns Token de reCAPTCHA o null si falla
 * 
 * @example
 * ```ts
 * const token = await getReCaptchaToken(
 *   process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
 *   'submit_contact'
 * );
 * ```
 */
export async function getReCaptchaToken(
  siteKey: string,
  action: string = 'submit'
): Promise<string | null> {
  if (!siteKey) {
    logger.error('reCAPTCHA site key not provided', undefined, 'reCAPTCHA');
    return null;
  }

  try {
    // Asegurar que reCAPTCHA Enterprise esté cargado (autocarga si es necesario)
    if (!isRecaptchaLoaded()) {
      await loadRecaptchaEnterprise(siteKey);
    }

    // Esperar a que reCAPTCHA esté listo (con timeout de 10s)
    await waitForRecaptchaReady();

    // Ejecutar reCAPTCHA Enterprise con el site key
    const token = await window.grecaptcha.enterprise.execute(siteKey, { action });
    
    if (!token) {
      logger.error('reCAPTCHA Enterprise returned empty token', undefined, 'reCAPTCHA');
      return null;
    }

    return token;
  } catch (error) {
    logger.error('Error obtaining reCAPTCHA token', error, 'reCAPTCHA');
    return null;
  }
}

export async function loadRecaptchaEnterprise(siteKey: string, timeoutMs: number = 10000): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!siteKey) throw new Error('reCAPTCHA site key not provided');

  if (isRecaptchaLoaded()) {
    await waitForRecaptchaReady(timeoutMs);
    return;
  }

  const existing = document.querySelector('script[src*="recaptcha/enterprise.js"]') as HTMLScriptElement | null;
  if (!existing) {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  await new Promise<void>((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (isRecaptchaLoaded()) return resolve();
      if (Date.now() - start > timeoutMs) return reject(new Error('reCAPTCHA script load timeout'));
      setTimeout(check, 50);
    };
    check();
  });

  await waitForRecaptchaReady(timeoutMs);
}

/**
 * Constantes de acciones reCAPTCHA para mantener consistencia
 */
export const RECAPTCHA_ACTIONS = {
  SUBMIT_CONTACT: 'submit_contact',
  SUBSCRIBE_NEWSLETTER: 'subscribe_newsletter',
  ADMIN_LOGIN: 'admin_login',
  SIGNUP: 'signup',
} as const;

export type RecaptchaAction = typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS];
