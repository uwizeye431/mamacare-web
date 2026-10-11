import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.middleware';
import * as Admin from './admin.controller';

const router = Router();

// Every admin endpoint requires a logged-in admin
router.use(requireAuth, requireRole(['admin']));

router.get('/stats', Admin.getStats);

router.get('/users', Admin.listUsers);
router.patch('/users/:id', Admin.updateUser);
router.delete('/users/:id', Admin.deleteUser);

router.get('/messages', Admin.listMessages);
router.patch('/messages/:id', Admin.updateMessage);
router.delete('/messages/:id', Admin.deleteMessage);

export default router;
