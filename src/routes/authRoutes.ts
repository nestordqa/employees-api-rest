import express, { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

export default router;
