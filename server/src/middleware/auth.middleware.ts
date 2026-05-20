import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      req.user = decoded;
      return next();
    }
  } catch (error) {
    // Access token expired or invalid, fall back to refresh token
  }

  try {
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken({ userId: decoded.userId, role: decoded.role });
      
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
      
      req.user = decoded;
      return next();
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }

  return res.status(401).json({ error: 'Authentication required' });
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
