"use client"

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { LOCALE_COOKIE, LOCALES, type Locale } from "../i18n/config";

const LABELS: Record<Locale, string> = { en: "EN", rw: "RW" };

// Remember the choice for a year; the server reads this cookie on every request
const saveLocale = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
};

// Switches the interface language and re-renders the page in it
export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const choose = (next: Locale) => {
    if (next === locale) return;
    saveLocale(next);
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`inline-flex items-center gap-0.5 rounded-full border border-border p-0.5 ${pending ? "opacity-60" : ""}`}
    >
      <Languages className="w-3.5 h-3.5 mx-1 text-muted-foreground" aria-hidden="true" />
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          aria-pressed={l === locale}
          lang={l}
          className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
            l === locale ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
