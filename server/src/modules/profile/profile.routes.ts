import { Router } from 'express';
import { getProfile, saveProfile } from './profile.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, getProfile);
router.post('/', requireAuth, saveProfile);

export default router;
