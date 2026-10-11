import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitContactMessage } from './contact.controller';

const router = Router();

// Stricter than the general API limit: the contact form is a common spam target
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
});

router.post('/', contactLimiter, submitContactMessage);

export default router;
