"use client"

import { useEffect, useState, useSyncExternalStore } from "react";
import { Clock, Milk, Trash2, Undo2 } from "lucide-react";

type Side = "left" | "right" | "both";
interface Feed {
  at: number; // timestamp (ms)
  side: Side;
}

const STORAGE_KEY = "mamacare-feeding-log";
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_STORED = 200;

// Feeds live in this browser's localStorage, which may be unavailable
// (private mode, blocked storage), so every access is guarded.
const listeners = new Set<() => void>();
const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};
const readRaw = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};
const writeFeeds = (feeds: Feed[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feeds.slice(0, MAX_STORED)));
  } catch {
    // Storage unavailable: the log just won't be remembered
  }
  listeners.forEach((notify) => notify());
};
const parseFeeds = (raw: string): Feed[] => {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((f) => typeof f?.at === "number" && ["left", "right", "both"].includes(f?.side))
      : [];
  } catch {
    return [];
  }
};

const logFeed = (side: Side) => writeFeeds([{ at: Date.now(), side }, ...parseFeeds(readRaw())]);

const SIDE_LABEL: Record<Side, string> = { left: "Left", right: "Right", both: "Both" };

const formatAgo = (ms: number) => {
  const minutes = Math.max(0, Math.floor(ms / 60000));
  if (minutes < 1) return "just now";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h} h ${m} min ago` : `${m} min ago`;
};

const formatTime = (at: number) => new Date(at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export default function FeedingLog() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const feeds = parseFeeds(raw); // newest first

  // Re-render every 30 s so "time since last feed" stays current
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  const undoLast = () => writeFeeds(feeds.slice(1));
  const clearAll = () => {
    if (window.confirm("Clear the whole feeding log on this device?")) writeFeeds([]);
  };

  const last = feeds[0];
  const last24h = now === null ? 0 : feeds.filter((f) => now - f.at < DAY_MS).length;
  const sinceLast = last && now !== null ? now - last.at : null;
  const nextSide: Side | null = last ? (last.side === "left" ? "right" : last.side === "right" ? "left" : null) : null;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Milk className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Feeding log</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Tap the breast you fed from when a feed ends. The log is saved only on this device.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {(["left", "right", "both"] as Side[]).map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => logFeed(side)}
            className={`py-4 rounded-2xl font-bold transition-all shadow-sm ${
              nextSide === side
                ? "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
                : "bg-background border border-border text-foreground hover:bg-muted"
            }`}
          >
            {SIDE_LABEL[side]}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last feed</div>
          <div className="mt-1 font-black text-foreground">{sinceLast === null ? "None yet" : formatAgo(sinceLast)}</div>
        </div>
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last 24 hours</div>
          <div className="mt-1 font-black text-foreground">
            {last24h} feed{last24h === 1 ? "" : "s"}
            <span className="text-xs font-semibold text-muted-foreground"> (aim for 8 to 12)</span>
          </div>
        </div>
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start next feed on</div>
          <div className="mt-1 font-black text-foreground">{nextSide ? SIDE_LABEL[nextSide] : "Either side"}</div>
        </div>
      </div>

      {sinceLast !== null && sinceLast > 4 * 60 * 60 * 1000 && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-foreground">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          It has been more than 4 hours since the last feed. A newborn should feed at least every 2 to 3 hours; wake
          your baby gently to feed, and get help if your baby will not feed.
        </div>
      )}

      {feeds.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent feeds</h3>
            <div className="flex gap-3">
              <button type="button" onClick={undoLast} className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground">
                <Undo2 className="w-3.5 h-3.5" /> Undo last
              </button>
              <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 text-xs font-bold text-destructive hover:underline">
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {feeds.slice(0, 8).map((f) => (
              <li key={f.at} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="font-semibold text-foreground">{SIDE_LABEL[f.side]}</span>
                <span className="text-muted-foreground">
                  {new Date(f.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} at {formatTime(f.at)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
