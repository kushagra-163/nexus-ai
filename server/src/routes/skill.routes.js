import express from 'express';
import { getSkills, addSkill, updateSkill, deleteSkill, getSkillGapAnalysis } from '../controllers/skill.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSkills);
router.post('/', addSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);
router.get('/gap-analysis', getSkillGapAnalysis);

export default router;
