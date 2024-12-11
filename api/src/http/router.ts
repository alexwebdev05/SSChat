import express from 'express';

import { UserController } from './controllers/user.controller';
import { ChatController } from './controllers/chat.controller';
import { MessageController } from './controllers/message.controller';

const router = express.Router();

// [ USER ROUTES ]

// create user
router.post('/users/createuser', UserController.create);

// Check user
router.post('/users/checkuser', UserController.checkuser)

// [ CHAT ROUTES ]

// New chat
router.post('/chats/newchat', ChatController.newchat)

// Get chats
router.post('/chats/getchats', ChatController.getchats)

// [ MESSAGE ROUTES ]

// Get messages
router.post('/messages/getmessages', MessageController.getmessages)

// Send message
router.post('/messages/sendmessage',MessageController.sendmessage )

export default router;