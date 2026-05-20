import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as AuthModel from './auth.model';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ error: 'Name, password, and either email or phone are required' });
    }

    const existingUser = await AuthModel.findUserByEmailOrPhone(email, phone);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or phone already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    // Default to 'patient' if no role is provided or if standard user tries to register as something else
    const safeRole = role && ['patient', 'chw', 'provider'].includes(role) ? role : 'patient';
    
    const newUser = await AuthModel.createUser(phone, email, passwordHash, name, safeRole);

    const accessToken = generateAccessToken({ userId: newUser.id, role: newUser.role });
    const refreshToken = generateRefreshToken({ userId: newUser.id, role: newUser.role });

    res.cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 }); // 15 mins
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or phone

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required' });
    }

    const user = await AuthModel.findUserByEmailOrPhone(identifier, identifier);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    res.cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 30 * 24 * 60 * 60 * 1000 });

    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('access_token', COOKIE_OPTIONS);
  res.clearCookie('refresh_token', COOKIE_OPTIONS);
  return res.status(200).json({ message: 'Logged out successfully' });
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await AuthModel.findUserById(userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, email, phone, avatar_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedUser = await AuthModel.updateUserProfile(userId, name, email || null, phone || null, avatar_url || null);
    return res.status(200).json({
      message: 'Profile settings updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
