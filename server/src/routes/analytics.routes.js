import express from 'express';
import { getDashboardSummary } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard-summary', getDashboardSummary);

export default router;
