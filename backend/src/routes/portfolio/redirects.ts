import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();

// GET /api/portfolio/redirects/:slug - Obtener redirección para un slug antiguo
router.get('/:slug', asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const redirect = await prisma.slugRedirect.findUnique({
    where: { oldSlug: slug },
    select: { newSlug: true },
  });
  
  if (redirect) {
    return res.json({
      success: true,
      data: { redirectTo: redirect.newSlug },
    });
  }
  
  return res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'No redirect found' },
  });
}));

// GET /api/portfolio/redirects - Obtener todas las redirecciones (para next.config.js)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const redirects = await prisma.slugRedirect.findMany({
    select: {
      oldSlug: true,
      newSlug: true,
    },
  });
  
  return res.json({
    success: true,
    data: redirects,
  });
}));

export default router;
