import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/jwt';
import { AUTH_COOKIE_OPTIONS } from '../utils/cookies';
import { findUserById } from '../modules/auth/auth.model';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

type SessionResult = { user: NonNullable<AuthRequest['user']> } | { error: string } | null;

/**
 * Reads the session from the cookies. A valid access token (15 min) is trusted as is.
 * When it has expired, the refresh token is used to issue a new one, and the account is
 * re-checked in the database: deleted or deactivated accounts are refused, and the role is
 * taken from the database, so role changes and deactivations apply within 15 minutes.
 * Returns null when there is no session at all.
 */
const resolveSession = async (req: Request, res: Response): Promise<SessionResult> => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  if (!accessToken && !refreshToken) return null;

  if (accessToken) {
    try {
      const { userId, role } = verifyAccessToken(accessToken);
      return { user: { userId, role } };
    } catch {
      // Expired or invalid: fall back to the refresh token
    }
  }

  if (refreshToken) {
    try {
      const { userId } = verifyRefreshToken(refreshToken);
      const account = await findUserById(userId);
      if (!account || account.disabled_at) {
        return { error: 'Your session has ended. Please log in again.' };
      }
      res.cookie('access_token', generateAccessToken({ userId, role: account.role }), {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      return { user: { userId, role: account.role } };
    } catch {
      return { error: 'Invalid or expired session. Please log in again.' };
    }
  }

  return { error: 'Invalid or expired session. Please log in again.' };
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const session = await resolveSession(req, res);
    if (!session) return res.status(401).json({ error: 'Authentication required' });
    if ('error' in session) return res.status(401).json({ error: session.error });
    req.user = session.user;
    return next();
  } catch (error) {
    return next(error);
  }
};

// Like requireAuth, but lets guests through: attaches req.user only when the session is valid
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const session = await resolveSession(req, res);
    if (session && 'user' in session) req.user = session.user;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
