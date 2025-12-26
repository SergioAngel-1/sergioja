import { Request, Response } from 'express';
import { prisma } from '../../../lib/prisma';
import { slugify } from '../../../lib/slugify';
import { validateSlug } from '../../../lib/slugHelpers';
import { asyncHandler } from '../../../middleware/errorHandler';

export const checkSlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug, excludeSlug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'El parámetro "slug" es requerido',
      },
    });
  }

  let normalizedSlug = slugify(slug);

  if (!normalizedSlug) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_SLUG',
        message: 'El slug no contiene caracteres válidos',
      },
    });
  }

  if (normalizedSlug.length > 100) {
    normalizedSlug = normalizedSlug.substring(0, 100);
  }

  try {
    validateSlug(normalizedSlug);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_SLUG',
        message: error instanceof Error ? error.message : 'Slug inválido',
      },
    });
  }

  const existingProject = await prisma.project.findUnique({
    where: { slug: normalizedSlug },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  const available =
    !existingProject || (typeof excludeSlug === 'string' && existingProject.slug === excludeSlug);

  return res.json({
    success: true,
    data: {
      normalizedSlug,
      available,
      conflictProject: available ? null : existingProject,
    },
  });
});
