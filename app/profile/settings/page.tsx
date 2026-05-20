"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Globe, Upload, Sparkles, Camera, Check, 
  Loader2, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

// Cute maternal vector cartoon preset avatars for a premium initial experience!
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200', // Mother Avatar 1
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200', // Mother Avatar 2
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200', // Mother Avatar 3
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200&h=200'  // Mother Avatar 4
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('rw');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Set initial states when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLanguage(user.language || 'rw');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  // Handle custom image upload file reading as base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image file is too large. Maximum size is 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.onerror = () => {
      setError('Error reading image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
          avatar_url: avatarUrl || null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update account settings');
      }

      // Update local store state instantly!
      setAuth({
        ...user!,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        language: data.user.language,
        avatar_url: data.user.avatar_url
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background py-20 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Back Link */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to portal
        </button>

        {/* Profile Card */}
        <div className="glass p-8 sm:p-10 rounded-3xl border border-border shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Account Settings
            </span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-foreground mb-6">Profile Settings</h1>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Settings updated successfully! Returning...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Visual Profile Avatar Upload Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-card border border-border">
              
              {/* Circular Avatar Preview Container */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center relative shadow-inner">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={avatarUrl} 
                      alt="Uploaded Profile avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground/40" />
                  )}
                </div>
                
                {/* File picker button */}
                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/95 transition-all cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Presets and details */}
              <div className="flex-1 text-center sm:text-left">
                <div className="text-sm font-bold text-foreground mb-1">Your Profile Image</div>
                <div className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Upload a custom image (max 2MB) or pick one of our beautiful maternal presets:
                </div>
                
                {/* Presets Row */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  {PRESET_AVATARS.map((url, index) => {
                    const isSelected = avatarUrl === url;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 relative transition-all ${
                          isSelected ? 'border-primary scale-110 shadow-md' : 'border-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="preset avatar" className="w-full h-full object-cover" />
                        {isSelected && (
                          <span className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow-md" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Inputs Details */}
            <div className="space-y-5">
              {/* Full Name */}
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
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-semibold"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
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
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-semibold"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
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
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-semibold"
                    placeholder="+250 788..."
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Preferred Language
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                    <Globe className="w-5 h-5" />
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none font-semibold appearance-none cursor-pointer"
                  >
                    <option value="rw">Kinyarwanda</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !name}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Profile Changes'}
                {!loading && <ShieldCheck className="w-5 h-5" />}
              </button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
