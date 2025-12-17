'use client';

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

/**
 * Determina el rating de una métrica según los umbrales de Google
 */
function getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;
  
  // Umbrales según Web Vitals de Google
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FID: [100, 300],
    FCP: [1800, 3000],
    LCP: [2500, 4000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [good, poor] = thresholds[name] || [0, 0];
  
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Envía métricas al backend para análisis
 */
async function sendToAnalytics(metric: WebVitalsMetric, logger?: any) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    // Solo enviar en producción
    if (process.env.NODE_ENV !== 'production') {
      if (logger?.debug) {
        logger.debug('Web Vitals (dev)', metric);
      }
      return;
    }

    await fetch(`${apiUrl}/api/portfolio/analytics/web-vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...metric,
        url: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    // Silently fail - no queremos afectar la UX por errores de analytics
    if (logger?.warn) {
      logger.warn('Failed to send Web Vitals', error);
    }
  }
}

/**
 * Handler genérico para todas las métricas
 */
function handleMetric(metric: Metric, logger?: any) {
  const webVitalsMetric: WebVitalsMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  // Log en consola para debugging
  const emoji = webVitalsMetric.rating === 'good' ? '✅' : webVitalsMetric.rating === 'needs-improvement' ? '⚠️' : '❌';
  
  if (logger?.performance) {
    logger.performance(
      `${emoji} ${metric.name}`,
      Math.round(metric.value),
      metric.name === 'CLS' ? '' : 'ms'
    );
  }

  // Enviar a analytics
  sendToAnalytics(webVitalsMetric, logger);
}

/**
 * Inicializa el tracking de Web Vitals
 * Debe ser llamado en el cliente (useEffect)
 */
export function initWebVitals(logger?: any) {
  if (typeof window === 'undefined') return;

  try {
    // Core Web Vitals
    onCLS((metric) => handleMetric(metric, logger));  // Cumulative Layout Shift
    onFID((metric) => handleMetric(metric, logger));  // First Input Delay (deprecated, usar INP)
    onLCP((metric) => handleMetric(metric, logger));  // Largest Contentful Paint

    // Otras métricas importantes
    onFCP((metric) => handleMetric(metric, logger));  // First Contentful Paint
    onTTFB((metric) => handleMetric(metric, logger)); // Time to First Byte
    onINP((metric) => handleMetric(metric, logger));  // Interaction to Next Paint (reemplaza FID)

    if (logger?.info) {
      logger.info('Web Vitals tracking initialized', 'webVitals');
    }
  } catch (error) {
    if (logger?.error) {
      logger.error('Failed to initialize Web Vitals', error, 'webVitals');
    }
  }
}

/**
 * Hook para usar en componentes
 */
export function useWebVitals(logger?: any) {
  if (typeof window === 'undefined') return;
  
  // Solo inicializar una vez
  if (!(window as any).__webVitalsInitialized) {
    initWebVitals(logger);
    (window as any).__webVitalsInitialized = true;
  }
}
