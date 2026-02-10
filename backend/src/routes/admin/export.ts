import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middleware/errorHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// All export routes require authentication
router.use(authMiddleware);

// GET /api/admin/export/full - Export entire database as JSON (for local import)
router.get('/full', asyncHandler(async (_req: Request, res: Response) => {
  logger.info('Full database export requested');
  const startTime = Date.now();

  const [
    profiles,
    projects,
    technologies,
    projectTechnologies,
    projectCategories,
    technologyCategories,
    contactSubmissions,
    newsletterSubscriptions,
    slugRedirects,
    pageViews,
    projectViews,
    webVitalsMetrics,
    adminUsers,
  ] = await Promise.all([
    prisma.profile.findMany(),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.technology.findMany({ orderBy: { name: 'asc' } }),
    prisma.projectTechnology.findMany(),
    prisma.projectCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.technologyCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.newsletterSubscription.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.slugRedirect.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.pageView.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.projectView.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.webVitalsMetric.findMany({ orderBy: { createdAt: 'desc' } }),
    // Export admin users without password hashes
    prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const duration = Date.now() - startTime;

  const exportData = {
    _meta: {
      exportedAt: new Date().toISOString(),
      durationMs: duration,
      version: 1,
      counts: {
        profiles: profiles.length,
        projects: projects.length,
        technologies: technologies.length,
        projectTechnologies: projectTechnologies.length,
        projectCategories: projectCategories.length,
        technologyCategories: technologyCategories.length,
        contactSubmissions: contactSubmissions.length,
        newsletterSubscriptions: newsletterSubscriptions.length,
        slugRedirects: slugRedirects.length,
        pageViews: pageViews.length,
        projectViews: projectViews.length,
        webVitalsMetrics: webVitalsMetrics.length,
        adminUsers: adminUsers.length,
      },
    },
    profiles,
    projects,
    technologies,
    projectTechnologies,
    projectCategories,
    technologyCategories,
    contactSubmissions,
    newsletterSubscriptions,
    slugRedirects,
    pageViews,
    projectViews,
    webVitalsMetrics,
    adminUsers,
  };

  const totalRecords = Object.values(exportData._meta.counts).reduce((a, b) => a + b, 0);
  logger.info(`Full database export completed: ${totalRecords} records in ${duration}ms`);

  res.json({
    success: true,
    data: exportData,
    timestamp: new Date().toISOString(),
  });
}));

// POST /api/admin/export/import - Import full database from JSON export
router.post('/import', asyncHandler(async (req: Request, res: Response) => {
  logger.info('Full database import requested');
  const startTime = Date.now();

  const data = req.body;

  if (!data || !data._meta || data._meta.version !== 1) {
    return res.status(400).json({
      success: false,
      error: { message: 'Invalid export file format or version', code: 'INVALID_FORMAT' },
      timestamp: new Date().toISOString(),
    });
  }

  const imported: Record<string, number> = {};

  await prisma.$transaction(async (tx) => {
    // 1. Delete in reverse dependency order (children first)
    await tx.projectView.deleteMany();
    await tx.projectTechnology.deleteMany();
    await tx.slugRedirect.deleteMany();
    await tx.webVitalsMetric.deleteMany();
    await tx.pageView.deleteMany();
    await tx.contactSubmission.deleteMany();
    await tx.newsletterSubscription.deleteMany();
    await tx.refreshToken.deleteMany();
    await tx.project.deleteMany();
    await tx.technology.deleteMany();
    await tx.projectCategory.deleteMany();
    await tx.technologyCategory.deleteMany();
    await tx.profile.deleteMany();
    // AdminUsers NOT deleted — keep local admin credentials

    // 2. Insert in dependency order (parents first)

    // Profiles
    if (data.profiles?.length) {
      for (const row of data.profiles) {
        await tx.profile.create({ data: { ...row, createdAt: new Date(row.createdAt), updatedAt: new Date(row.updatedAt) } });
      }
      imported.profiles = data.profiles.length;
    }

    // Project Categories
    if (data.projectCategories?.length) {
      for (const row of data.projectCategories) {
        await tx.projectCategory.create({ data: { ...row, createdAt: new Date(row.createdAt), updatedAt: new Date(row.updatedAt) } });
      }
      imported.projectCategories = data.projectCategories.length;
    }

    // Technology Categories
    if (data.technologyCategories?.length) {
      for (const row of data.technologyCategories) {
        await tx.technologyCategory.create({ data: { ...row, createdAt: new Date(row.createdAt), updatedAt: new Date(row.updatedAt) } });
      }
      imported.technologyCategories = data.technologyCategories.length;
    }

    // Technologies
    if (data.technologies?.length) {
      for (const row of data.technologies) {
        const { projects, ...techData } = row; // Strip relation fields if present
        await tx.technology.create({ data: { ...techData, createdAt: new Date(techData.createdAt), updatedAt: new Date(techData.updatedAt) } });
      }
      imported.technologies = data.technologies.length;
    }

    // Projects
    if (data.projects?.length) {
      for (const row of data.projects) {
        const { technologies, views, slugRedirects: _sr, ...projectData } = row; // Strip relation fields
        await tx.project.create({
          data: {
            ...projectData,
            createdAt: new Date(projectData.createdAt),
            updatedAt: new Date(projectData.updatedAt),
            publishedAt: projectData.publishedAt ? new Date(projectData.publishedAt) : null,
          },
        });
      }
      imported.projects = data.projects.length;
    }

    // ProjectTechnologies (M2M — depends on projects + technologies)
    if (data.projectTechnologies?.length) {
      for (const row of data.projectTechnologies) {
        const { project, technology, ...ptData } = row; // Strip relation fields
        await tx.projectTechnology.create({ data: { ...ptData, createdAt: new Date(ptData.createdAt) } });
      }
      imported.projectTechnologies = data.projectTechnologies.length;
    }

    // Slug Redirects (depends on projects)
    if (data.slugRedirects?.length) {
      for (const row of data.slugRedirects) {
        const { project, ...redirectData } = row;
        await tx.slugRedirect.create({ data: { ...redirectData, createdAt: new Date(redirectData.createdAt) } });
      }
      imported.slugRedirects = data.slugRedirects.length;
    }

    // Contact Submissions
    if (data.contactSubmissions?.length) {
      for (const row of data.contactSubmissions) {
        await tx.contactSubmission.create({ data: { ...row, createdAt: new Date(row.createdAt), updatedAt: new Date(row.updatedAt) } });
      }
      imported.contactSubmissions = data.contactSubmissions.length;
    }

    // Newsletter Subscriptions
    if (data.newsletterSubscriptions?.length) {
      for (const row of data.newsletterSubscriptions) {
        await tx.newsletterSubscription.create({ data: { ...row, createdAt: new Date(row.createdAt), updatedAt: new Date(row.updatedAt) } });
      }
      imported.newsletterSubscriptions = data.newsletterSubscriptions.length;
    }

    // Page Views
    if (data.pageViews?.length) {
      for (const row of data.pageViews) {
        await tx.pageView.create({ data: { ...row, createdAt: new Date(row.createdAt) } });
      }
      imported.pageViews = data.pageViews.length;
    }

    // Project Views (depends on projects)
    if (data.projectViews?.length) {
      for (const row of data.projectViews) {
        const { project, ...pvData } = row;
        await tx.projectView.create({ data: { ...pvData, createdAt: new Date(pvData.createdAt) } });
      }
      imported.projectViews = data.projectViews.length;
    }

    // Web Vitals Metrics
    if (data.webVitalsMetrics?.length) {
      for (const row of data.webVitalsMetrics) {
        await tx.webVitalsMetric.create({ data: { ...row, timestamp: new Date(row.timestamp), createdAt: new Date(row.createdAt) } });
      }
      imported.webVitalsMetrics = data.webVitalsMetrics.length;
    }
  }, { timeout: 120000 }); // 2 min timeout for large imports

  const duration = Date.now() - startTime;
  const totalRecords = Object.values(imported).reduce((a, b) => a + b, 0);
  logger.info(`Full database import completed: ${totalRecords} records in ${duration}ms`);

  res.json({
    success: true,
    data: { imported, totalRecords, durationMs: duration },
    timestamp: new Date().toISOString(),
  });
}));

export default router;
