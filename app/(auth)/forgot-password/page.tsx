"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, Lock, Mail } from 'lucide-react';
import { API_URL } from '../../../lib/api';

type Step = 'email' | 'code' | 'password' | 'done';

const MIN_PASSWORD_LENGTH = 8;

const inputClass =
  'block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none';

// POST JSON to the API and return the parsed body, throwing the API's error message on failure
const post = async (path: string, body: object) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Empty message: the page shows its translated "something went wrong" text instead
    const error = new Error(data.error || '') as Error & { expiresIn?: number };
    error.expiresIn = data.expiresIn;
    throw error;
  }
  return data;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const t = useTranslations('Auth');
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  // Countdown for the 60-second code; "Resend" unlocks at zero
  useEffect(() => {
    if (step !== 'code' || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const run = async (action: () => Promise<void>) => {
    setLoading(true);
    setError('');
    try {
      await action();
    } catch (err) {
      const e = err as Error & { expiresIn?: number };
      if (e.expiresIn) setTimer(e.expiresIn);
      setError(e instanceof TypeError ? t('cannotReachServer') : e.message || t('genericError'));
    } finally {
      setLoading(false);
    }
  };

  const requestCode = (e?: React.FormEvent) => {
    e?.preventDefault();
    return run(async () => {
      const data = await post('/api/auth/forgot-password', { email });
      setTimer(data.expiresIn ?? 60);
      setCode('');
      setStep('code');
    });
  };

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    return run(async () => {
      const data = await post('/api/auth/verify-reset-code', { email, code });
      setResetToken(data.resetToken);
      setStep('password');
    });
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t('passwordMin'));
      return;
    }
    if (password !== confirm) {
      setError(t('passwordMismatch'));
      return;
    }
    return run(async () => {
      await post('/api/auth/reset-password', { email, resetToken, password });
      setStep('done');
      setTimeout(() => router.push('/login'), 2500);
    });
  };

  const titles: Record<Step, { title: string; text: React.ReactNode }> = {
    email: { title: t('forgotTitle'), text: t('forgotIntro') },
    code: {
      title: t('checkEmailTitle'),
      text: t.rich('codeSentReset', { email, b: (chunks) => <span className="font-bold text-foreground">{chunks}</span> }),
    },
    password: { title: t('newPasswordTitle'), text: t('newPasswordIntro', { min: MIN_PASSWORD_LENGTH }) },
    done: { title: t('passwordChangedTitle'), text: t('passwordChangedIntro') },
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-24 px-4">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg glass p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10 border border-border">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            {step === 'done' ? <CheckCircle2 className="w-8 h-8 text-primary" /> : <KeyRound className="w-8 h-8 text-primary" />}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{titles[step].title}</h1>
          <p className="text-muted-foreground mt-3 text-sm max-w-sm">{titles[step].text}</p>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={requestCode} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <label htmlFor="email" className="sr-only">{t('email')}</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? t('sendingCode') : t('sendResetCode')}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode} className="space-y-6">
            <div>
              <label htmlFor="code" className="sr-only">{t('verifyCode')}</label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="------"
                className="block w-full py-4 rounded-2xl bg-card border border-border text-foreground text-center text-3xl font-extrabold tracking-[0.5em] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="text-center text-sm">
              {timer > 0 ? (
                <span className="text-muted-foreground">
                  {t.rich('codeExpiresIn', { time: `00:${String(timer).padStart(2, '0')}`, b: (chunks) => <span className="font-mono font-bold text-foreground">{chunks}</span> })}
                </span>
              ) : (
                <span className="text-destructive font-semibold">{t('codeExpired')}</span>
              )}
              <button
                type="button"
                onClick={() => requestCode()}
                disabled={loading || timer > 0}
                className="block mx-auto mt-2 font-bold text-primary hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {t('resendCode')}
              </button>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => { setStep('email'); setError(''); }}
                className="flex-1 py-4 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                {t('back')}
              </button>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? t('checking') : t('verifyCode')}
              </button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={savePassword} className="space-y-5">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <label htmlFor="new-password" className="sr-only">{t('newPassword')}</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('newPassword')}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <label htmlFor="confirm-password" className="sr-only">{t('confirmPassword')}</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t('confirmPassword')}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? t('saving') : t('saveNewPassword')}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div role="status" className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-start gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{t('passwordChanged')}</span>
          </div>
        )}

        <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> {t('backToLogin')}
        </Link>
      </div>
    </main>
  );
}
