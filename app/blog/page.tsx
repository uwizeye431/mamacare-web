import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Sparkles } from "lucide-react";

const posts = [
  {
    title: "How to Prepare for Your First ANC Visit",
    excerpt: "A practical checklist for documents, questions, and personal health information to carry.",
    category: "Prenatal Care",
    readTime: "4 min read",
    href: "/blog/first-anc-visit",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=900&h=600",
  },
  {
    title: "Postpartum Recovery: The First 6 Weeks",
    excerpt: "Understand body changes, warning signs, and simple routines that support safe recovery.",
    category: "Postpartum",
    readTime: "5 min read",
    href: "/postpartum-support",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=900&h=600",
  },
  {
    title: "Nutrition Tips for Stronger Pregnancy",
    excerpt: "Simple meal planning guidance for iron, folate, hydration, and balanced daily energy.",
    category: "Nutrition",
    readTime: "6 min read",
    href: "/blog/nutrition-tips-stronger-pregnancy",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=900&h=600",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="rounded-3xl border border-border bg-card p-8 sm:p-12 mb-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Insights and Updates</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">MamaCare Blog</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed mb-6">
              Discover trusted guidance for pregnancy, postpartum care, and newborn wellbeing. Every article is written to help mothers make confident day-to-day health decisions with practical, compassionate support.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="w-4 h-4" />
              New articles every week
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.title} className="rounded-3xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-6">
                <span className="inline-block text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold mb-4">
                  {post.category}
                </span>
                <h2 className="text-xl font-extrabold text-foreground mb-3 leading-snug">{post.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <Clock3 className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                  <Link href={post.href} className="text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
