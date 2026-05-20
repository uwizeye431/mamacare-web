import Link from "next/link";
import { ArrowLeft, ClipboardList, FileText, HeartPulse, MessageSquareText } from "lucide-react";

const checklist = [
  {
    title: "What to Carry",
    icon: FileText,
    items: [
      "Identification card and health insurance details if available",
      "Any previous medical records, test results, or prescriptions",
      "A notebook or phone for important instructions",
    ],
  },
  {
    title: "Questions to Ask",
    icon: MessageSquareText,
    items: [
      "Expected due date and trimester milestones",
      "Recommended supplements, vaccinations, and tests",
      "Warning signs that need urgent facility care",
    ],
  },
  {
    title: "Health Information to Share",
    icon: HeartPulse,
    items: [
      "Past pregnancies and delivery history",
      "Current symptoms, allergies, and chronic conditions",
      "Any medications or herbal products you are taking",
    ],
  },
];

export default function FirstAncVisitPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <section className="rounded-3xl border border-border bg-card p-8 sm:p-12 mb-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Prenatal Care Guide</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-4">How to Prepare for Your First ANC Visit</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Your first antenatal care visit helps your provider understand your pregnancy and create a safe follow-up plan. Arriving prepared makes the visit smooth and more valuable.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          {checklist.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-6 hover:shadow-lg transition-all">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-foreground mb-3">{item.title}</h2>
                <ul className="space-y-2">
                  {item.items.map((entry) => (
                    <li key={entry} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                      <ClipboardList className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-xl font-black text-foreground mb-3">Before You Leave the Clinic</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Confirm your next appointment date, understand your test plan, and save emergency contact information for your nearest health facility.
          </p>
        </section>
      </div>
    </main>
  );
}
