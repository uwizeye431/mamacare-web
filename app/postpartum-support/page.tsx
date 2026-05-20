import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const weekPlan = [
  {
    phase: "Week 1 to 2",
    focus: "Rest, healing, and gentle bonding",
    image: "https://images.unsplash.com/photo-1617331140180-e8262094733a?auto=format&fit=crop&q=80&w=600&h=400",
    points: [
      "Prioritize sleep and ask family for support",
      "Monitor bleeding, fever, and pain levels",
      "Practice skin-to-skin care and early feeding support",
    ],
  },
  {
    phase: "Week 3 to 4",
    focus: "Light activity and emotional check-in",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600&h=400",
    points: [
      "Begin short walks if comfortable",
      "Continue hydration and protein-rich meals",
      "Talk to your provider if mood remains low or anxious",
    ],
  },
  {
    phase: "Week 5 to 6",
    focus: "Recovery review and strength return",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
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

        {/* Hero Section */}
        <section className="rounded-3xl border border-border bg-card overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1537673156864-5d2c72de7824?auto=format&fit=crop&q=80&w=1500&h=500"
            alt="Mother and newborn in postpartum care setting"
            className="w-full h-64 object-cover object-center"
          />
          <div className="p-8 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Professional Recovery Guide</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">Postpartum Support</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              The first six weeks after birth are critical for healing and emotional wellbeing. This guide helps mothers recover safely, care for newborns confidently, and identify warning signs early.
            </p>
          </div>
        </section>

        {/* Modern Phase Cards Grid */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          {weekPlan.map((item) => (
            <article 
              key={item.phase} 
              className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Context-matching Unsplash Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.focus}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Floating Modern Badge for Phase */}
                <span className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-background/95 backdrop-blur text-primary shadow-sm">
                  {item.phase}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-black text-foreground mb-4 leading-snug group-hover:text-primary transition-colors duration-300">
                    {item.focus}
                  </h2>
                  <div className="space-y-3">
                    {item.points.map((point) => (
                      <div 
                        key={point} 
                        className="relative pl-4 border-l-2 border-primary/40 text-sm text-muted-foreground leading-relaxed hover:border-primary transition-colors duration-300"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Daily Essentials & Warning Signs Section */}
        <section className="grid md:grid-cols-2 gap-6">
          
          {/* Daily Postpartum Essentials Card */}
          <article className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1.5 transition-all duration-300">
            {/* Header Image of Mother Relaxing/Mindful Self-Care */}
            <div className="relative h-56 w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800&h=400"
                alt="Mother relaxing peacefully for self-care"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Elegant floating gradient accent bar at the bottom of the image */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-400" />
            </div>

            {/* Card Content */}
            <div className="p-8 flex-grow">
              <h3 className="text-2xl font-black text-foreground mb-6 group-hover:text-primary transition-colors duration-300">
                Daily Postpartum Essentials
              </h3>
              <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-primary/50 text-sm sm:text-base text-muted-foreground leading-relaxed hover:border-primary transition-colors duration-300">
                  Feed baby frequently and monitor urine/stool output.
                </div>
                <div className="relative pl-4 border-l-2 border-primary/50 text-sm sm:text-base text-muted-foreground leading-relaxed hover:border-primary transition-colors duration-300">
                  Keep balanced nutrition, hydration, and gentle movement.
                </div>
                <div className="relative pl-4 border-l-2 border-primary/50 text-sm sm:text-base text-muted-foreground leading-relaxed hover:border-primary transition-colors duration-300">
                  Rest whenever baby sleeps and protect your mental wellbeing.
                </div>
              </div>
            </div>
          </article>

          {/* Danger Signs Card */}
          <article className="group flex flex-col rounded-3xl border border-destructive/20 bg-destructive/5 overflow-hidden hover:shadow-2xl hover:border-destructive/30 hover:-translate-y-1.5 transition-all duration-300">
            {/* Header Image of Medical Distress / Urgency */}
            <div className="relative h-56 w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800&h=400"
                alt="Emergency clinical room patient medical urgency monitor"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Elegant floating gradient accent bar at the bottom of the image */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive to-red-400" />
            </div>

            {/* Card Content */}
            <div className="p-8 flex-grow">
              <h3 className="text-2xl font-black text-foreground mb-6 group-hover:text-destructive transition-colors duration-300">
                Danger Signs: Seek Urgent Care
              </h3>
              <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-destructive/60 text-sm sm:text-base text-foreground/85 leading-relaxed hover:border-destructive transition-colors duration-300">
                  Heavy bleeding soaking pads quickly
                </div>
                <div className="relative pl-4 border-l-2 border-destructive/60 text-sm sm:text-base text-foreground/85 leading-relaxed hover:border-destructive transition-colors duration-300">
                  Fever, severe headache, chest pain, or breathing difficulty
                </div>
                <div className="relative pl-4 border-l-2 border-destructive/60 text-sm sm:text-base text-foreground/85 leading-relaxed hover:border-destructive transition-colors duration-300">
                  Persistent sadness, hopelessness, or harmful thoughts
                </div>
              </div>
            </div>
          </article>

        </section>
      </div>
    </main>
  );
}
