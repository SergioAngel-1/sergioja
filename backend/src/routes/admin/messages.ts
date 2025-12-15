import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/admin/messages - Obtener todos los mensajes
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { status, source, limit = '50', offset = '0' } = req.query;

  const where: Record<string, unknown> = {};

  if (status && typeof status === 'string') {
    where.status = status;
  }

  if (source && typeof source === 'string') {
    where.source = source;
  }

  const messages = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
  });

  const total = await prisma.contactSubmission.count({ where });

  logger.info('Messages retrieved', { count: messages.length, total });

  res.json({
    success: true,
    data: {
      messages,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    },
  });
}));

// GET /api/admin/messages/:id - Obtener un mensaje específico
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const message = await prisma.contactSubmission.findUnique({
    where: { id },
  });

  if (!message) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Mensaje no encontrado',
      },
    });
  }

  logger.info('Message retrieved', { id });

  res.json({
    success: true,
    data: message,
  });
}));

// PUT /api/admin/messages/:id/status - Actualizar estado del mensaje
router.put('/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['new', 'read', 'replied', 'spam'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_STATUS',
        message: 'Estado inválido',
      },
    });
  }

  const message = await prisma.contactSubmission.update({
    where: { id },
    data: { status },
  });

  logger.info('Message status updated', { id, status });

  res.json({
    success: true,
    data: message,
  });
}));

// DELETE /api/admin/messages/:id - Eliminar mensaje
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.contactSubmission.delete({
    where: { id },
  });

  logger.info('Message deleted', { id });

  res.json({
    success: true,
    data: { id },
  });
}));

export default router;
