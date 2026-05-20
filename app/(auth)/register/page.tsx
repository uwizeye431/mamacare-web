"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, User, Mail, Phone, Lock, ArrowRight, AlertCircle, CheckCircle2, Users, Stethoscope } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // OTP Verification States
  const [otpMode, setOtpMode] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otpCodes, setOtpCodes] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(600); // 10 minutes
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpMode && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpMode, timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Name, email, and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
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
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.requiresVerification) {
        setVerificationEmail(data.email);
        setOtpMode(true);
        setTimer(600);
        setResendDisabled(true);
        setOtpCodes(Array(6).fill(''));
        setError('');
        if (data.otp) {
          setDevOtp(data.otp);
        }
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
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
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
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
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
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Request code resend
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: verificationEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setTimer(600);
      setResendDisabled(true);
      setOtpCodes(Array(6).fill(''));
      if (data.otp) {
        setDevOtp(data.otp);
      }
      
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 50);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTimer = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const roles = [
    { id: 'patient', title: 'Mother', desc: 'Expectant or new mom', icon: Heart },
    { id: 'chw', title: 'CHW', desc: 'Community Health Worker', icon: Users },
    { id: 'provider', title: 'Provider', desc: 'Doctor or Midwife', icon: Stethoscope },
  ];

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
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Verify Your Email</h1>
            <p className="text-muted-foreground mt-3 text-sm text-center max-w-sm">
              We sent a 6-digit confirmation code to{' '}
              <span className="font-bold text-foreground">{verificationEmail}</span>. Enter it below to complete registration.
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
              <span>Email verified successfully! Setting up your session...</span>
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
                  Code expires in <span className="font-mono font-bold text-foreground">{formatTimer()}</span>
                </div>
              ) : (
                <div className="text-sm text-destructive font-semibold">
                  Verification code has expired
                </div>
              )}

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled || resendLoading}
                className="text-sm font-bold text-primary hover:underline hover:opacity-90 disabled:opacity-50 disabled:no-underline transition-all mt-1"
              >
                {resendLoading ? 'Resending code...' : 'Resend Code'}
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setOtpMode(false)}
                className="flex-1 py-4 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || otpCodes.some((d) => d === '')}
                className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2 text-sm text-center">
            Join MamaCare for tailored maternal and healthcare tools
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
            <span>Registration successful! Directing to dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dynamic Role Tiles */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              I am joining as a
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((item) => {
                const Icon = item.icon;
                const isSelected = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-foreground ring-2 ring-primary/20'
                        : 'border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : ''}`} />
                    <span className="text-sm font-bold block">{item.title}</span>
                    <span className="text-[10px] opacity-75 hidden sm:block mt-1">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Phone Number
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
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
