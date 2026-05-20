import { Router } from 'express';
import { getVisits, logVisit } from './visits.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getVisits);
router.post('/', requireAuth, logVisit);

export default router;
