import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../middleware/auth';
import { logger } from '../../lib/logger';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/admin/messages - Obtener todos los mensajes
router.get('/', async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    logger.error('Error fetching messages', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener mensajes',
      },
    });
  }
});

// GET /api/admin/messages/:id - Obtener un mensaje específico
router.get('/:id', async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    logger.error('Error fetching message', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al obtener mensaje',
      },
    });
  }
});

// PUT /api/admin/messages/:id/status - Actualizar estado del mensaje
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    logger.error('Error updating message status', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al actualizar estado',
      },
    });
  }
});

// DELETE /api/admin/messages/:id - Eliminar mensaje
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.contactSubmission.delete({
      where: { id },
    });

    logger.info('Message deleted', { id });

    res.json({
      success: true,
      data: { id },
    });
  } catch (error) {
    logger.error('Error deleting message', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al eliminar mensaje',
      },
    });
  }
});

export default router;
