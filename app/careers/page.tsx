import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

const openings = [
  {
    role: "Maternal Health Program Coordinator",
    location: "Kigali, Rwanda",
    type: "Full-time",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
    description: "Coordinate clinical support pathways, manage healthcare delivery workflows, and support local community health channels.",
  },
  {
    role: "Community Health Partnerships Lead",
    location: "Kigali, Rwanda",
    type: "Full-time",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600&h=400",
    description: "Lead relationships with Community Health Workers (CHWs), district clinics, and organizational partners to expand our maternal network.",
  },
  {
    role: "Frontend Product Engineer",
    location: "Hybrid / Kigali",
    type: "Full-time",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=400",
    description: "Build beautiful, highly accessible React interfaces, optimize page performance, and shape state-of-the-art telehealth experiences.",
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
              Help us build better maternal and newborn health experiences for families, communities, and healthcare professionals.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          {openings.map((job) => (
            <article 
              key={job.role} 
              className="group flex flex-col rounded-3xl border border-border bg-card overflow-hidden hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Context-matching Unsplash Image Header */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={job.image}
                  alt={job.role}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Floating Modern Badge for job type */}
                <span className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-background/95 backdrop-blur text-primary shadow-sm">
                  {job.type}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-black text-foreground mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                    {job.role}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {job.description}
                  </p>
                </div>

                {/* Card Footer metadata */}
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground pt-4 border-t border-border/50">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{job.location}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-xl font-black text-foreground mb-2">Apply</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Send your CV and cover letter to{" "}
            <a 
              href="mailto:uwizeyekevin43@gmail.com?subject=Application%20for%20MamaCare%20Role"
              className="font-extrabold text-primary hover:underline hover:text-primary/80 transition-colors inline-flex items-center gap-1"
            >
              uwizeyekevin43@gmail.com
            </a>{" "}
            with the role title as the email subject. We look forward to reviewing your application!
          </p>
        </section>
      </div>
    </main>
  );
}
