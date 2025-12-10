import { Router, Request, Response } from 'express';
import { authMiddleware, adminRoleMiddleware } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/admin/dashboard/stats
 * Obtener estadísticas del dashboard
 */
router.get(
  '/stats',
  authMiddleware,
  adminRoleMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    // Contar proyectos
    const projectsCount = await prisma.project.count();
    
    // Contar mensajes nuevos
    const messagesCount = await prisma.contactSubmission.count({
      where: { status: 'new' }
    });
    
    // Contar suscriptores activos
    const subscribersCount = await prisma.newsletterSubscription.count({
      where: { status: 'active' }
    });
    
    // Obtener visitas totales (si existe tabla de analytics)
    // Por ahora retornamos 0, se puede implementar después
    const visitsCount = 0;

    res.json({
      success: true,
      data: {
        projects: projectsCount,
        messages: messagesCount,
        subscribers: subscribersCount,
        visits: visitsCount,
      },
    });
  })
);

export default router;
