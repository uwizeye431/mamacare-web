import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as AuthModel from './auth.model';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { sendOtpEmail } from '../../utils/mailer';
import { AUTH_COOKIE_OPTIONS } from '../../utils/cookies';
import { AuthRequest } from '../../middleware/auth.middleware';

const COOKIE_OPTIONS = AUTH_COOKIE_OPTIONS;

// Only these fields are ever sent to the browser (an allowlist, so new columns stay private by default)
const toPublicUser = (user: Record<string, unknown>) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  language: user.language,
  avatar_url: user.avatar_url,
});

// Verification codes are short-lived; the frontend shows a countdown and lets the
// user request a new one as soon as the current one expires.
const OTP_TTL_SECONDS = 60;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ignores anything beyond 72 bytes

// Returns an error message, or null if the password is acceptable
const validatePassword = (password: string): string | null => {
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  if (Buffer.byteLength(password) > MAX_PASSWORD_LENGTH) return 'Password is too long.';
  return null;
};

const EMAIL_FAILED_MESSAGE =
  'We could not send the verification email. Please check your email address and tap "Resend Code".';

// Generates and stores a fresh OTP, then emails it. If the email cannot be sent the
// stored code is discarded so the user can immediately request another one.
const issueOtp = async (email: string, name: string) => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

  await AuthModel.upsertOtp(email, otp, expiresAt);
  const emailSent = Boolean(await sendOtpEmail(email, otp, name));
  if (!emailSent) {
    await AuthModel.deleteOtpByEmail(email);
  }

  return {
    emailSent,
    expiresIn: emailSent ? OTP_TTL_SECONDS : 0,
    otp: process.env.NODE_ENV === 'development' && emailSent ? otp : undefined,
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? AuthModel.normalizeEmail(req.body.email) : '';
    const phone = typeof req.body.phone === 'string' && req.body.phone.trim() ? req.body.phone.trim() : null;
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const passwordProblem = validatePassword(password);
    if (passwordProblem) {
      return res.status(400).json({ error: passwordProblem });
    }

    // Health data needs explicit consent (Rwanda Law No. 058/2021); the time is stored on the account
    if (req.body.acceptedTerms !== true) {
      return res.status(400).json({ error: 'Please accept the Terms of Service and Privacy Policy to create an account.' });
    }

    const existingUser = await AuthModel.findUserByEmailOrPhone(email, phone ?? '');
    if (existingUser) {
      if (!existingUser.is_verified) {
        // User exists but is not verified yet. Generate new OTP and tell the frontend.
        const otpResult = await issueOtp(existingUser.email, existingUser.name);

        return res.status(200).json({
          message: otpResult.emailSent
            ? 'Account already exists but is not verified. A verification code has been sent.'
            : EMAIL_FAILED_MESSAGE,
          requiresVerification: true,
          email: existingUser.email,
          ...otpResult,
        });
      }
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    // Everyone signs up as a mother ('patient'). Any role sent by the client is ignored:
    // elevated roles (admin) are granted by an administrator, never self-assigned.
    const newUser = await AuthModel.createUser(phone, email, passwordHash, name, 'patient');

    const otpResult = await issueOtp(newUser.email, newUser.name);

    return res.status(201).json({
      message: otpResult.emailSent
        ? 'Registration successful. A verification code has been sent to your email.'
        : EMAIL_FAILED_MESSAGE,
      requiresVerification: true,
      email: newUser.email,
      ...otpResult,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === 'string' ? AuthModel.normalizeEmail(req.body.email) : '';
    const otp = typeof req.body.otp === 'string' ? req.body.otp.trim() : '';

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

    return res.status(200).json({
      message: 'Email verified successfully.',
      user: toPublicUser(verifiedUser),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === 'string' ? AuthModel.normalizeEmail(req.body.email) : '';

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

    // Don't send a new code while the current one is still valid (prevents email spam)
    const existingOtp = await AuthModel.findOtpByEmail(user.email);
    if (existingOtp) {
      const secondsLeft = Math.ceil((new Date(existingOtp.expires_at).getTime() - Date.now()) / 1000);
      if (secondsLeft > 0) {
        return res.status(429).json({
          error: `Please wait ${secondsLeft} seconds before requesting a new code.`,
          expiresIn: secondsLeft,
        });
      }
    }

    const otpResult = await issueOtp(user.email, user.name);
    if (!otpResult.emailSent) {
      return res.status(502).json({ error: EMAIL_FAILED_MESSAGE, ...otpResult });
    }

    return res.status(200).json({
      message: 'A fresh verification code has been sent to your email.',
      ...otpResult,
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // identifier can be an email or a phone number
    const rawIdentifier = typeof req.body.identifier === 'string' ? req.body.identifier.trim() : '';
    const identifier = rawIdentifier.includes('@') ? AuthModel.normalizeEmail(rawIdentifier) : rawIdentifier;
    const password = typeof req.body.password === 'string' ? req.body.password : '';

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

    if (user.disabled_at) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact MamaCare support.' });
    }

    // Block unverified users
    if (!user.is_verified) {
      const otpResult = await issueOtp(user.email, user.name);

      return res.status(403).json({
        error: otpResult.emailSent
          ? 'Your email is not verified yet. A verification code has been sent.'
          : EMAIL_FAILED_MESSAGE,
        requiresVerification: true,
        email: user.email,
        ...otpResult,
      });
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    res.cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 30 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({ user: toPublicUser(user) });
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

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await AuthModel.findUserById(userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    return res.status(200).json({ user: toPublicUser(user) });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
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

// ---------------------------------------------------------------------------
// Forgot password: request a code -> verify the code -> set a new password
// ---------------------------------------------------------------------------

const RESET_CODE_TTL_SECONDS = 60;
const RESET_TOKEN_TTL_MINUTES = 10;
const MAX_RESET_ATTEMPTS = 5;

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
const sameHash = (a: string, b: string) =>
  a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

// Same answer whether or not the account exists, so the form can't be used to find out who is registered
const RESET_REQUESTED_MESSAGE = 'If an account exists for this email, a reset code has been sent to it.';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === 'string' ? AuthModel.normalizeEmail(req.body.email) : '';
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existing = await AuthModel.findPasswordReset(email);
    if (existing) {
      const secondsLeft = Math.ceil((new Date(existing.expires_at).getTime() - Date.now()) / 1000);
      if (secondsLeft > 0) {
        return res.status(429).json({
          error: `Please wait ${secondsLeft} seconds before requesting a new code.`,
          expiresIn: secondsLeft,
        });
      }
    }

    const user = await AuthModel.findUserByEmailOrPhone(email, '');
    // Unknown and deactivated accounts get the same answer as real ones (no account enumeration)
    if (!user || user.disabled_at || !user.email || AuthModel.normalizeEmail(user.email) !== email) {
      return res.status(200).json({ message: RESET_REQUESTED_MESSAGE, expiresIn: RESET_CODE_TTL_SECONDS });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    await AuthModel.upsertPasswordReset(email, sha256(code), new Date(Date.now() + RESET_CODE_TTL_SECONDS * 1000));

    const emailSent = Boolean(await sendOtpEmail(user.email, code, user.name, 'reset'));
    if (!emailSent) {
      await AuthModel.deletePasswordReset(email);
      return res.status(502).json({ error: 'We could not send the reset email. Please try again in a moment.' });
    }

    return res.status(200).json({
      message: RESET_REQUESTED_MESSAGE,
      expiresIn: RESET_CODE_TTL_SECONDS,
      otp: process.env.NODE_ENV === 'development' ? code : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === 'string' ? AuthModel.normalizeEmail(req.body.email) : '';
    const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const reset = await AuthModel.findPasswordReset(email);
    const invalid = 'This code is invalid or has expired. Please request a new code.';
    if (!reset || new Date(reset.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ error: invalid });
    }
    if (reset.attempts >= MAX_RESET_ATTEMPTS) {
      await AuthModel.deletePasswordReset(email);
      return res.status(429).json({ error: 'Too many wrong attempts. Please request a new code.' });
    }

    if (!sameHash(sha256(code), reset.code_hash)) {
      await AuthModel.incrementPasswordResetAttempts(email);
      return res.status(400).json({ error: 'Incorrect code. Please check the email and try again.' });
    }

    // Code is correct: hand out a one-time token for choosing the new password
    const resetToken = crypto.randomBytes(32).toString('hex');
    await AuthModel.setPasswordResetToken(
      email,
      sha256(resetToken),
      new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000)
    );
    return res.status(200).json({ resetToken, expiresInMinutes: RESET_TOKEN_TTL_MINUTES });
  } catch (error) {
    console.error('Verify reset code error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const email = typeof req.body.email === 'string' ? AuthModel.normalizeEmail(req.body.email) : '';
    const resetToken = typeof req.body.resetToken === 'string' ? req.body.resetToken : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!email || !resetToken || !password) {
      return res.status(400).json({ error: 'Email, reset token and new password are required' });
    }

    const passwordProblem = validatePassword(password);
    if (passwordProblem) {
      return res.status(400).json({ error: passwordProblem });
    }

    const reset = await AuthModel.findPasswordReset(email);
    const tokenValid =
      reset?.reset_token_hash &&
      new Date(reset.reset_token_expires_at).getTime() > Date.now() &&
      sameHash(sha256(resetToken), reset.reset_token_hash);
    if (!tokenValid) {
      return res.status(400).json({ error: 'Your reset session has expired. Please start again.' });
    }

    const updated = await AuthModel.updatePassword(email, await bcrypt.hash(password, 12));
    await AuthModel.deletePasswordReset(email); // single use
    if (!updated) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.status(200).json({ message: 'Your password has been changed. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
