import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateUser, refreshAccessToken, revokeRefreshToken, revokeAllUserTokens } from '../services/authService';
import { verifyRecaptchaEnterprise } from '../services/recaptchaService';
import { logger } from '../lib/logger';
import { authMiddleware } from '../middleware/auth';

const router = Router();

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
router.post('/login', async (req: Request, res: Response) => {
  try {
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

    // Verificar reCAPTCHA en producción
    if (process.env.NODE_ENV === 'production' && recaptchaToken) {
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

      logger.info('reCAPTCHA verification successful', {
        email,
        score: recaptchaResult.score,
      });
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
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/',
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
  } catch (error) {
    logger.error('Login error', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

/**
 * POST /api/admin/auth/refresh
 * Refrescar access token usando refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
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
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    logger.info('Tokens refreshed successfully');

    return res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    logger.error('Token refresh error', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

/**
 * POST /api/admin/auth/logout
 * Logout de usuario (revoca refresh token)
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Limpiar cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    logger.info('User logged out successfully');

    return res.status(200).json({
      success: true,
      data: {
        message: 'Logout exitoso',
      },
    });
  } catch (error) {
    logger.error('Logout error', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

/**
 * POST /api/admin/auth/logout-all
 * Revoca todos los refresh tokens del usuario autenticado
 */
router.post('/logout-all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    await revokeAllUserTokens(userId);

    // Limpiar cookies
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    logger.info('All user sessions revoked', { userId });

    return res.status(200).json({
      success: true,
      data: {
        message: 'Todas las sesiones han sido cerradas',
      },
    });
  } catch (error) {
    logger.error('Logout all error', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

/**
 * GET /api/admin/auth/me
 * Obtener información del usuario autenticado
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error('Get user info error', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
});

export default router;
