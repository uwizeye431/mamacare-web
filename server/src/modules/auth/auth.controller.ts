import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as AuthModel from './auth.model';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { sendOtpEmail } from '../../utils/mailer';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await AuthModel.findUserByEmailOrPhone(email, phone || '');
    if (existingUser) {
      if (!existingUser.is_verified) {
        // User exists but is not verified yet. Generate new OTP and tell the frontend.
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await AuthModel.upsertOtp(email, otp, expiresAt);
        await sendOtpEmail(email, otp, existingUser.name);

        return res.status(200).json({
          message: 'Account already exists but is not verified. A verification code has been sent.',
          requiresVerification: true,
          email: existingUser.email,
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
      }
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    // Default to 'patient' if no role is provided or if standard user tries to register as something else
    const safeRole = role && ['patient', 'chw', 'provider'].includes(role) ? role : 'patient';
    
    const newUser = await AuthModel.createUser(phone || '', email, passwordHash, name, safeRole);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await AuthModel.upsertOtp(email, otp, expiresAt);
    await sendOtpEmail(email, otp, newUser.name);

    return res.status(201).json({
      message: 'Registration successful. A verification code has been sent to your email.',
      requiresVerification: true,
      email: newUser.email,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required' });
    }

    const storedOtp = await AuthModel.findOtpByEmail(email);
    if (!storedOtp) {
      return res.status(400).json({ error: 'No verification code found or it has expired. Please request a new code.' });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const now = new Date();
    if (new Date(storedOtp.expires_at) < now) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    // Mark user as verified
    const verifiedUser = await AuthModel.verifyUserEmail(email);
    if (!verifiedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete OTP
    await AuthModel.deleteOtpByEmail(email);

    // Generate tokens
    const accessToken = generateAccessToken({ userId: verifiedUser.id, role: verifiedUser.role });
    const refreshToken = generateRefreshToken({ userId: verifiedUser.id, role: verifiedUser.role });

    res.cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 }); // 15 mins
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days

    const { is_verified, ...userWithoutVerificationStatus } = verifiedUser;
    return res.status(200).json({
      message: 'Email verified successfully.',
      user: userWithoutVerificationStatus,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await AuthModel.findUserByEmailOrPhone(email, '');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified) {
      return res.status(400).json({ error: 'This email is already verified. Please sign in.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await AuthModel.upsertOtp(email, otp, expiresAt);
    await sendOtpEmail(email, otp, user.name);

    return res.status(200).json({
      message: 'A fresh verification code has been sent to your email.',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
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

    // Block unverified users
    if (!user.is_verified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await AuthModel.upsertOtp(user.email, otp, expiresAt);
      await sendOtpEmail(user.email, otp, user.name);

      return res.status(403).json({
        error: 'Your email is not verified yet. A verification code has been sent.',
        requiresVerification: true,
        email: user.email,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    res.cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 30 * 24 * 60 * 60 * 1000 });

    const { password_hash, is_verified, ...userWithoutPassword } = user;
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
    
    const { password_hash, is_verified, ...userWithoutPassword } = user;
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
