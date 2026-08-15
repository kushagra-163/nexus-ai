import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, analyzeProjectWithAI } from '../controllers/project.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/analyze', analyzeProjectWithAI);

export default router;
