import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Baby, Home, SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
};

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/prenatal-care", label: "Prenatal care", icon: Baby },
  { href: "/symptoms", label: "Check a symptom", icon: Activity },
];

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-background px-4 pt-24 pb-16">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <SearchX className="w-9 h-9 text-primary" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-2">404</p>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">We couldn&apos;t find that page</h1>
        <p className="text-muted-foreground mb-8">
          The link may be broken, or the page may have moved. Here are some places to go instead.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all"
            >
              <Icon className="w-4 h-4 text-primary" /> {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
