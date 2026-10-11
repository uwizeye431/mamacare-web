"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Heart, User, Mail, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { API_URL } from '../../../lib/api';
import { errorMessage } from '../../../lib/errors';

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('Auth');
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // OTP Verification States
  const [otpMode, setOtpMode] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otpCodes, setOtpCodes] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(60); // OTP lifetime in seconds (set from the API response)
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpMode && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpMode, timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError(t('requiredFields'));
      return;
    }

    if (password.length < 8) {
      setError(t('passwordMin'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Allow cookie sharing
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
          acceptedTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.requiresVerification) {
        setVerificationEmail(data.email);
        setOtpMode(true);
        setTimer(data.expiresIn ?? 60);
        // If the email could not be sent, let the user resend right away
        setResendDisabled(data.emailSent !== false);
        setOtpCodes(Array(6).fill(''));
        setError(data.emailSent === false ? data.message : '');
        // Focus first box
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 100);
        return;
      }

      // If already verified or somehow immediately returns verified user
      setAuth(data.user);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(errorMessage(err, t('genericError'), t('cannotReachServer')));
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP cell edits
  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) {
      const nextCodes = [...otpCodes];
      nextCodes[index] = '';
      setOtpCodes(nextCodes);
      return;
    }

    const nextCodes = [...otpCodes];
    nextCodes[index] = cleanValue[cleanValue.length - 1]; // Only keep the single last digit
    setOtpCodes(nextCodes);

    // Auto-focus next cell
    if (index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Backspace to clear and navigate backwards
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otpCodes[index] && index > 0 && otpInputsRef.current[index - 1]) {
        const nextCodes = [...otpCodes];
        nextCodes[index - 1] = '';
        setOtpCodes(nextCodes);
        otpInputsRef.current[index - 1]?.focus();
      } else {
        const nextCodes = [...otpCodes];
        nextCodes[index] = '';
        setOtpCodes(nextCodes);
      }
    }
  };

  // Clipboard Paste Support (fully populates the 6 fields if a valid string is pasted)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedText)) {
      const digits = pastedText.split('');
      setOtpCodes(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Submit OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpCodes.join('');
    if (otp.length !== 6) {
      setError(t('enterAllDigits'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: verificationEmail,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(true);
      setAuth(data.user);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(errorMessage(err, t('invalidCode'), t('cannotReachServer')));
    } finally {
      setLoading(false);
    }
  };

  // Request code resend
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Current code is still valid: sync the countdown with the server
        if (response.status === 429 && data.expiresIn) {
          setTimer(data.expiresIn);
          setResendDisabled(true);
        }
        throw new Error(data.error || 'Failed to resend code');
      }

      setTimer(data.expiresIn ?? 60);
      setResendDisabled(true);
      setOtpCodes(Array(6).fill(''));
      
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 50);
    } catch (err) {
      setError(errorMessage(err, t('resendFailed'), t('cannotReachServer')));
    } finally {
      setResendLoading(false);
    }
  };

  const formatTimer = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  // OTP Verification View rendering
  if (otpMode) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-12 px-4">
        {/* Background decorations */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg glass p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-border">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t('verifyTitle')}</h1>
            <p className="text-muted-foreground mt-3 text-sm text-center max-w-sm">
              {t.rich('codeSentRegister', { email: verificationEmail, b: (chunks) => <span className="font-bold text-foreground">{chunks}</span> })}
            </p>
          </div>



          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{t('verifiedSettingUp')}</span>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="flex justify-between items-center gap-2 sm:gap-3">
              {otpCodes.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputsRef.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-extrabold rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  required
                />
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              {timer > 0 ? (
                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                  {t.rich('codeExpiresIn', { time: formatTimer(), b: (chunks) => <span className="font-mono font-bold text-foreground">{chunks}</span> })}
                </div>
              ) : (
                <div className="text-sm text-destructive font-semibold">
                  {t('codeExpired')}
                </div>
              )}

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={(resendDisabled && timer > 0) || resendLoading}
                className="text-sm font-bold text-primary hover:underline hover:opacity-90 disabled:opacity-50 disabled:no-underline transition-all mt-1"
              >
                {resendLoading ? t('resending') : t('resendCode')}
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setOtpMode(false)}
                className="flex-1 py-4 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                {t('back')}
              </button>
              <button
                type="submit"
                disabled={loading || otpCodes.some((d) => d === '')}
                className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? t('verifying') : t('verifyCode')}
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  // Registration form rendering
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-12 px-4">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg glass p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t('createAccount')}</h1>
          <p className="text-muted-foreground mt-2 text-sm text-center">
            {t('registerIntro')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-start gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{t('registered')}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              {t('fullName')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {t('phone')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 788..."
                  className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                minLength={8}
                autoComplete="new-password"
                className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 rounded border-border accent-primary"
              required
            />
            <span>
              {t.rich('consent', {
                terms: (chunks) => <Link href="/terms" target="_blank" className="font-semibold text-primary hover:underline">{chunks}</Link>,
                privacy: (chunks) => <Link href="/privacy" target="_blank" className="font-semibold text-primary hover:underline">{chunks}</Link>,
              })}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? t('creating') : t('createAccount')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t('haveAccount')}{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            {t('signInLink')}
          </Link>
        </p>
      </div>
    </main>
  );
}
