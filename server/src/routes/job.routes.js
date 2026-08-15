import express from 'express';
import { matchJobDescription, getJobMatchHistory } from '../controllers/job.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/match', matchJobDescription);
router.get('/history', getJobMatchHistory);

export default router;
