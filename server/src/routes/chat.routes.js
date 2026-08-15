import express from 'express';
import { getConversations, createConversation, sendMessage, deleteConversation } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.post('/message', sendMessage);
router.delete('/conversations/:id', deleteConversation);

export default router;
