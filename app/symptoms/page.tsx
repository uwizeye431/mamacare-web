"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Activity, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2, Key, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function SymptomsTriagePage() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // Auto-login utility for quick testing
  const handleAutoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRITICAL: Allow cross-origin cookie sharing
        body: JSON.stringify({
          identifier: 'uwizeyekevin43@gmail.com',
          password: 'Password123',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }
      setAuth(data.user);
    } catch (err: any) {
      setError('Auto-login failed. Please ensure the backend is running and the database is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/symptoms/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CRITICAL: Allow cross-origin session credentials to be sent
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Your session might have expired. Please try clicking "Quick Auto-Login" above.');
        }
        throw new Error(data.error || 'Triage logging failed');
      }

      setResult(data.log);
    } catch (err: any) {
      setError(err.message || 'Triage failed. Make sure you are logged in and the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset symptom injectors for testing
  const testPresets = [
    {
      title: '🔴 Critical WHO Bleeding',
      text: 'I am in my 24th week and started having sudden vaginal bleeding this morning.',
      class: 'border-destructive/30 hover:bg-destructive/5 text-destructive'
    },
    {
      title: '🔴 Critical WHO Head/Vision',
      text: 'I have a very severe headache that won\'t go away and blurred vision.',
      class: 'border-destructive/30 hover:bg-destructive/5 text-destructive'
    },
    {
      title: '🟡 Mild Sickness (Normal)',
      text: 'I feel slightly nauseous in the mornings and a bit fatigued, but no severe pains.',
      class: 'border-amber-500/30 hover:bg-amber-500/5 text-amber-600 dark:text-amber-400'
    }
  ];

  return (
    <main className="min-h-screen w-full bg-background py-16 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        
        {/* Navigation back */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            ← Back to Homepage
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-border pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Clinical Triage Lab
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">AI Symptom Triage Playground</h1>
            <p className="text-muted-foreground mt-2">
              Test real-time maternal danger sign detection and Anthropic Claude 3.5 Sonnet analysis.
            </p>
          </div>

          {/* Session controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-card border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Logged in as</div>
                  <div className="text-sm font-bold text-foreground">{user?.name}</div>
                </div>
                <button
                  onClick={() => clearAuth()}
                  className="text-xs font-bold text-destructive hover:underline ml-2"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={handleAutoLogin}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-md"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                Quick Auto-Login (Kevin)
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold">{error}</div>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Form and Triage Logger */}
          <div className="md:col-span-3 space-y-8">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-border shadow-lg">
              <h2 className="text-xl font-extrabold text-foreground mb-4">1. Describe the Patient's Symptoms</h2>
              
              <form onSubmit={handleTriageSubmit} className="space-y-6">
                <div>
                  <textarea
                    rows={6}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe how the patient is feeling... E.g., 'I am experiencing a severe headache and have blurred vision.' (Supports English and Kinyarwanda)"
                    className="block w-full p-4 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none resize-none"
                    disabled={!isAuthenticated || loading}
                    required
                  />
                  {!isAuthenticated && (
                    <p className="mt-2 text-xs text-destructive font-semibold">
                      ⚠️ You must click "Quick Auto-Login" above to log in and start using the triage interface.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={!isAuthenticated || loading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Evaluating Symptoms...
                      </>
                    ) : (
                      <>
                        Analyze Symptoms <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => { setSymptoms(''); setResult(null); }}
                    className="p-4 rounded-2xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Test Presets Deck */}
            <div className="glass p-6 rounded-3xl border border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Test Presets</h3>
              <div className="grid gap-3">
                {testPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isAuthenticated || loading}
                    onClick={() => setSymptoms(preset.text)}
                    className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all flex justify-between items-center bg-card ${preset.class} disabled:opacity-50`}
                  >
                    <span>{preset.title}</span>
                    <span className="text-xs opacity-75 font-normal line-clamp-1 max-w-[200px] sm:max-w-xs">{preset.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Presentation (Right panel) */}
          <div className="md:col-span-2">
            {result ? (
              <div className={`rounded-3xl p-8 border shadow-xl relative overflow-hidden transition-all ${
                result.triage_level === 'red'
                  ? 'bg-destructive/5 border-destructive/20 text-destructive'
                  : result.triage_level === 'yellow'
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-green-500/5 border-green-500/20 text-green-600 dark:text-green-400'
              }`}>
                {/* Result header / Alert style */}
                <div className="flex items-center gap-3 mb-6">
                  {result.triage_level === 'red' ? (
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center animate-pulse">
                      <ShieldAlert className="w-6 h-6 text-destructive" />
                    </div>
                  ) : result.triage_level === 'yellow' ? (
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-75">Triage Severity</div>
                    <div className="text-2xl font-extrabold uppercase tracking-tight">{result.triage_level}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Patient's Input</h4>
                    <p className="text-sm font-medium text-foreground italic border-l-2 border-muted pl-3">
                      "{result.symptoms}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Triage Explanation</h4>
                    <p className="text-sm text-foreground leading-relaxed font-semibold">
                      {result.ai_analysis?.explanation}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recommended Actions</h4>
                    <ul className="space-y-2">
                      {result.ai_analysis?.actions.map((act: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5"></span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.ai_analysis?.override && (
                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold">
                      ⚠️ WHO Danger Sign override triggered! The system automatically bypassed the standard AI engine to guarantee clinical safety.
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mt-6 text-[10px] text-muted-foreground flex justify-between">
                    <span>Logged ID: {result.id.slice(0, 8)}...</span>
                    <span>{new Date(result.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[350px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Activity className="w-12 h-12 text-muted-foreground/30 mb-4 animate-pulse" />
                <h4 className="font-extrabold text-foreground mb-2">Waiting for Triage Analysis</h4>
                <p className="text-xs max-w-xs">
                  Describe symptoms on the left panel or click a Quick Test Preset to see real-time AI risk assessment.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
