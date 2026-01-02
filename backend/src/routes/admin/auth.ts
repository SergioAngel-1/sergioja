import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { authenticateUser, refreshAccessToken, revokeRefreshToken, revokeAllUserTokens } from '../../services/authService';
import { verifyRecaptchaEnterprise } from '../../services/recaptchaService';
import { logger } from '../../lib/logger';
import { authMiddleware } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos (aumentado de 5 para mejor UX)
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== 'production',
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en 15 minutos.',
    },
  },
});

// Schema de validación para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
  recaptchaToken: z.string().optional(),
  recaptchaAction: z.string().optional(),
});

// Schema de validación para refresh token
const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

/**
 * POST /api/admin/auth/login
 * Login de usuario admin
 */
router.post('/login', loginLimiter, asyncHandler(async (req: Request, res: Response) => {
  // Validar request body
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos de login inválidos',
        details: validation.error.errors,
      },
    });
  }

  const { email, password, recaptchaToken, recaptchaAction } = validation.data;

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    if (!recaptchaToken) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'RECAPTCHA_REQUIRED',
          message: 'Verificación de seguridad requerida',
        },
      });
    }

    const recaptchaResult = await verifyRecaptchaEnterprise(
      recaptchaToken,
      recaptchaAction || 'admin_login'
    );

    if (!recaptchaResult.valid) {
      logger.warn('reCAPTCHA verification failed for login', {
        email,
        score: recaptchaResult.score,
        reasons: recaptchaResult.reasons,
      });

      return res.status(403).json({
        success: false,
        error: {
          code: 'RECAPTCHA_FAILED',
          message: 'Verificación de seguridad fallida',
        },
      });
    }
  }

  // Autenticar usuario
  const result = await authenticateUser(email, password);

  if (!result) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Email o password incorrectos',
      },
    });
  }

  const { user, tokens } = result;

  // Configurar cookies HTTP-only con los tokens
  const isProduction = isProd;

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // 'none' requiere secure=true en prod
    maxAge: 15 * 60 * 1000, // 15 minutos
    path: '/',
    domain: isProduction ? '.sergioja.com' : undefined, // Compartir entre subdominios
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    path: '/',
    domain: isProduction ? '.sergioja.com' : undefined,
  });

  logger.info('User logged in successfully', { userId: user.id, email: user.email });

  return res.status(200).json({
    success: true,
    data: {
      user,
      // También enviar tokens en response body para compatibilidad
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
}));

/**
 * POST /api/admin/auth/refresh
 * Refrescar access token usando refresh token
 */
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  // Obtener refresh token de cookie o body
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_REFRESH_TOKEN',
        message: 'Refresh token no proporcionado',
      },
    });
  }

  // Refrescar tokens
  const tokens = await refreshAccessToken(refreshToken);

  if (!tokens) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token inválido o expirado',
      },
    });
  }

  // Configurar nuevas cookies
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
    domain: isProduction ? '.sergioja.com' : undefined,
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
    domain: isProduction ? '.sergioja.com' : undefined,
  });

  logger.info('Tokens refreshed successfully');

  return res.status(200).json({
    success: true,
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
}));

/**
 * POST /api/admin/auth/logout
 * Logout de usuario (revoca refresh token)
 */
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  // Limpiar cookies
  const isProd = process.env.NODE_ENV === 'production';
  const clearOpts: any = isProd ? { path: '/', domain: '.sergioja.com' } : { path: '/' };
  res.clearCookie('accessToken', clearOpts);
  res.clearCookie('refreshToken', clearOpts);

  logger.info('User logged out successfully');

  return res.status(200).json({
    success: true,
    data: {
      message: 'Logout exitoso',
    },
  });
}));

/**
 * POST /api/admin/auth/logout-all
 * Revoca todos los refresh tokens del usuario autenticado
 */
router.post('/logout-all', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  await revokeAllUserTokens(userId);

  // Limpiar cookies
  const isProd = process.env.NODE_ENV === 'production';
  const clearOpts: any = isProd ? { path: '/', domain: '.sergioja.com' } : { path: '/' };
  res.clearCookie('accessToken', clearOpts);
  res.clearCookie('refreshToken', clearOpts);

  logger.info('All user sessions revoked', { userId });

  return res.status(200).json({
    success: true,
    data: {
      message: 'Todas las sesiones han sido cerradas',
    },
  });
}));

/**
 * GET /api/admin/auth/me
 * Obtener información del usuario autenticado
 */
router.get('/me', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  return res.status(200).json({
    success: true,
    data: { user },
  });
}));

/**
 * POST /api/admin/auth/change-password
 * Cambiar contraseña del usuario autenticado
 */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
});

router.post('/change-password', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const validation = changePasswordSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos',
        details: validation.error.errors,
      },
    });
  }

  const { currentPassword, newPassword } = validation.data;
  const userId = (req as any).user.userId;

  // Obtener usuario de la base de datos
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      },
    });
  }

  // Verificar contraseña actual
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_PASSWORD',
        message: 'Contraseña actual incorrecta',
      },
    });
  }

  // Verificar que la nueva contraseña sea diferente
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'SAME_PASSWORD',
        message: 'La nueva contraseña debe ser diferente a la actual',
      },
    });
  }

  // Hash de la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar contraseña
  await prisma.adminUser.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  logger.info('Password changed successfully', { userId });

  return res.status(200).json({
    success: true,
    data: {
      message: 'Contraseña actualizada exitosamente',
    },
  });
}));

export default router;
