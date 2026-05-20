"use client"

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Activity, BookOpen, Dumbbell, Heart, Info, LayoutDashboard, LogOut, Menu, Sparkles, Stethoscope, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Heart },
    { href: "/symptoms", label: "Symptom Triage", icon: Activity },
    { href: "/fitness", label: "Fitness", icon: Dumbbell },
    { href: "/baby-names", label: "Baby Names", icon: Sparkles },
  ];

  if (isAuthenticated) {
    navItems.push({ href: "/dashboard", label: "My Journey", icon: LayoutDashboard });
  }

  const quickLinks = [
    { href: "/about", label: "About", icon: Info },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/pediatric-basics", label: "Pediatric", icon: Stethoscope },
  ];

  const navItemClass = (href: string) =>
    `inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all ${
      pathname === href
        ? "bg-primary text-primary-foreground shadow"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              MamaCare
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-border bg-card/70 p-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={navItemClass(item.href)}>
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border bg-card/70 p-1.5">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={navItemClass(item.href)}>
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-3">
                <Link 
                  href="/profile/settings" 
                  className="flex items-center gap-2 hover:opacity-85 transition-all rounded-full border border-border bg-card px-3 py-1.5"
                  title="Manage Account"
                >
                  {user?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={user.avatar_url} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border border-primary/30 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 font-black text-xs flex items-center justify-center shadow-sm">
                      {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'M'}
                    </div>
                  )}
                  <span className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={() => clearAuth()}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-1 rounded-full hover:bg-muted"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-full border border-border bg-card text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-2xl border border-border bg-card p-3 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 mt-1 border-t border-border">
                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Quick Links</p>
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated ? (
                <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
                  <Link
                    href="/profile/settings"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-foreground hover:text-primary"
                  >
                    My Account
                  </Link>
                  <button onClick={() => clearAuth()} className="text-sm font-semibold text-destructive">
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
