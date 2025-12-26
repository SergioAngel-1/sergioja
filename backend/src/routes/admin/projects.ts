import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getAllProjects } from './projects/getAllProjects';
import { createProject } from './projects/createProject';
import { updateProject } from './projects/updateProject';
import { deleteProject } from './projects/deleteProject';
import { regenerateSlug } from './projects/regenerateSlug';
import { checkSlug } from './projects/checkSlug';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/admin/projects - Obtener todos los proyectos (incluyendo borradores)
router.get('/', getAllProjects);

// POST /api/admin/projects - Crear nuevo proyecto
router.post('/', createProject);

// GET /api/admin/projects/slug/check - Validar disponibilidad de slug
router.get('/slug/check', checkSlug);

// POST /api/admin/projects/:slug/regenerate-slug - Regenerar slug desde el título
router.post('/:slug/regenerate-slug', regenerateSlug);

// PUT /api/admin/projects/:slug - Actualizar proyecto
router.put('/:slug', updateProject);

// DELETE /api/admin/projects/:slug - Eliminar proyecto
router.delete('/:slug', deleteProject);

export default router;