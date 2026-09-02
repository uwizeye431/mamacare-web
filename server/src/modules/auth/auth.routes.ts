import { Router } from 'express';
import { register, login, logout, me, updateProfile, verifyOtp, resendOtp } from './auth.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);

export default router;
