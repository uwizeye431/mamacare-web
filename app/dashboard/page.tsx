"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Calendar, Activity, MapPin, Plus, Sparkles, AlertTriangle, 
  CheckCircle2, Clock, ShieldCheck, Phone, RefreshCw, ChevronRight, User, Award, ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [profileData, setProfileData] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Profile
      const profileRes = await fetch('http://localhost:5000/api/profile/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (profileRes.status === 404) {
        // No active pregnancy profile setup yet
        setProfileData(null);
        setLoading(false);
        return;
      }

      if (!profileRes.ok) {
        throw new Error('Failed to load profile details');
      }

      const pData = await profileRes.json();
      setProfileData(pData);

      // 2. Fetch ANC visits linked
      const visitsRes = await fetch('http://localhost:5000/api/visits', {
        method: 'GET',
        credentials: 'include'
      });

      if (visitsRes.ok) {
        const vData = await visitsRes.json();
        setVisits(vData.visits || []);
      }
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Error connecting to servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
        <span className="text-sm font-semibold text-muted-foreground">Loading your pregnancy portal...</span>
      </div>
    );
  }

  // 1. Placeholder state: User has not setup their pregnancy profile yet!
  if (!profileData) {
    return (
      <main className="min-h-screen w-full bg-background py-20 px-4 relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-2xl w-full glass p-10 rounded-3xl border border-border shadow-2xl text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Heart className="w-10 h-10 text-primary animate-pulse" fill="currentColor" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Welcome, {user?.name || 'Mamacare Mother'}
          </span>
          
          <h1 className="text-3xl font-extrabold text-foreground mb-4">Setup Your Pregnancy Tracker</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed mb-8">
            To unlock your custom prenatal countdown, 8 scheduled WHO visits timeline, and clinical AI symptom triage logs, please configure your pregnancy setup details first.
          </p>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Pregnancy Setup <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  const { profile, calculations } = profileData;
  const conditionsList = profile.conditions || [];

  return (
    <main className="min-h-screen w-full bg-background py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Exit Dashboard Top Breadcrumb Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary mb-6 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Dashboard to Home
        </Link>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                Active pregnancy profile
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
              Maternal Portal
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, <span className="font-bold text-foreground">{user?.name}</span>. Track your gestational milestones and clinic logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-5 py-3 rounded-2xl border border-border bg-card text-muted-foreground hover:text-foreground font-semibold text-sm hover:bg-muted/50 transition-all flex items-center gap-2"
            >
              Exit Portal
            </Link>
            <Link
              href="/profile"
              className="px-5 py-3 rounded-2xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted/50 transition-all flex items-center gap-2"
            >
              Update Pregnancy dates
            </Link>
            <Link
              href="/symptoms"
              className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/95 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Log symptoms (AI Triage)
            </Link>
          </div>
        </div>

        {/* 3-Column Portal Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Column 1: Gestational Milestone Progress */}
          <div className="space-y-8">
            
            {/* Countdown card */}
            <div className="glass p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Heart className="w-32 h-32 text-primary" fill="currentColor" />
              </div>
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Pregnancy Milestones
                </span>
                <h3 className="text-2xl font-black text-foreground">Trimester {calculations.gestationalWeeks < 13 ? '1' : calculations.gestationalWeeks < 27 ? '2' : '3'}</h3>
                
                <div className="my-6">
                  <div className="text-5xl font-black text-primary tracking-tighter mb-1">
                    {calculations.gestationalWeeks}w {calculations.gestationalDays}d
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gestational Progress calculated from LMP
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
                  <span>Week 0</span>
                  <span className="text-primary font-black">{calculations.progressPercentage}%</span>
                  <span>Week 40</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${calculations.progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="mt-6 flex items-center gap-3 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-foreground">EDD: {new Date(profile.edd).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</div>
                    <div className="text-[10px] text-primary font-bold">{calculations.daysToDelivery} days left to delivery</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Maternal Medical details */}
            <div className="glass p-6 rounded-3xl border border-border shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Obstetric profile history</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card border border-border p-4 rounded-2xl text-center">
                  <div className="text-2xl font-black text-foreground">{profile.gravida || '1'}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Gravida</div>
                </div>
                <div className="bg-card border border-border p-4 rounded-2xl text-center">
                  <div className="text-2xl font-black text-foreground">{profile.para || '0'}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">Para</div>
                </div>
              </div>

              {conditionsList.length > 0 ? (
                <div className="mb-6">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Active high risk conditions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {conditionsList.map((cond: string, idx: number) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 capitalize"
                      >
                        {cond.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-500/5 border border-green-500/10 text-green-600 dark:text-green-400 rounded-2xl text-xs font-semibold mb-6">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>No high-risk conditions logged. Routine low-risk pregnancy.</span>
                </div>
              )}

              <hr className="border-border my-4" />

              <Link
                href="/report"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 font-extrabold text-xs transition-all shadow-sm"
              >
                <Activity className="w-4 h-4" /> View Clinical Health Report
              </Link>
            </div>

          </div>

          {/* Column 2: The WHO 8-Visit Tracker Timeline */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visit progress card */}
            <div className="glass p-8 rounded-3xl border border-border shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary" /> Antenatal care
                  </span>
                  <h3 className="text-2xl font-black text-foreground">WHO 8-Visit Tracker</h3>
                </div>
                
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {visits.filter(v => v.actual_date).length} / 8 Completed
                </span>
              </div>

              {/* Visits list */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {visits.map((visit: any, index: number) => {
                  const isCompleted = !!visit.actual_date;
                  return (
                    <div 
                      key={visit.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCompleted 
                          ? 'bg-green-500/5 border-green-500/10 hover:bg-green-500/10' 
                          : 'bg-card border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                            isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                          }`}>
                            V{index + 1}
                          </span>
                          <div>
                            <div className="text-sm font-extrabold text-foreground flex items-center gap-2">
                              Visit {index + 1}
                              {isCompleted ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-500/10 text-green-500 uppercase">
                                  Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold bg-muted text-muted-foreground uppercase">
                                  Scheduled
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> Due: {new Date(visit.scheduled_date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                            </div>
                          </div>
                        </div>

                        {/* Completed vitals details */}
                        {isCompleted ? (
                          <div className="flex flex-wrap gap-2 sm:justify-end">
                            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-card border border-border text-foreground">
                              BP: {visit.bp_systolic}/{visit.bp_diastolic}
                            </span>
                            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-card border border-border text-foreground">
                              Fundal: {visit.fundal_height_cm}cm
                            </span>
                            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-card border border-border text-foreground">
                              FHR: {visit.fetal_heart_rate}bpm
                            </span>
                            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-card border border-border text-foreground">
                              Weight: {visit.weight_kg}kg
                            </span>
                          </div>
                        ) : (
                          <div className="text-right text-[11px] font-semibold text-muted-foreground flex items-center gap-1 self-start sm:self-center">
                            <Clock className="w-3.5 h-3.5 text-primary" /> Upcoming Clinic check
                          </div>
                        )}
                      </div>

                      {/* Provider Notes block */}
                      {isCompleted && visit.provider_notes && (
                        <div className="mt-3.5 p-3 rounded-xl bg-card border border-border text-[11px] text-muted-foreground leading-relaxed">
                          <span className="font-bold text-foreground block mb-0.5">Clinical notes:</span>
                          {visit.provider_notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Community Clinic Health facility card */}
            <div className="glass p-6 rounded-3xl border border-border shadow-xl grid md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Healthcare Facility
                </span>
                <h4 className="text-lg font-black text-foreground">Remera Health Center</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
                  Your designated primary maternal facility located in Gasabo District, Kigali City.
                </p>

                <div className="mt-4 space-y-2 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> +250 788 775 937
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" /> Mutuelle Accredited
                  </div>
                </div>
              </div>

              {/* Mini Map decoration */}
              <div className="h-32 bg-muted rounded-2xl border border-border relative overflow-hidden flex items-center justify-center">
                {/* Visual styling grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] opacity-60"></div>
                <div className="relative z-10 bg-card p-3 rounded-2xl border border-border shadow-md text-center max-w-[180px]">
                  <MapPin className="w-6 h-6 text-primary mx-auto mb-1 animate-bounce" />
                  <div className="text-[10px] font-bold text-foreground">Remera Health Center</div>
                  <div className="text-[8px] text-muted-foreground">Kigali City, Rwanda</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
