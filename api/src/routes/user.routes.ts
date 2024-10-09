import { Router } from 'express';

import { UserController } from '../controllers/user.controller';

const router = Router();

// [ USER ROUTES ]

// create user
router.post('/', UserController.create);

export default router;