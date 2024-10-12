import { Router } from 'express';

import { UserController } from '../controllers/user.controller';

const router = Router();

// [ USER ROUTES ]

// create user
router.post('/users/createuser', UserController.create);

// Check user
router.post('/users/checkuser', UserController.checkuser)

// New chat
router.post('/chats/newchat', UserController.newchat)

export default router;