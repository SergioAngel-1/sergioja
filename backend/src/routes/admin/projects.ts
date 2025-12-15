import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { getAllProjects } from './projects/getAllProjects';
import { createProject } from './projects/createProject';
import { updateProject } from './projects/updateProject';
import { deleteProject } from './projects/deleteProject';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/admin/projects - Obtener todos los proyectos (incluyendo borradores)
router.get('/', getAllProjects);

// POST /api/admin/projects - Crear nuevo proyecto
router.post('/', createProject);

// PUT /api/admin/projects/:slug - Actualizar proyecto
router.put('/:slug', updateProject);

// DELETE /api/admin/projects/:slug - Eliminar proyecto
router.delete('/:slug', deleteProject);

export default router;