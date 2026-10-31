import express from 'express';
import {
  getConversations,
  createConversation,
  sendMessage,
  deleteConversation,
  renameConversation,
} from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.patch('/conversations/:id', renameConversation);
router.put('/conversations/:id', renameConversation);
router.delete('/conversations/:id', deleteConversation);
router.post('/message', sendMessage);

export default router;
