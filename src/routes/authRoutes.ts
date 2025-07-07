import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getProfile } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateJWT, getProfile);

export default router; 