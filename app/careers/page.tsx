import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Sparkles } from "lucide-react";

const openings = [
  {
    role: "Maternal Health Program Coordinator",
    location: "Kigali, Rwanda",
    type: "Full-time",
  },
  {
    role: "Community Health Partnerships Lead",
    location: "Kigali, Rwanda",
    type: "Full-time",
  },
  {
    role: "Frontend Product Engineer",
    location: "Hybrid",
    type: "Full-time",
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="rounded-3xl border border-border bg-card p-8 sm:p-10 mb-8 relative overflow-hidden">
          <div className="absolute -top-16 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Join Our Team</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">Careers at MamaCare</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Help us build better maternal and newborn health experiences for families and health workers.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          {openings.map((job) => (
            <article key={job.role} className="rounded-3xl border border-border bg-card p-6 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground mb-3 leading-snug">{job.role}</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {job.location}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {job.type}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-xl font-black text-foreground mb-2">Apply</h3>
          <p className="text-sm text-muted-foreground">
            Send your CV and cover letter to <span className="font-semibold text-foreground">uwizeyekevin43@gmail.com</span> with the role title as email subject.
          </p>
        </section>
      </div>
    </main>
  );
}
