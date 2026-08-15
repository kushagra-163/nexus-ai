import express from 'express';
import { getRoadmap, generateRoadmap, updateItemStatus } from '../controllers/roadmap.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getRoadmap);
router.post('/generate', generateRoadmap);
router.patch('/status', updateItemStatus);

export default router;
