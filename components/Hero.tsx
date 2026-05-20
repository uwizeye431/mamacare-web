import Link from "next/link";
import { Activity, Baby } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      
      {/* ── Full-screen background image of a pregnant mother in nursery ── */}
      {/* Using a beautiful Unsplash photo of a happy pregnant mother */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=85&w=1920"
          alt="Happy pregnant mother in a cosy bright nursery room"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay — dark on left for text, clear on right for photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        {/* Subtle gradient at top and bottom for polish */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-40 w-full">
        <div className="max-w-3xl">
          
          {/* Pill badge */}
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold tracking-[0.2em] uppercase bg-white/10 backdrop-blur border border-white/25 text-white/90 mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Rwanda&apos;s #1 Maternal Health Platform
          </span>

          {/* Headline — very large, bold */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.97] mb-8">
            Nurturing Care<br />
            for Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-200">
              Mother&apos;s Journey
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl leading-relaxed font-light">
            Personalized antenatal care, in your language, on any device. Expert AI symptom triage, ANC visit tracking, and baby name discovery — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/symptoms"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-lg font-extrabold transition-all shadow-2xl hover:shadow-rose-500/50 hover:-translate-y-1"
            >
              <Activity className="w-5 h-5" />
              Check Symptoms (AI Triage)
            </Link>

            <Link
              href="/baby-names"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/10 backdrop-blur border border-white/30 text-white text-lg font-extrabold hover:bg-white/20 transition-all shadow-lg"
            >
              <Baby className="w-5 h-5" />
              Discover Baby Names
            </Link>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
