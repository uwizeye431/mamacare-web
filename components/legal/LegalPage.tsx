import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

// Shared layout for the Privacy Policy and Terms of Service: title, date, contents list, sections
export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">{title}</h1>
          <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
        </header>

        <div className="text-muted-foreground leading-relaxed mb-8 space-y-4">{intro}</div>

        <nav aria-label="Contents" className="rounded-3xl border border-border bg-card p-6 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Contents</h2>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 list-decimal list-inside text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-foreground mb-3">
                {i + 1}. {s.title}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_strong]:text-foreground [&_a]:text-primary [&_a:hover]:underline">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
