import { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { ChatController } from '../controllers/chat.controller';

const router = Router();

// [ USER ROUTES ]

// create user
router.post('/users/createuser', UserController.create);

// Check user
router.post('/users/checkuser', UserController.checkuser)

// New chat
router.post('/chats/newchat', ChatController.newchat)

// Get chats
router.post('/chats/getchats', ChatController.getchats)

export default router;