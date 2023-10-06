import { Router } from 'express';
import { createUser,login, logout, resetPassword  } from '../controllers/users.js';

const router = Router();

router.post('/register', createUser);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset', resetPassword);

export default router;