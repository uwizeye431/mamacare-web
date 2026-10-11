"use client"

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Inbox, Loader2, ShieldAlert, UserCheck, Users } from "lucide-react";
import { adminApi } from "./adminApi";

interface Stats {
  users: { total: number; verified: number; admins: number; deactivated: number; new_7_days: number; new_30_days: number };
  signupsByWeek: { week: string; count: number }[];
  symptomChecks: { total: number; last_30_days: number; last30DaysByLevel: { red: number; yellow: number; green: number } };
  messages: { total: number; unread: number };
}

// The last 8 weeks (Monday starts), filling weeks with no sign-ups with 0
const lastEightWeeks = (rows: Stats["signupsByWeek"]) => {
  const counts = new Map(rows.map((r) => [r.week, r.count]));
  const monday = new Date();
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() - (7 - i) * 7);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { key, label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), count: counts.get(key) ?? 0 };
  });
};

function Tile({ label, value, hint, icon: Icon }: { label: string; value: number; hint?: string; icon: typeof Users }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="w-4 h-4" aria-hidden="true" /> {label}
      </div>
      <div className="mt-2 text-3xl font-black text-foreground tabular-nums">{value.toLocaleString("en-GB")}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export default function StatsOverview({ onOpenMessages }: { onOpenMessages: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminApi<Stats>("/stats")
      .then((data) => !cancelled && setStats(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>;
  if (!stats) return <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="Loading" />;

  const weeks = lastEightWeeks(stats.signupsByWeek);
  const max = Math.max(1, ...weeks.map((w) => w.count));
  const levels = stats.symptomChecks.last30DaysByLevel;

  return (
    <div className="space-y-8">
      <section aria-label="Users" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile label="Users" value={stats.users.total} hint={`${stats.users.admins} admin · ${stats.users.deactivated} deactivated`} icon={Users} />
        <Tile label="Verified" value={stats.users.verified} hint={`${Math.round((stats.users.verified / Math.max(1, stats.users.total)) * 100)}% of users`} icon={UserCheck} />
        <Tile label="New, 7 days" value={stats.users.new_7_days} hint={`${stats.users.new_30_days} in 30 days`} icon={Users} />
        <Tile label="Symptom checks" value={stats.symptomChecks.total} hint={`${stats.symptomChecks.last_30_days} in 30 days (saved only)`} icon={CheckCircle2} />
      </section>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Sign-ups per week: single series, so no legend; values on hover and in the table */}
        <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-black text-foreground">Sign-ups per week</h2>
          <p className="text-xs text-muted-foreground mb-6">Last 8 weeks, weeks starting Monday</p>
          <div className="flex items-end gap-0.5 h-40 border-b border-border" aria-hidden="true">
            {weeks.map((w) => (
              <div key={w.key} className="group relative flex-1 h-full flex flex-col justify-end items-center">
                <div
                  className="w-3/5 rounded-t bg-primary transition-opacity group-hover:opacity-80"
                  style={{ height: w.count ? `${Math.max(3, (w.count / max) * 100)}%` : "0%" }}
                />
                <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  Week of {w.label}: {w.count}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-0.5 mt-2" aria-hidden="true">
            {weeks.map((w) => (
              <div key={w.key} className="flex-1 text-center text-[10px] text-muted-foreground">{w.label}</div>
            ))}
          </div>
          <table className="sr-only">
            <caption>Sign-ups per week</caption>
            <thead><tr><th>Week starting</th><th>Sign-ups</th></tr></thead>
            <tbody>{weeks.map((w) => <tr key={w.key}><td>{w.label}</td><td>{w.count}</td></tr>)}</tbody>
          </table>
        </section>

        {/* Triage results: status levels always carry an icon and a label, never color alone */}
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-black text-foreground">Symptom check results</h2>
          <p className="text-xs text-muted-foreground mb-6">Saved checks, last 30 days</p>
          <ul className="space-y-3">
            {[
              { key: "red", label: "Urgent (red)", icon: ShieldAlert, tone: "text-red-600 dark:text-red-400 bg-red-500/10" },
              { key: "yellow", label: "Within 24 h (yellow)", icon: AlertTriangle, tone: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
              { key: "green", label: "Home care (green)", icon: CheckCircle2, tone: "text-green-600 dark:text-green-400 bg-green-500/10" },
            ].map(({ key, label, icon: Icon, tone }) => (
              <li key={key} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  {label}
                </span>
                <span className="text-lg font-black text-foreground tabular-nums">{levels[key as keyof typeof levels]}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onOpenMessages}
            className="mt-6 w-full flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span className="flex items-center gap-2"><Inbox className="w-4 h-4" aria-hidden="true" /> Contact messages</span>
            <span className="tabular-nums">{stats.messages.unread} unread / {stats.messages.total}</span>
          </button>
        </section>
      </div>
    </div>
  );
}
