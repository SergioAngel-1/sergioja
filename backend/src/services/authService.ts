import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { appConfig } from '../config/env';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const JWT_SECRET = appConfig.jwt.secret as string;
const REFRESH_TOKEN_SECRET = appConfig.jwt.refreshSecret as string;

// Duración de tokens
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutos
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 días

/**
 * Genera access token y refresh token
 */
export function generateTokens(payload: TokenPayload): AuthTokens {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verifica access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.debug('Access token verification failed', error);
    return null;
  }
}

/**
 * Verifica refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.debug('Refresh token verification failed', error);
    return null;
  }
}

/**
 * Autentica usuario con email y password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: any; tokens: AuthTokens } | null> {
  try {
    // Usar transacción para optimizar queries y garantizar atomicidad
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Buscar usuario en base de datos
      const user = await tx.adminUser.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          role: true,
          isActive: true,
        },
      });

      if (!user) {
        logger.warn('Login attempt with non-existent email', { email });
        return null;
      }

      if (!user.isActive) {
        logger.warn('Login attempt with inactive user', { email });
        return null;
      }

      // Verificar password (fuera de la transacción para no bloquear)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        logger.warn('Login attempt with invalid password', { email });
        return null;
      }

      // Generar tokens
      const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = generateTokens(payload);

      // Guardar refresh token en base de datos (dentro de la transacción)
      await tx.refreshToken.create({
        data: {
          token: hashToken(tokens.refreshToken),
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        },
      });

      // Remover password del objeto user
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        tokens,
      };
    });

    if (!result) {
      return null;
    }

    logger.info('User authenticated successfully', { userId: result.user.id, email: result.user.email });

    return result;
  } catch (error) {
    logger.error('Authentication error', error);
    return null;
  }
}

/**
 * Refresca access token usando refresh token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    // Verificar refresh token
    const payload = verifyRefreshToken(refreshToken);
    
    if (!payload) {
      return null;
    }

    // Verificar que el refresh token existe en la base de datos y no ha sido revocado
    const tokenHash = hashToken(refreshToken);
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: tokenHash,
        userId: payload.userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedToken) {
      logger.warn('Refresh token not found or revoked', { userId: payload.userId });
      return null;
    }

    // Verificar que el usuario sigue activo
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      logger.warn('User not found or inactive during token refresh', { userId: payload.userId });
      return null;
    }

    // Generar nuevos tokens
    const newPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(newPayload);

    // Revocar el refresh token anterior
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Guardar nuevo refresh token
    await prisma.refreshToken.create({
      data: {
        token: hashToken(tokens.refreshToken),
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info('Access token refreshed', { userId: user.id });

    return tokens;
  } catch (error) {
    logger.error('Token refresh error', error);
    return null;
  }
}

/**
 * Revoca refresh token (logout)
 */
export async function revokeRefreshToken(refreshToken: string): Promise<boolean> {
  try {
    const tokenHash = hashToken(refreshToken);
    const result = await prisma.refreshToken.updateMany({
      where: {
        token: tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return result.count > 0;
  } catch (error) {
    logger.error('Error revoking refresh token', error);
    return false;
  }
}

/**
 * Revoca todos los refresh tokens de un usuario
 */
export async function revokeAllUserTokens(userId: string): Promise<boolean> {
  try {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    logger.info('All user tokens revoked', { userId });
    return true;
  } catch (error) {
    logger.error('Error revoking all user tokens', error);
    return false;
  }
}

/**
 * Limpia refresh tokens expirados (tarea de mantenimiento)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null } },
        ],
      },
    });

    logger.info('Expired tokens cleaned up', { count: result.count });
    return result.count;
  } catch (error) {
    logger.error('Error cleaning up expired tokens', error);
    return 0;
  }
}
