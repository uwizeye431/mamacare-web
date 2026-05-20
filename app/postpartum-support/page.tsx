import Link from "next/link";
import { ArrowLeft, Baby, CheckCircle2, HeartPulse, ShieldAlert, Sparkles } from "lucide-react";

const weekPlan = [
  {
    phase: "Week 1 to 2",
    focus: "Rest, healing, and gentle bonding",
    points: [
      "Prioritize sleep and ask family for support",
      "Monitor bleeding, fever, and pain levels",
      "Practice skin-to-skin care and early feeding support",
    ],
  },
  {
    phase: "Week 3 to 4",
    focus: "Light activity and emotional check-in",
    points: [
      "Begin short walks if comfortable",
      "Continue hydration and protein-rich meals",
      "Talk to your provider if mood remains low or anxious",
    ],
  },
  {
    phase: "Week 5 to 6",
    focus: "Recovery review and strength return",
    points: [
      "Attend follow-up postpartum checkup",
      "Start gentle core and pelvic floor exercises",
      "Plan ongoing birth spacing and family support",
    ],
  },
];

export default function PostpartumSupportPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="rounded-3xl border border-border bg-card overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1581579438747-104c53d7fbc3?auto=format&fit=crop&q=80&w=1500&h=500"
            alt="Mother and newborn in postpartum care setting"
            className="w-full h-56 object-cover"
          />
          <div className="p-8 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Professional Recovery Guide</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">Postpartum Support</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              The first six weeks after birth are critical for healing and emotional wellbeing. This guide helps mothers recover safely, care for newborns confidently, and identify warning signs early.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          {weekPlan.map((item) => (
            <article key={item.phase} className="rounded-3xl border border-border bg-card p-6 hover:shadow-lg transition-all">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{item.phase}</p>
              <h2 className="text-xl font-extrabold text-foreground mb-3">{item.focus}</h2>
              <ul className="space-y-2">
                {item.points.map((point) => (
                  <li key={point} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <article className="rounded-3xl border border-border bg-card p-6">
            <h3 className="text-xl font-black text-foreground mb-3">Daily Postpartum Essentials</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <Baby className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                Feed baby frequently and monitor urine/stool output.
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <HeartPulse className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                Keep balanced nutrition, hydration, and gentle movement.
              </li>
              <li className="text-sm text-muted-foreground flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                Rest whenever baby sleeps and protect your mental wellbeing.
              </li>
            </ul>
          </article>

          <article className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6">
            <h3 className="text-xl font-black text-foreground mb-3">Danger Signs: Seek Urgent Care</h3>
            <ul className="space-y-3">
              <li className="text-sm text-foreground/85 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                Heavy bleeding soaking pads quickly
              </li>
              <li className="text-sm text-foreground/85 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                Fever, severe headache, chest pain, or breathing difficulty
              </li>
              <li className="text-sm text-foreground/85 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                Persistent sadness, hopelessness, or harmful thoughts
              </li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
