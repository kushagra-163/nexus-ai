import express from 'express';
import { getCareerPaths, assessCareerPath } from '../controllers/career.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/paths', getCareerPaths);
router.post('/assess', assessCareerPath);

export default router;
