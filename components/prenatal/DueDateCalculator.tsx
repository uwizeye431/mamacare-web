"use client"

import { useState } from "react";
import Link from "next/link";
import { CalendarHeart, Baby, CalendarCheck } from "lucide-react";
import { ANC_CONTACT_WEEKS } from "./ancSchedule";

const DAY_MS = 24 * 60 * 60 * 1000;
const PREGNANCY_DAYS = 280; // 40 weeks from the first day of the last period

// Parse "yyyy-mm-dd" as a local date (new Date("yyyy-mm-dd") would be UTC and can shift a day)
const parseLocalDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const toInputValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

export default function DueDateCalculator() {
  const [lmp, setLmp] = useState("");

  const today = startOfToday();
  const maxDate = toInputValue(today);
  const minDate = toInputValue(new Date(today.getTime() - 44 * 7 * DAY_MS));

  const lmpDate = lmp ? parseLocalDate(lmp) : null;
  const daysPregnant = lmpDate ? Math.round((today.getTime() - lmpDate.getTime()) / DAY_MS) : null;

  let error = "";
  if (lmpDate && daysPregnant !== null) {
    if (daysPregnant < 0) error = "That date is in the future. Please choose the first day of your last period.";
    else if (daysPregnant > 44 * 7) error = "That date is more than 44 weeks ago. Please check the date, or ask your health worker.";
  }

  const result =
    lmpDate && daysPregnant !== null && !error
      ? (() => {
          const dueDate = new Date(lmpDate.getTime() + PREGNANCY_DAYS * DAY_MS);
          const weeks = Math.floor(daysPregnant / 7);
          const days = daysPregnant % 7;
          const trimester = weeks < 13 ? 1 : weeks < 28 ? 2 : 3;
          const daysLeft = Math.max(0, PREGNANCY_DAYS - daysPregnant);
          const progress = Math.min(100, Math.round((daysPregnant / PREGNANCY_DAYS) * 100));
          const nextContactIndex = ANC_CONTACT_WEEKS.findIndex((w) => w >= weeks);
          const nextContact =
            nextContactIndex >= 0
              ? {
                  number: nextContactIndex + 1,
                  week: ANC_CONTACT_WEEKS[nextContactIndex],
                  date: new Date(lmpDate.getTime() + ANC_CONTACT_WEEKS[nextContactIndex] * 7 * DAY_MS),
                }
              : null;
          return { dueDate, weeks, days, trimester, daysLeft, progress, nextContact };
        })()
      : null;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
          <CalendarHeart className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Due date calculator</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the first day of your last menstrual period (LMP) to estimate your due date, how far along you are,
        and when your next check-up is due.
      </p>

      <label htmlFor="lmp" className="block text-sm font-bold text-foreground mb-2">
        First day of your last period
      </label>
      <input
        id="lmp"
        type="date"
        value={lmp}
        min={minDate}
        max={maxDate}
        onChange={(e) => setLmp(e.target.value)}
        className="w-full sm:w-72 p-3 rounded-2xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
      />

      {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated due date</div>
              <div className="mt-1 text-lg font-black text-foreground">{formatDate(result.dueDate)}</div>
            </div>
            <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">You are</div>
              <div className="mt-1 text-lg font-black text-foreground">
                {result.weeks} weeks{result.days ? `, ${result.days} day${result.days > 1 ? "s" : ""}` : ""}
              </div>
              <div className="text-xs text-muted-foreground">Trimester {result.trimester}</div>
            </div>
            <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Days to go</div>
              <div className="mt-1 text-lg font-black text-foreground">
                {result.daysLeft > 0 ? result.daysLeft : "Due date reached"}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
              <span>Week 0</span>
              <span>{result.progress}% of the way</span>
              <span>Week 40</span>
            </div>
            <div
              className="h-3 rounded-full bg-muted overflow-hidden"
              role="progressbar"
              aria-valuenow={result.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Pregnancy progress"
            >
              <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-primary" style={{ width: `${result.progress}%` }} />
            </div>
          </div>

          {result.nextContact ? (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
              <CalendarCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-bold text-foreground">
                  Next check-up: ANC contact {result.nextContact.number} at week {result.nextContact.week}
                </span>
                <span className="text-muted-foreground"> (around {formatDate(result.nextContact.date)}).</span>
                {result.nextContact.number === 1 && result.weeks > 12 && (
                  <span className="block mt-1 text-muted-foreground">
                    If you have not had your first check-up yet, book it as soon as possible.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
              <Baby className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-foreground">
                You are past 40 weeks. Go to your health facility for a check today if you have not been seen this week.
              </span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            This is an estimate: only about 1 in 20 babies arrive exactly on the due date. An early ultrasound gives a
            more accurate date. Want this tracked automatically?{" "}
            <Link href="/profile" className="font-semibold text-primary hover:underline">
              Save your pregnancy details
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
