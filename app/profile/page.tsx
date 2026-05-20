"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, User, Heart, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Loader2, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  
  const [lmp, setLmp] = useState('');
  const [gravida, setGravida] = useState('1');
  const [para, setPara] = useState('0');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Live calculations to display to the user as they change lmp
  const [calculations, setCalculations] = useState<{
    edd: string;
    weeks: number;
    days: number;
  } | null>(null);

  useEffect(() => {
    if (!lmp) {
      setCalculations(null);
      return;
    }

    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) {
      setCalculations(null);
      return;
    }

    // EDD: LMP + 280 days
    const eddDate = new Date(lmpDate.getTime());
    eddDate.setDate(eddDate.getDate() + 280);

    // Gestational Age
    const today = new Date();
    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let weeks = 0;
    let days = 0;
    if (diffDays >= 0) {
      weeks = Math.floor(diffDays / 7);
      days = diffDays % 7;
    }

    setCalculations({
      edd: eddDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      weeks,
      days
    });
  }, [lmp]);

  const maternalConditions = [
    { id: 'chronic_hypertension', label: 'Chronic Hypertension' },
    { id: 'gestational_diabetes', label: 'Gestational Diabetes' },
    { id: 'previous_c_section', label: 'Previous C-Section' },
    { id: 'asthma', label: 'Asthma' },
    { id: 'cardiac_conditions', label: 'Cardiac Conditions' }
  ];

  const handleConditionChange = (conditionId: string) => {
    setSelectedConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(c => c !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lmp) {
      setError('Please select your Last Menstrual Period (LMP)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Allow cookie sharing
        body: JSON.stringify({
          lmp,
          gravida: parseInt(gravida, 10),
          para: parseInt(para, 10),
          conditions: selectedConditions
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update pregnancy profile');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      if (err instanceof TypeError) {
        setError('Unable to reach the profile service. Please make sure the backend server is running on port 5000, then try again.');
      } else {
        setError(err.message || 'Profile setup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background py-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 grid md:grid-cols-5 gap-8">
        
        {/* Form panel */}
        <div className="md:col-span-3 glass p-8 sm:p-10 rounded-3xl border border-border shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" /> Setup Profile
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Pregnancy Setup</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Tell us about your pregnancy to personalize your ANC timeline, dashboards, and AI symptom monitoring.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Success! Directing to your dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Last Menstrual Period Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Last Menstrual Period (LMP) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  value={lmp}
                  onChange={(e) => setLmp(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                  required
                />
              </div>
            </div>

            {/* Gravida & Para Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Gravida (Total Pregnancies)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={gravida}
                  onChange={(e) => setGravida(e.target.value)}
                  className="block w-full px-4 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Para (Total Births)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={para}
                  onChange={(e) => setPara(e.target.value)}
                  className="block w-full px-4 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                  required
                />
              </div>
            </div>

            {/* Maternal Medical Conditions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Pre-existing medical conditions (Optional)
              </label>
              <div className="grid gap-2">
                {maternalConditions.map((condition) => {
                  const isChecked = selectedConditions.includes(condition.id);
                  return (
                    <button
                      key={condition.id}
                      type="button"
                      onClick={() => handleConditionChange(condition.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left text-sm font-semibold transition-all bg-card ${
                        isChecked 
                          ? 'border-primary bg-primary/5 text-foreground' 
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {isChecked && <span className="w-1.5 h-1.5 bg-background rounded-full"></span>}
                      </span>
                      {condition.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !lmp}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Pregnancy Profile'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Live Calculation Panel */}
        <div className="md:col-span-2 flex flex-col justify-between">
          {calculations ? (
            <div className="rounded-3xl p-8 border border-primary/20 bg-primary/5 shadow-xl relative overflow-hidden transition-all h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                </div>
                
                <h3 className="text-xl font-extrabold text-foreground mb-4">Estimated Date of Delivery</h3>
                <div className="text-3xl font-black text-primary tracking-tight mb-2">
                  {calculations.edd}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  Calculated automatically based on your Last Menstrual Period using standard WHO Naegele's rule formulas.
                </p>

                <hr className="border-border my-6" />

                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Gestational Age</h4>
                <div className="text-2xl font-extrabold text-foreground mb-1">
                  {calculations.weeks} Weeks, {calculations.days} Days
                </div>
                <p className="text-xs text-muted-foreground">
                  You are currently in your <span className="font-bold text-primary"> trimester {calculations.weeks < 13 ? '1' : calculations.weeks < 27 ? '2' : '3'}</span> of pregnancy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border mt-8 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-[11px] text-muted-foreground leading-relaxed">
                  We will automatically configure your **8 Antenatal Care (ANC) scheduled visits** mapped specifically to these weeks!
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[300px]">
              <Calendar className="w-12 h-12 text-muted-foreground/30 mb-4 animate-pulse" />
              <h4 className="font-extrabold text-foreground mb-2">Pregnancy Metrics</h4>
              <p className="text-xs max-w-xs leading-relaxed">
                Select your Last Menstrual Period (LMP) date on the left to dynamically compute your pregnancy trimester details, estimated delivery date, and prenatal checklist!
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
