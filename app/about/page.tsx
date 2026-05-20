import Link from "next/link";
import { ArrowLeft, Globe2, HeartHandshake, Shield, Sparkles, Target, Users } from "lucide-react";

const values = [
  {
    title: "Compassionate Care",
    description: "We design every tool around the dignity, comfort, and safety of mothers and babies.",
    icon: HeartHandshake,
  },
  {
    title: "Clinical Trust",
    description: "Our maternal workflows align with practical antenatal and postpartum care guidance.",
    icon: Shield,
  },
  {
    title: "Inclusive Innovation",
    description: "We build for local communities using accessible language and culturally relevant support.",
    icon: Sparkles,
  },
  {
    title: "Community First",
    description: "We partner with families, CHWs, and health professionals to improve outcomes together.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="rounded-3xl border border-border bg-card p-8 sm:p-12 mb-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Who We Are</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-4">About MamaCare</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed mb-5">
              MamaCare is a modern maternal-health platform built to support mothers through pregnancy, birth preparation, postpartum recovery, and newborn care with practical, trusted guidance.
            </p>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Our mission is simple: combine compassionate care, local relevance, and digital innovation so every mother can feel informed, protected, and supported at every stage.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <article className="rounded-3xl border border-border bg-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200&h=600"
              alt="Modern medical care environment"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-black text-foreground mb-2">Built for Real Maternal Journeys</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                From first ANC registration to postpartum follow-up, our platform focuses on the real challenges mothers face every day.
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-border bg-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200&h=600"
              alt="Care team collaboration and planning"
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-black text-foreground mb-2">Human-Centered and Professional</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We work to make healthcare information easy to understand while keeping it clinically meaningful and action-oriented.
              </p>
            </div>
          </article>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.title} className="rounded-3xl border border-border bg-card p-6 hover:shadow-lg transition-all">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-foreground mb-2">{value.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </article>
            );
          })}
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-8">
          <article className="rounded-3xl border border-border bg-card p-6">
            <Target className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-extrabold text-foreground mb-2">Our Vision</h3>
            <p className="text-sm text-muted-foreground">A world where every mother receives timely support and safe pregnancy care, no matter where she lives.</p>
          </article>
          <article className="rounded-3xl border border-border bg-card p-6">
            <Globe2 className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-extrabold text-foreground mb-2">Our Reach</h3>
            <p className="text-sm text-muted-foreground">Designed for multilingual and multicultural communities, including local maternal-health contexts.</p>
          </article>
          <article className="rounded-3xl border border-border bg-card p-6">
            <HeartHandshake className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-lg font-extrabold text-foreground mb-2">Our Promise</h3>
            <p className="text-sm text-muted-foreground">To keep improving care quality, clarity, and confidence for mothers, babies, and families.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
