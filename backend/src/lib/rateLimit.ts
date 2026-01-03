import { Request } from 'express';
import rateLimit, { Options } from 'express-rate-limit';
import crypto from 'crypto';
import { verifyAccessToken } from '../services/authService';
import { logger } from './logger';

/**
 * Genera una clave híbrida para rate limiting:
 * - Usuarios autenticados: usa el userId del token
 * - Usuarios anónimos: usa IP + hash de User-Agent (fingerprint de dispositivo)
 * 
 * Esto permite que múltiples dispositivos en la misma red tengan
 * límites independientes, evitando bloqueos masivos por IP compartida.
 */
export const createHybridKeyGenerator = () => {
  return (req: Request): string => {
    // Para usuarios autenticados: usar userId como clave
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      try {
        const payload = verifyAccessToken(accessToken);
        if (payload?.userId) {
          return `user:${payload.userId}`;
        }
      } catch {
        // Token inválido, continuar con fingerprint anónimo
      }
    }
    
    // Para usuarios anónimos: IP + fingerprint mejorado (múltiples headers)
    const ip = getClientIp(req);
    const userAgent = req.get('user-agent') || 'unknown';
    const acceptLanguage = req.get('accept-language') || '';
    const acceptEncoding = req.get('accept-encoding') || '';
    const accept = req.get('accept') || '';
    
    // Crear un fingerprint del dispositivo basado en múltiples headers
    // Esto hace más difícil bypassear el rate limit simplemente cambiando User-Agent
    const fingerprintData = [
      userAgent,
      acceptLanguage,
      acceptEncoding,
      accept,
    ].join('|');
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(fingerprintData)
      .digest('hex')
      .substring(0, 12);
    
    return `anon:${ip}:${fingerprint}`;
  };
};

/**
 * Key generator específico para login:
 * Usa IP + email para prevenir ataques de fuerza bruta por cuenta
 * mientras permite que otros usuarios en la misma IP intenten logearse
 */
export const createLoginKeyGenerator = () => {
  return (req: Request): string => {
    const ip = getClientIp(req);
    const email = (req.body?.email || 'unknown').toLowerCase().trim();
    
    // Hash del email para privacidad en logs
    const emailHash = crypto
      .createHash('sha256')
      .update(email)
      .digest('hex')
      .substring(0, 8);
    
    return `login:${ip}:${emailHash}`;
  };
};

/**
 * Key generator solo por IP (para endpoints muy sensibles)
 */
export const createIpKeyGenerator = () => {
  return (req: Request): string => {
    return `ip:${getClientIp(req)}`;
  };
};

/**
 * Obtiene la IP real del cliente considerando proxies
 */
function getClientIp(req: Request): string {
  // Orden de prioridad para obtener IP real detrás de proxies
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    // x-forwarded-for puede ser una lista: "client, proxy1, proxy2"
    const ips = Array.isArray(forwardedFor) 
      ? forwardedFor[0] 
      : forwardedFor.split(',')[0];
    return ips.trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Handler personalizado cuando se excede el rate limit
 */
const createRateLimitHandler = (limitType: string) => {
  return (req: Request) => {
    const ip = getClientIp(req);
    const path = req.path;
    const method = req.method;
    
    logger.warn(`Rate limit exceeded: ${limitType}`, {
      ip,
      path,
      method,
      userAgent: req.get('user-agent')?.substring(0, 100),
    });
  };
};

// ============================================
// CONFIGURACIONES DE RATE LIMITERS
// ============================================

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Rate limiter para rutas públicas de LECTURA (GET)
 * Más permisivo - navegación normal del sitio
 */
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDev ? 1000 : 300, // 300 en prod, 1000 en dev
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createHybridKeyGenerator(),
  handler: (req, res) => {
    createRateLimitHandler('read')(req);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiadas solicitudes. Por favor, espera unos minutos.',
        retryAfter: Math.ceil(15 * 60), // segundos
      },
    });
  },
});

/**
 * Rate limiter para rutas de ESCRITURA (POST, PUT, DELETE)
 * Más restrictivo - acciones que modifican datos
 */
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDev ? 500 : 100, // 100 en prod, 500 en dev
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createHybridKeyGenerator(),
  handler: (req, res) => {
    createRateLimitHandler('write')(req);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiadas solicitudes de escritura. Por favor, espera unos minutos.',
        retryAfter: Math.ceil(15 * 60),
      },
    });
  },
});

/**
 * Rate limiter para rutas de ANALYTICS
 * Ventana más corta, más permisivo - se envían automáticamente
 */
export const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: isDev ? 200 : 60, // 60 por minuto en prod
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createHybridKeyGenerator(),
  skipFailedRequests: true, // No contar requests fallidas
  handler: (req, res) => {
    createRateLimitHandler('analytics')(req);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiadas métricas enviadas.',
      },
    });
  },
});

/**
 * Rate limiter para LOGIN
 * Muy restrictivo - protección contra fuerza bruta
 * Usa IP + email hash como clave
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDev ? 100 : 5, // 5 intentos por IP+email en prod
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createLoginKeyGenerator(),
  skipSuccessfulRequests: true, // No contar logins exitosos
  handler: (req, res) => {
    createRateLimitHandler('login')(req);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiados intentos de inicio de sesión. Por favor, intenta en 15 minutos.',
        retryAfter: Math.ceil(15 * 60),
      },
    });
  },
});

/**
 * Rate limiter para CONTACT FORM
 * Restrictivo - prevenir spam
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDev ? 50 : 5, // 5 mensajes por hora en prod
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createHybridKeyGenerator(),
  handler: (req, res) => {
    createRateLimitHandler('contact')(req);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Has enviado demasiados mensajes. Por favor, intenta más tarde.',
        retryAfter: Math.ceil(60 * 60),
      },
    });
  },
});

/**
 * Rate limiter para NEWSLETTER SUBSCRIPTION
 * Restrictivo - prevenir spam de suscripciones
 */
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDev ? 50 : 5, // 5 suscripciones por hora en prod
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createHybridKeyGenerator(),
  handler: (req, res) => {
    createRateLimitHandler('newsletter')(req);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Demasiadas solicitudes de suscripción. Por favor, intenta más tarde.',
        retryAfter: Math.ceil(60 * 60),
      },
    });
  },
});

/**
 * Rate limiter GLOBAL como fallback
 * Solo se aplica si otros limiters no lo hacen
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDev ? 2000 : 500, // 500 requests totales por dispositivo
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createHybridKeyGenerator(),
  handler: (req, res) => {
    createRateLimitHandler('global')(req);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Has excedido el límite de solicitudes. Por favor, espera unos minutos.',
        retryAfter: Math.ceil(15 * 60),
      },
    });
  },
});

/**
 * Middleware que aplica rate limit basado en el método HTTP
 */
export const methodBasedLimiter = (req: Request, res: any, next: any) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return readLimiter(req, res, next);
  }
  return writeLimiter(req, res, next);
};
