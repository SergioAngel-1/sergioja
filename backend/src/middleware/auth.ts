import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/authService';
import { logger } from '../lib/logger';

/**
 * Middleware para verificar autenticación con JWT
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Obtener token de cookie o header Authorization
    let token = req.cookies.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No se proporcionó token de autenticación',
        },
      });
    }

    // Verificar token
    const payload = verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Token inválido o expirado',
        },
      });
    }

    // Agregar información del usuario al request
    (req as any).user = payload;

    next();
  } catch (error) {
    logger.error('Auth middleware error', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
      },
    });
  }
}

/**
 * Middleware para verificar rol de admin
 */
export function adminRoleMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'No tienes permisos para acceder a este recurso',
      },
    });
  }

  next();
}
