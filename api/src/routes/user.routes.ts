import { Router } from 'express';

import { UserController } from '../controllers/user.controller';

const router = Router();

// [ USER ROUTES ]

// create user
router.post('/createuser', UserController.create);

// Check user
router.post('/checkuser', UserController.checkuser)

export default router;