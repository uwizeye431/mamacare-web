// The Express application: middleware and routes. Started by index.ts; imported directly by tests.
import './config/env';
import express, { type NextFunction, type Request, type Response } from 'express';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes';
import symptomsRoutes from './modules/symptoms/symptoms.routes';
import profileRoutes from './modules/profile/profile.routes';
import visitsRoutes from './modules/visits/visits.routes';
import contactRoutes from './modules/contact/contact.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Number of proxies in front of the API (hosting load balancer, website forwarding /api).
// Lets Express read the visitor's real IP from X-Forwarded-For, so the rate limit is per visitor
// instead of shared by everyone. 0/unset locally; 1 on Render; 2 when the website also forwards /api.
const trustProxy = Number(process.env.TRUST_PROXY || 0);
if (trustProxy > 0) {
  app.set('trust proxy', trustProxy);
}

// Security Middlewares
app.use(helmet());
// Web app origins allowed to call the API with cookies (comma-separated, e.g. "https://a.com,https://b.com")
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Rate Limiting (Public Endpoints)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Unknown API paths get JSON, not Express's default HTML page
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Report unhandled errors to Sentry (only when it is configured in instrument.ts)
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// Last resort: never send stack traces or HTML error pages to the browser
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express only treats 4-argument functions as error handlers
app.use((err: Error & { status?: number; type?: string }, req: Request, res: Response, _next: NextFunction) => {
  // Malformed JSON or an oversized body are the client's fault, not a server error
  if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
    return res.status(err.status ?? 400).json({ error: 'Invalid request.' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
