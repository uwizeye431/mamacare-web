"use client"

import { useState } from "react";
import { Baby, CheckCircle2 } from "lucide-react";

// Typical minimum output for a breastfed baby in the first week (WHO / UNICEF Baby Friendly guidance)
const BY_DAY = [
  { label: "Day 1", wet: "1 or more", stools: "1 or more: black, sticky (meconium)" },
  { label: "Day 2", wet: "2 or more", stools: "1 or more: black or dark green" },
  { label: "Day 3", wet: "3 or more, heavier", stools: "2 or more: changing to green or brown" },
  { label: "Day 4", wet: "4 or more", stools: "2 or more: turning yellow" },
  { label: "Day 5", wet: "5 or more", stools: "2 or more: yellow and runny" },
  { label: "Day 6", wet: "6 or more, heavy", stools: "2 or more: yellow and runny" },
  { label: "1 to 6 weeks", wet: "6 or more, heavy, pale urine", stools: "2 or more yellow stools a day (may be fewer after 6 weeks)" },
];

export default function NappyChecker() {
  const [day, setDay] = useState(0);
  const row = BY_DAY[day];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 h-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Baby className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Is my baby getting enough milk?</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Wet and dirty nappies (diapers) are the best everyday sign. Choose your baby&apos;s age to see what to expect in
        24 hours.
      </p>

      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Baby's age">
        {BY_DAY.map((d, i) => (
          <button
            key={d.label}
            type="button"
            role="tab"
            aria-selected={day === i}
            onClick={() => setDay(i)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              day === i ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Wet nappies</div>
          <div className="mt-1 text-lg font-black text-foreground">{row.wet}</div>
        </div>
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirty nappies</div>
          <div className="mt-1 text-lg font-black text-foreground">{row.stools}</div>
        </div>
      </div>

      <div className="text-sm font-bold text-foreground mb-2">Other good signs</div>
      <ul className="space-y-2">
        {[
          "You can hear or see your baby swallowing during feeds",
          "Your baby seems content and lets go of the breast on their own",
          "Your baby is back to birth weight by 2 weeks and keeps gaining",
          "Your breasts feel softer after a feed",
        ].map((sign) => (
          <li key={sign} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            {sign}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm font-semibold text-destructive">
        Fewer wet nappies than this, dark urine, no yellow stools by day 5, or a very sleepy baby who will not feed:
        see a health worker today.
      </p>
    </div>
  );
}
