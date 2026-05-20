import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ── Care Category Cards with African-context photos ─────────────────────────
const CARE_CARDS = [
  {
    title: "Prenatal Care",
    description:
      "From your first trimester to delivery day, get expert antenatal checkups, nutrition plans, and pregnancy milestone tracking tailored for you.",
    image:
      "https://images.unsplash.com/photo-1590333748338-d629e4564ad9?auto=format&fit=crop&q=80&w=600&h=400",
    alt: "African pregnant woman receiving prenatal care",
    badge: "Most Popular",
    href: "/profile",
  },
  {
    title: "Postpartum Support",
    description:
      "Expert recovery guidance, lactation consulting, and emotional wellness support for the first critical weeks after your beautiful birth.",
    image:
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=600&h=400",
    alt: "African mother holding and caring for her newborn baby",
    badge: null,
    href: "/dashboard",
  },
  {
    title: "AI Symptom Triage",
    description:
      "Describe how you feel in English or Kinyarwanda and get instant WHO danger signal detection with RED, YELLOW, or GREEN clinical priority.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400",
    alt: "African female doctor using digital health monitoring technology",
    badge: "AI Powered",
    href: "/symptoms",
  },
  {
    title: "Baby Names",
    description:
      "Discover thousands of beautiful names from Kinyarwanda, African, English, French, and Arabic cultures with meanings, origins, and a smart name generator.",
    image:
      "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=600&h=400",
    alt: "Happy African family with newborn baby",
    badge: "5,000+ Names",
    href: "/baby-names",
  },
  {
    title: "Fitness and Exercise",
    description:
      "Access pregnancy-safe workouts, postpartum recovery routines, and weekly movement plans designed for maternal health.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600&h=400",
    alt: "Pregnant mother doing safe exercise with support",
    badge: "New",
    href: "/fitness",
  },
];

// ── Fitness Articles with African mothers ───────────────────────────────────
const FITNESS_ARTICLES = [
  {
    id: "prenatal-yoga",
    title: "10 Safe Yoga Poses During Pregnancy",
    description:
      "Stay flexible and reduce lower back pain with these trimester-friendly prenatal yoga sequences certified by physios.",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=700&h=450",
    alt: "Woman doing gentle prenatal yoga stretch on mat",
    tag: "Prenatal Yoga",
    readTime: "5 min read",
    href: "/fitness#prenatal-yoga",
  },
  {
    id: "postpartum-walking",
    title: "Walking After Birth: A Postpartum Guide",
    description:
      "Learn how to safely return to exercise postpartum, with expert tips on rebuilding core strength and staying active with your baby.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=700&h=450",
    alt: "Active mother jogging with baby stroller in park",
    tag: "Postpartum Fitness",
    readTime: "4 min read",
    href: "/fitness#postpartum-walking",
  },
  {
    id: "pelvic-floor-recovery",
    title: "Core and Pelvic Floor Recovery After Birth",
    description:
      "Recover stronger with a step-by-step programme designed by midwives to rebuild pelvic floor health and core stability safely.",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=700&h=450",
    alt: "Woman doing gentle postpartum exercise on yoga mat",
    tag: "Recovery",
    readTime: "6 min read",
    href: "/fitness#pelvic-floor-recovery",
  },
];

export default function Features() {
  return (
    <>
      {/* SECTION 1: Care Cards */}
      <section id="services" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-14">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-3">Your Journey Starts Here</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight max-w-xl">
                Comprehensive Care <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
                  Tailored to You
                </span>
              </h2>
              <p className="text-base text-muted-foreground max-w-sm leading-relaxed md:text-right">
                A holistic approach to maternal health from your first heartbeat to postpartum wellness and beyond.
              </p>
            </div>
            <div className="mt-6 h-px bg-gradient-to-r from-border via-primary/30 to-transparent" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CARE_CARDS.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group block rounded-3xl overflow-hidden border border-border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-extrabold text-base drop-shadow-md">{card.title}</span>
                      {card.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow">
                          {card.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2.5 transition-all">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Fitness & Exercise */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-3">Stay Active and Strong</p>
              <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                Fitness and{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
                  Exercise
                </span>
              </h2>
            </div>
            <Link
              href="/fitness"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4 shrink-0"
            >
              Explore all guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-base text-muted-foreground max-w-2xl mb-4 leading-relaxed">
            Having a baby does not mean putting fitness on hold. Discover pregnancy-safe workouts, 
            postpartum recovery exercises, and active parenting tips. A strong mother raises a strong family.
          </p>
          <div className="h-px bg-gradient-to-r from-border via-primary/30 to-transparent mb-12" />

          <div className="grid md:grid-cols-3 gap-6">
            {FITNESS_ARTICLES.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-60 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur text-white border border-white/20">
                      {article.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    {article.readTime}
                  </div>
                  <h3 className="text-base font-extrabold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
