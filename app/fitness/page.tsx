"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarCheck2, Clock3, Dumbbell, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

const EXERCISE_SECTIONS = [
  {
    id: "prenatal-yoga",
    title: "Prenatal Yoga and Mobility",
    description:
      "Gentle yoga and mobility exercises that support flexibility, breathing control, and back comfort across all trimesters.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200&h=700",
    alt: "Pregnant woman practicing prenatal yoga",
    level: "Beginner",
    duration: "15 to 20 min",
    items: [
      "Cat-Cow stretches for spinal mobility and lower back relief",
      "Child's pose with pillow support to release hip tension",
      "Butterfly stretch to open hips gently",
      "Side-lying breathwork for calm and oxygen flow",
      "Wall-supported squat holds for pelvic preparation",
    ],
  },
  {
    id: "low-impact-cardio",
    title: "Low Impact Cardio",
    description:
      "Safe cardio choices to improve circulation, stamina, and mood without high joint stress during pregnancy.",
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200&h=700",
    alt: "Woman walking outdoors for cardio exercise",
    level: "Beginner to Intermediate",
    duration: "20 to 30 min",
    items: [
      "Brisk walking with posture focus and hydration breaks",
      "Stationary cycling at moderate intensity",
      "Prenatal dance cardio with controlled movements",
      "Swimming or water walking for full-body support",
      "Step-touch intervals to keep heart rate steady",
    ],
  },
  {
    id: "strength-conditioning",
    title: "Strength and Conditioning",
    description:
      "Functional strength movements that help with posture, daily activities, and labor readiness.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200&h=700",
    alt: "Mother performing safe strength exercises",
    level: "Intermediate",
    duration: "20 to 25 min",
    items: [
      "Bodyweight squats with chair support",
      "Seated dumbbell shoulder press using light weights",
      "Resistance band rows for upper back stability",
      "Standing side leg raises for hip control",
      "Farmer carry with light kettlebells for core endurance",
    ],
  },
  {
    id: "pelvic-floor-recovery",
    title: "Pelvic Floor and Core Recovery",
    description:
      "Postpartum-safe core activation and pelvic floor training to rebuild confidence and stability after birth.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200&h=700",
    alt: "Postpartum mother doing core recovery exercises",
    level: "Postpartum",
    duration: "10 to 20 min",
    items: [
      "Diaphragmatic breathing with pelvic floor connection",
      "Heel slides for deep core activation",
      "Glute bridges with neutral spine",
      "Dead-bug variations with slow control",
      "Kegel sets with full relaxation between reps",
    ],
  },
  {
    id: "postpartum-walking",
    title: "Postpartum Walking Progression",
    description:
      "A structured walk plan to return to activity safely, improve energy, and support emotional wellness.",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=1200&h=700",
    alt: "Mother walking with stroller in urban park",
    level: "Postpartum",
    duration: "15 to 40 min",
    items: [
      "Week 1: short flat walks, 10 to 15 minutes",
      "Week 2 to 3: increase to 20 to 25 minutes",
      "Week 4+: gentle inclines with stroller walking",
      "Add cadence intervals for stamina",
      "Track hydration, sleep, and recovery signs",
    ],
  },
  {
    id: "stretch-recovery",
    title: "Stretch and Recovery Routine",
    description:
      "Daily movement reset that reduces stiffness and helps mothers recover from long sitting or standing hours.",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1200&h=700",
    alt: "Woman stretching on yoga mat for recovery",
    level: "All levels",
    duration: "10 to 15 min",
    items: [
      "Neck and shoulder release sequence",
      "Thoracic spine openers with side reaches",
      "Calf and hamstring stretching at wall",
      "Hip flexor stretch with chair support",
      "5-minute guided body scan relaxation",
    ],
  },
];

export default function FitnessPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 mb-10">
          <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              Active Motherhood
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3 leading-tight">
              Pregnancy Fitness and Exercise Hub
            </h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Explore safe workouts for pregnancy and postpartum recovery. These routines support strength, mobility, stamina, and wellbeing with low-impact movements.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-7">
              <div className="rounded-2xl border border-border px-4 py-3 bg-background/70">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <Dumbbell className="w-4 h-4 text-primary" /> Exercise Plans
                </div>
                <p className="text-sm font-semibold text-foreground">6 modern exercise tracks</p>
              </div>
              <div className="rounded-2xl border border-border px-4 py-3 bg-background/70">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <HeartPulse className="w-4 h-4 text-primary" /> Maternal Safe
                </div>
                <p className="text-sm font-semibold text-foreground">Low impact and trimester-aware</p>
              </div>
              <div className="rounded-2xl border border-border px-4 py-3 bg-background/70">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <CalendarCheck2 className="w-4 h-4 text-primary" /> Weekly Routine
                </div>
                <p className="text-sm font-semibold text-foreground">Easy plans to follow at home</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {EXERCISE_SECTIONS.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="group rounded-3xl overflow-hidden border border-border bg-card hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.image}
                  alt={section.alt}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-white/15 border border-white/30 text-white backdrop-blur">
                    {section.level}
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-bold bg-black/40 border border-white/20 text-white flex items-center gap-1">
                    <Clock3 className="w-3 h-3" />
                    {section.duration}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-black text-foreground mb-2 leading-snug">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{section.description}</p>

                <ul className="space-y-2 mb-4">
                  {section.items.map((item) => (
                    <li key={item} className="text-sm text-foreground/90 leading-relaxed flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-xl font-black text-foreground mb-2">Suggested Weekly Plan</h3>
          <p className="text-sm text-muted-foreground mb-5">
            A simple rotation to stay active while giving your body enough recovery time.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              "Mon: Prenatal yoga + breathing",
              "Tue: 20 min low-impact walk",
              "Wed: Strength + pelvic floor",
              "Thu: Recovery stretch session",
              "Fri: Cardio + mobility flow",
              "Sat: Light walk with hydration focus",
              "Sun: Rest and guided relaxation",
              "Daily: Stop and contact provider if pain, bleeding, or dizziness occurs",
            ].map((plan) => (
              <div key={plan} className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground">
                {plan}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/95 transition-all"
            >
              Set Up Your Pregnancy Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
