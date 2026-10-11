"use client"

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Activity, AlertTriangle, ArrowLeft, ShieldAlert, Stethoscope, CheckCircle2, ArrowRight, Loader2, Phone, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../lib/api';
import type { SymptomLog } from '../../lib/types';

const subscribeNoop = () => () => {};

const EXAMPLES = [
  { key: 'bleeding', className: 'border-destructive/30 hover:bg-destructive/5 text-destructive' },
  { key: 'headache', className: 'border-destructive/30 hover:bg-destructive/5 text-destructive' },
  { key: 'nausea', className: 'border-amber-500/30 hover:bg-amber-500/5 text-amber-600 dark:text-amber-400' },
] as const;

export default function SymptomsTriagePage() {
  const t = useTranslations('Symptoms');
  const tAuth = useTranslations('Auth');
  const locale = useLocale();
  const { user, isAuthenticated: storedAuth, clearAuth } = useAuthStore();

  // The auth store is persisted in localStorage, which the server render can't see.
  // Only trust it in the browser (false during server render), to avoid a hydration mismatch.
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const isAuthenticated = isClient && storedAuth;

  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SymptomLog | null>(null);

  // Clear the server session cookies as well as the local login state
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // Even if the server is unreachable, still log out locally
    }
    clearAuth();
    setResult(null);
  };

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError(t('describeFirst'));
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/symptoms/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Send the session cookies to the API
        // The answer comes back in the interface language
        body: JSON.stringify({ symptoms, language: locale }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || t('failed'));
      }

      setResult(data.log);
    } catch (err) {
      setError(err instanceof TypeError ? tAuth('cannotReachServer') : err instanceof Error && err.message ? err.message : t('failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background py-16 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">

        <div className="mb-8 pt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> {t('back')}
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" /> {t('badge')}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{t('title')}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{t('intro')}</p>
          </div>

          {/* Session controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-card border border-border shadow-sm shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t('loggedInAs')}</div>
                <div className="text-sm font-bold text-foreground">{user?.name}</div>
              </div>
              <button onClick={handleLogout} className="text-xs font-bold text-destructive hover:underline ml-2">
                {t('logout')}
              </button>
            </div>
          ) : null}
        </div>

        <a
          href="tel:912"
          className="mb-8 flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Phone className="w-5 h-5 shrink-0" />
          {t('emergency')}
        </a>

        {error && (
          <div role="alert" className="mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold">{error}</div>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-8">

          {/* Form */}
          <div className="md:col-span-3 space-y-8">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-border shadow-lg">
              <label htmlFor="symptoms" className="block text-xl font-extrabold text-foreground mb-4">
                {t('describeHeading')}
              </label>

              <form onSubmit={handleTriageSubmit} className="space-y-6">
                <textarea
                  id="symptoms"
                  rows={6}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t('placeholder')}
                  maxLength={2000}
                  className="block w-full p-4 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none resize-none"
                  disabled={loading}
                  required
                />

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> {t('analyzing')}
                      </>
                    ) : (
                      <>
                        {t('analyze')} <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSymptoms(''); setResult(null); setError(''); }}
                    aria-label={t('clear')}
                    title={t('clear')}
                    className="p-4 rounded-2xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Examples */}
            <div className="glass p-6 rounded-3xl border border-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">{t('examplesHeading')}</h2>
              <div className="grid gap-3">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.key}
                    type="button"
                    disabled={loading}
                    onClick={() => setSymptoms(t(`examples.${example.key}.text`))}
                    className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all flex justify-between items-center gap-4 bg-card ${example.className} disabled:opacity-50`}
                  >
                    <span>{t(`examples.${example.key}.label`)}</span>
                    <span className="text-xs opacity-75 font-normal line-clamp-1 max-w-[200px] sm:max-w-xs">
                      {t(`examples.${example.key}.text`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="md:col-span-2" aria-live="polite">
            {result ? (
              <div className={`rounded-3xl p-8 border shadow-xl relative overflow-hidden transition-all ${
                result.triage_level === 'red'
                  ? 'bg-destructive/5 border-destructive/20 text-destructive'
                  : result.triage_level === 'yellow'
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-green-500/5 border-green-500/20 text-green-600 dark:text-green-400'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  {result.triage_level === 'red' ? (
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-destructive/10 flex items-center justify-center animate-pulse">
                      <ShieldAlert className="w-6 h-6 text-destructive" />
                    </div>
                  ) : result.triage_level === 'yellow' ? (
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-75">{t('resultLabel')}</div>
                    <div className="text-lg font-extrabold leading-snug">{t(`levels.${result.triage_level}`)}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('youWrote')}</h3>
                    <p className="text-sm font-medium text-foreground italic border-l-2 border-muted pl-3">
                      &ldquo;{result.symptoms}&rdquo;
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('whatItMeans')}</h3>
                    <p className="text-sm text-foreground leading-relaxed font-semibold">{result.ai_analysis?.explanation}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t('whatToDo')}</h3>
                    <ul className="space-y-2">
                      {(result.ai_analysis?.actions ?? []).map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.ai_analysis?.override && result.triage_level === 'red' && (
                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
                      {t('safetyRule')}
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mt-6 text-[11px] text-muted-foreground flex justify-between gap-4">
                    <span>{result.id ? t('saved') : ''}</span>
                    <span>{new Date(result.created_at).toLocaleTimeString(locale === 'rw' ? 'rw-RW' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <h2 className="font-extrabold text-foreground mb-2">{t('waitingTitle')}</h2>
                <p className="text-xs max-w-xs">{t('waitingText')}</p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-xs text-muted-foreground text-center max-w-2xl mx-auto">{t('disclaimer')}</p>
      </div>
    </main>
  );
}
