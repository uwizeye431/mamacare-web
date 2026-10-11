"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Heart, Mail, Lock, Phone, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { API_URL } from '../../../lib/api';
import { errorMessage } from '../../../lib/errors';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('Auth');
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [useEmail, setUseEmail] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // OTP Verification States (in case user's email is not verified yet)
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
    if (!identifier || !password) {
      setError(t('fillAllFields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // If account is unverified, trigger OTP mode
        if (response.status === 403 && data.requiresVerification) {
          setVerificationEmail(data.email);
          setOtpMode(true);
          setTimer(data.expiresIn ?? 60);
          // If the email could not be sent, let the user resend right away
          setResendDisabled(data.emailSent !== false);
          setOtpCodes(Array(6).fill(''));
          setError(data.emailSent === false ? data.error : '');
          setTimeout(() => {
            otpInputsRef.current[0]?.focus();
          }, 100);
          return;
        }
        throw new Error(data.error || 'Invalid credentials');
      }

      setAuth(data.user);
      setSuccess(true);
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      setError(errorMessage(err, t('loginFailed'), t('cannotReachServer')));
    } finally {
      setLoading(false);
    }
  };

  // OTP Cell Edits
  const handleOtpChange = (value: string, index: number) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) {
      const nextCodes = [...otpCodes];
      nextCodes[index] = '';
      setOtpCodes(nextCodes);
      return;
    }

    const nextCodes = [...otpCodes];
    nextCodes[index] = cleanValue[cleanValue.length - 1];
    setOtpCodes(nextCodes);

    if (index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Backspace key handlers
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

  // Paste handler
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedText)) {
      const digits = pastedText.split('');
      setOtpCodes(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Verify OTP
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

  // Resend OTP
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

  if (otpMode) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-12 px-4">
        {/* Background decorations */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg glass p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-border font-sans">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t('verifyTitle')}</h1>
            <p className="text-muted-foreground mt-3 text-sm text-center max-w-sm">
              {t.rich('codeSentLogin', { email: verificationEmail, b: (chunks) => <span className="font-bold text-foreground">{chunks}</span> })}
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
              <span>{t('verifiedSigningIn')}</span>
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
                {t('backToLogin')}
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

  return (
    <main className="min-h-screen w-full flex items-stretch relative overflow-hidden pt-20">
      
      {/* ── Left Side: Background Photo Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=85&w=1200"
          alt="Expectant mother holding baby bump peacefully"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/30 to-black/60" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 xl:p-16">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/80 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              {t('promoBadge')}
            </div>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
              {t('promoTitle')}
            </h2>
            <p className="text-white/70 text-base leading-relaxed font-light">
              {t('promoText')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {(t.raw('promoTags') as string[]).map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/80 text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Side: Login Form Panel ── */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center bg-background px-6 py-16 sm:px-10 relative">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-xl shadow-primary/25">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground text-center">{t('welcomeBack')}</h1>
            <p className="text-muted-foreground mt-2 text-sm text-center max-w-xs">
              {t('loginIntro')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{t('loginSuccess')}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="flex p-1 rounded-xl bg-muted border border-border">
              <button
                type="button"
                onClick={() => { setUseEmail(true); setIdentifier(''); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  useEmail ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('email')}
              </button>
              <button
                type="button"
                onClick={() => { setUseEmail(false); setIdentifier(''); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  !useEmail ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('phone')}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {useEmail ? t('email') : t('phone')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  {useEmail ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                </div>
                <input
                  type={useEmail ? 'email' : 'tel'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={useEmail ? t('emailPlaceholder') : '+250 788...'}
                  className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('password')}
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                  {t('forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {t('signingIn')}
                </span>
              ) : (
                <>{t('signInButton')} <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t('newHere')}{' '}
            <Link href="/register" className="font-bold text-primary hover:underline">
              {t('createFree')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
