import express from 'express';
import { getProfile, updateProfile, submitOnboarding } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/onboarding', submitOnboarding);

export default router;
