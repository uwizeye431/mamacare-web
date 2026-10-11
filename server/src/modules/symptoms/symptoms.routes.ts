import { Router } from 'express';
import { logSymptom, getHistory } from './symptoms.controller';
import { requireAuth, optionalAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/log', optionalAuth, logSymptom);
router.get('/history', requireAuth, getHistory);

export default router;
