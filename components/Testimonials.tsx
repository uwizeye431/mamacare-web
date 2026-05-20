import { Heart, MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "Uwase Marie",
    role: "First-time Mother, Kigali",
    content: "MamaCare made my entire pregnancy feel so manageable. The AI symptom triage gave me peace of mind every time I had a late-night worry. It understood me even in Kinyarwanda.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200&h=200",
    weeks: "32 weeks",
    color: "from-rose-500/20 to-pink-500/10",
  },
  {
    name: "Mutesi Grace",
    role: "Mother of Two, Musanze",
    content: "The postpartum dashboard and community support were a lifesaver. Connecting with other moms while tracking my health helped me overcome postpartum anxiety with real data.",
    image: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&q=80&w=200&h=200",
    weeks: "Postpartum",
    color: "from-purple-500/20 to-violet-500/10",
  },
  {
    name: "Ingabire Diane",
    role: "Expectant Mother, Huye",
    content: "I love how the prenatal care tracker shows my exact gestational age every day. My care coordinator checks in regularly and the WHO visit schedule keeps me on track.",
    image: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?auto=format&fit=crop&q=80&w=200&h=200",
    weeks: "24 weeks",
    color: "from-emerald-500/20 to-teal-500/10",
  },
];

export default function Testimonials() {
  return (
    <section id="community" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-14">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-3">Real Rwandan Mothers</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight max-w-xl">
              Hear from Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
                Community
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed md:text-right">
              Real stories from Rwandan mothers who have experienced the MamaCare difference firsthand.
            </p>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-border via-primary/30 to-transparent" />
        </div>

        {/* Testimonial Cards with Photo */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${t.color} border border-border rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden`}
            >
              {/* Decorative quote mark */}
              <div className="absolute top-5 right-6 text-7xl font-black text-primary/10 leading-none select-none pointer-events-none">
                &ldquo;
              </div>

              {/* Quote Icon */}
              <div className="mb-5">
                <MessageCircle className="w-6 h-6 text-primary/60" fill="currentColor" />
              </div>

              {/* Quote text */}
              <p className="text-foreground text-sm leading-relaxed font-medium mb-7 relative z-10">
                {t.content}
              </p>

              {/* Author row with real African photo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                </div>
                <div>
                  <h4 className="font-extrabold text-foreground text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{t.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wider">
                    {t.weeks}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner with African mother background */}
        <div className="mt-16 relative rounded-3xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1569124589354-615739ae007b?auto=format&fit=crop&q=80&w=1400&h=350"
            alt="Group of happy African mothers in community support meeting"
            className="w-full h-64 object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex items-center px-10 sm:px-16">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Join the Movement</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
                Join 10,000+ Rwandan mothers on their journey to safer motherhood
              </h3>
              <a
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm transition-all shadow-xl hover:-translate-y-0.5"
              >
                Start Your Free Journey
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
