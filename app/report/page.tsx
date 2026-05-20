"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Calendar, Activity, TrendingUp, AlertTriangle, CheckCircle2, 
  Clock, Printer, ArrowLeft, RefreshCw, Sparkles, ShieldAlert, BarChart3
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function ReportPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [symptomHistory, setSymptomHistory] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<'7' | '30' | 'all'>('all');
  const [error, setError] = useState('');

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch profile
      const profileRes = await fetch('http://localhost:5000/api/profile/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (profileRes.status === 404) {
        setProfile(null);
        setLoading(false);
        return;
      }
      
      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData.profile);
      }

      // 2. Fetch symptoms history
      const symptomsRes = await fetch('http://localhost:5000/api/symptoms/history', {
        method: 'GET',
        credentials: 'include'
      });

      if (symptomsRes.ok) {
        const sData = await symptomsRes.json();
        setSymptomHistory(sData.logs || []);
      }

      // 3. Fetch visits history
      const visitsRes = await fetch('http://localhost:5000/api/visits', {
        method: 'GET',
        credentials: 'include'
      });

      if (visitsRes.ok) {
        const vData = await visitsRes.json();
        setVisits(vData.visits || []);
      }
    } catch (err: any) {
      console.error('Error fetching health report:', err);
      setError('Could not load report details. Make sure your server is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Generating pregnancy trend report...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen w-full bg-background py-20 px-4 relative overflow-hidden flex items-center justify-center">
        <div className="max-w-2xl w-full glass p-10 rounded-3xl border border-border text-center shadow-2xl relative z-10">
          <Heart className="w-16 h-16 text-primary animate-pulse mx-auto mb-6" fill="currentColor" />
          <h2 className="text-2xl font-black text-foreground mb-4">No active pregnancy profile</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed mb-8">
            Before generating a pregnancy health report and tracking vital charts over time, please configure your dates in the portal.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/95 transition-all shadow-md"
          >
            Setup Pregnancydates
          </Link>
        </div>
      </main>
    );
  }

  // Filter lists based on selected period
  const filterByDate = (itemDateStr: string) => {
    if (filterPeriod === 'all') return true;
    const date = new Date(itemDateStr);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= parseInt(filterPeriod, 10);
  };

  const filteredSymptoms = symptomHistory.filter(log => filterByDate(log.created_at));
  
  // Completed visits with vital details
  const completedVisits = visits.filter(v => v.actual_date && filterByDate(v.actual_date));

  // 1. Calculate aggregated triage statistics
  const redCount = filteredSymptoms.filter(s => s.triage_level === 'RED').length;
  const yellowCount = filteredSymptoms.filter(s => s.triage_level === 'YELLOW').length;
  const greenCount = filteredSymptoms.filter(s => s.triage_level === 'GREEN').length;

  // 2. Identify clinical warnings and dangerous parameters
  const recentRedLogs = filteredSymptoms.filter(s => s.triage_level === 'RED').slice(0, 3);

  // 3. Preeclampsia Screening Vitals Analysis (Systolic >= 140 or Diastolic >= 90 is high alert!)
  const highBpAlert = completedVisits.some(v => (v.bp_systolic && v.bp_systolic >= 140) || (v.bp_diastolic && v.bp_diastolic >= 90));

  return (
    <main className="min-h-screen w-full bg-background pt-24 pb-16 px-4 md:px-8 relative overflow-hidden print:bg-white print:pt-4 print:pb-4 print:px-0">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none print:hidden"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl pointer-events-none print:hidden"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation Row - clean, properly spaced, hidden in print */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10 print:hidden">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-sm font-bold text-foreground hover:text-primary hover:border-primary/40 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4" /> Print Clinical Summary
          </button>
        </div>

        {/* Print-Only Header Block */}
        <div className="hidden print:block border-b-2 border-primary pb-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-primary uppercase tracking-tight">Mamacare Clinical Report</h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">Pregnancy Progression & Physiological Vitals History</p>
            </div>
            <div className="text-right text-xs text-slate-500 leading-normal">
              <div>Printed: {new Date().toLocaleDateString()}</div>
              <div>Patient: {user?.name}</div>
              <div>Maternal ID: MC-{profile.id.slice(0,6).toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Header Widget */}
        <div className="glass p-8 rounded-3xl border border-border shadow-xl mb-8 print:border-none print:shadow-none print:bg-white print:p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 print:hidden">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                  Health analytics
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Dynamic trend tracker
                </span>
              </div>
              
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Pregnancy Health Report</h2>
              <p className="text-muted-foreground text-sm mt-1 print:text-slate-600">
                Patient: <span className="font-bold text-foreground print:text-slate-900">{user?.name}</span> • Gestational Profile calculation based on LMP: <span className="font-bold text-primary">{new Date(profile.lmp).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>.
              </p>
            </div>

            {/* Date filter selector - Hidden in print */}
            <div className="flex items-center gap-2 shrink-0 print:hidden">
              <label className="text-xs font-bold text-muted-foreground uppercase">Filter period:</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="all">Full Pregnancy (All Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Aggregated Stats Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Triage Checks</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground">{filteredSymptoms.length}</span>
              <span className="text-[10px] text-muted-foreground">logs</span>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Red Alert Triage</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-red-500">{redCount}</span>
              <span className="text-[10px] text-red-500 font-bold uppercase">Emergency</span>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Yellow Triage</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-500">{yellowCount}</span>
              <span className="text-[10px] text-amber-500 font-bold uppercase">Elevated</span>
            </div>
          </div>

          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Clinic Visits Logged</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-green-500">{completedVisits.length}</span>
              <span className="text-[10px] text-green-500 font-bold uppercase">Completed</span>
            </div>
          </div>

        </div>

        {/* High Risk clinical alerts block */}
        {highBpAlert && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3.5">
            <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider mb-1">Preeclampsia Risk Alert: High Blood Pressure Detected</h4>
              <p className="text-xs leading-relaxed opacity-90">
                Your completed ANC vitals show a systolic Blood Pressure at or above 140 or diastolic BP at or above 90 mmHg. Please discuss these trends during your next clinic visit at Remera Health Center to monitor for gestational preeclampsia.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Trend Content Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column: Physiological Vitals Progress */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-border shadow-xl print:border-none print:shadow-none print:p-0">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-extrabold text-foreground">Physiological vitals history</h3>
            </div>

            {completedVisits.length > 0 ? (
              <div className="space-y-6">
                
                {/* Weight progression widget */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Weight Progression</div>
                  <div className="space-y-3">
                    {completedVisits.map((v, i) => (
                      <div key={v.id} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-foreground">Visit {i + 1} ({new Date(v.actual_date).toLocaleDateString()})</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-semibold">{v.weight_kg} kg</span>
                          {/* Visual progress bar representation */}
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${Math.min(100, (v.weight_kg / 100) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blood Pressure timeline widget */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Blood Pressure (BP) Trend</div>
                  <div className="space-y-3">
                    {completedVisits.map((v, i) => {
                      const isHigh = v.bp_systolic >= 140 || v.bp_diastolic >= 90;
                      return (
                        <div key={v.id} className="flex justify-between items-center text-xs">
                          <span className="font-bold text-foreground">Visit {i + 1} ({new Date(v.actual_date).toLocaleDateString()})</span>
                          <span className={`px-2 py-0.5 rounded-lg font-bold ${
                            isHigh ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500'
                          }`}>
                            {v.bp_systolic}/{v.bp_diastolic} mmHg
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fetal Heart Rate widget */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Fetal Heart Rate (FHR) Timeline</div>
                  <div className="space-y-3">
                    {completedVisits.map((v, i) => (
                      <div key={v.id} className="flex justify-between items-center text-xs">
                        <span className="font-bold text-foreground">Visit {i + 1} ({new Date(v.actual_date).toLocaleDateString()})</span>
                        <span className="font-black text-primary">{v.fetal_heart_rate} bpm</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="border border-dashed border-border p-8 rounded-2xl text-center text-muted-foreground">
                <BarChart3 className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3 animate-pulse" />
                <h4 className="font-bold text-foreground mb-1 text-sm">No clinical vitals logged yet</h4>
                <p className="text-[11px] leading-relaxed max-w-xs mx-auto">
                  Completed ANC clinic visits from your 8-visit timeline checklist will populate physiological progression metrics here!
                </p>
              </div>
            )}
          </div>

          {/* Right Column: AI Triage Logs & Danger Signals */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-border shadow-xl print:border-none print:shadow-none print:p-0">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-extrabold text-foreground">Symptom check alerts</h3>
            </div>

            {filteredSymptoms.length > 0 ? (
              <div className="space-y-4">
                
                {/* Red Emergency logs matched */}
                {recentRedLogs.length > 0 && (
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                    <div className="text-xs font-extrabold text-red-500 uppercase tracking-wider flex items-center gap-1 mb-3">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> Flagged WHO Danger signals
                    </div>
                    <div className="space-y-3">
                      {recentRedLogs.map(log => (
                        <div key={log.id} className="text-xs border-b border-border/40 pb-2.5 last:border-none last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-bold uppercase text-[9px]">Danger signal</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed italic">"{log.description}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Normal Logs history timeline summary */}
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Symptom Checks Timeline</div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredSymptoms.map(log => {
                      const level = log.triage_level;
                      return (
                        <div key={log.id} className="flex items-start justify-between gap-3 text-xs border-b border-border/30 pb-3 last:border-none last:pb-0">
                          <div>
                            <div className="font-bold text-foreground">{new Date(log.created_at).toLocaleDateString()}</div>
                            <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">"{log.description}"</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wider uppercase shrink-0 ${
                            level === 'RED' 
                              ? 'bg-red-500/10 text-red-500' 
                              : level === 'YELLOW' 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'bg-green-500/10 text-green-500'
                          }`}>
                            {level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="border border-dashed border-border p-8 rounded-2xl text-center text-muted-foreground">
                <ShieldAlert className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3 animate-pulse" />
                <h4 className="font-bold text-foreground mb-1 text-sm">No symptom logs found</h4>
                <p className="text-[11px] leading-relaxed max-w-xs mx-auto">
                  Logging symptom checks in the Triage Playground will generate historical danger alerts here.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
