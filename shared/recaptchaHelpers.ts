/**
 * reCAPTCHA Enterprise Helpers
 * Shared utilities for reCAPTCHA Enterprise integration across all forms
 */

/// <reference lib="dom" />

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
  // Bypass en desarrollo
  if (process.env.NODE_ENV === 'development') {
    return 'dev-bypass-token';
  }

  try {
    // Verificar que grecaptcha Enterprise esté disponible
    if (!isRecaptchaLoaded()) {
      console.warn('reCAPTCHA Enterprise not loaded');
      return null;
    }

    // Esperar a que reCAPTCHA esté listo (con timeout)
    await waitForRecaptchaReady();

    // Intento 1: Ejecutar con el site key directamente
    try {
      return await window.grecaptcha.enterprise.execute(siteKey, { action });
    } catch (error) {
      // Si falla (e.g., "No reCAPTCHA clients exist"), crear un cliente explícito
      console.warn('Direct execute failed, rendering explicit client:', error);
      
      // Crear contenedor oculto para el cliente
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);

      // Renderizar cliente explícito
      const clientId = window.grecaptcha.enterprise.render(container, { sitekey: siteKey });

      // Ejecutar con el clientId
      return await window.grecaptcha.enterprise.execute(clientId, { action });
    }
  } catch (error) {
    console.error('Error al obtener token de reCAPTCHA:', error);
    return null;
  }
}

/**
 * Constantes de acciones reCAPTCHA para mantener consistencia
 */
export const RECAPTCHA_ACTIONS = {
  SUBMIT_CONTACT: 'submit_contact',
  SUBSCRIBE_NEWSLETTER: 'subscribe_newsletter',
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const;

export type RecaptchaAction = typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS];
