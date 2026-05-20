import { Router } from 'express';
import { logSymptom, getHistory } from './symptoms.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/log', requireAuth, logSymptom);
router.get('/history', requireAuth, getHistory);

export default router;
