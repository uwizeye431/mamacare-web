import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const cards = [
  {
    title: "Newborn Care",
    image:
      "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&q=80&w=900&h=520",
    alt: "Newborn baby resting peacefully",
    description:
      "Learn the first essentials after delivery, including safe handling, warmth, skin-to-skin bonding, and comfort cues.",
  },
  {
    title: "Feeding Basics",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=900&h=520",
    alt: "Mother feeding a baby",
    description:
      "Understand feeding frequency, latching guidance, burping routines, and signs your baby is getting enough milk.",
  },
  {
    title: "Sleep and Routine",
    image:
      "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=900&h=520",
    alt: "Sleeping infant in a calm room",
    description:
      "Build a simple daily rhythm with safe sleep positioning, calming bedtime habits, and healthy nap structure.",
  },
  {
    title: "Growth and Safety",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&q=80&w=900&h=520&v=2",
    alt: "Newborn health examination and safe pediatric care",
    description:
      "Track milestones, immunization schedules, hygiene practices, and danger signs that need quick medical attention.",
  },
];

export default function PediatricBasicsPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Infant Care Essentials</p>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">Pediatric Basics</h1>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">
            Practical guidance for baby care, feeding, sleep, growth, and safety, organized in clean cards for quick reading.
          </p>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-border bg-card overflow-hidden hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1.5 transition-all duration-300 min-h-[430px] flex flex-col"
            >
              <div className="p-3 pb-0">
                <div className="rounded-2xl overflow-hidden border border-border/80 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={card.image} 
                    alt={card.alt} 
                    className="w-full h-[155px] object-cover transition-transform duration-500 hover:scale-105" 
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-background/95 text-foreground text-center text-sm md:text-base font-extrabold py-2 px-3 rounded-xl leading-tight shadow-md backdrop-blur-[2px]">
                    {card.title}
                  </div>
                </div>
              </div>
              <div className="px-5 py-6 flex-1 flex items-start justify-center">
                <p className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed text-center">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
