"use client"

import { useSyncExternalStore } from "react";
import { CheckCircle2, Circle, ClipboardList } from "lucide-react";

const STORAGE_KEY = "mamacare-birth-plan";

const ITEMS = [
  { id: "facility", label: "Choose the health facility where you will give birth" },
  { id: "transport", label: "Arrange transport day and night, and save the phone numbers" },
  { id: "companion", label: "Decide who will go with you and who will care for your home and children" },
  { id: "mutuelle", label: "Check your Mutuelle de Santé (health insurance) is paid and valid" },
  { id: "savings", label: "Put aside money for transport and any costs" },
  { id: "documents", label: "Keep your ANC booklet, ID and insurance card together, ready to take" },
  { id: "bag", label: "Pack a bag: clean cloths and pads, clothes and wraps for the baby, soap, food and water" },
  { id: "chw", label: "Tell your CHW your due date and your plan" },
  { id: "danger", label: "Make sure your family knows the danger signs and what to do" },
  { id: "feeding", label: "Plan to breastfeed within the first hour after birth" },
];

// Ticked items live in this browser's localStorage, which may be unavailable
// (private mode, blocked storage), so every access is guarded.
const listeners = new Set<() => void>();

const readChecked = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

const writeChecked = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable: the ticks just won't be remembered
  }
  listeners.forEach((notify) => notify());
};

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

const parseIds = (raw: string): string[] => {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
};

export default function BirthPlanChecklist() {
  // Raw string snapshot keeps the value stable between renders; "[]" on the server
  const raw = useSyncExternalStore(subscribe, readChecked, () => "[]");
  const checked = new Set(parseIds(raw));

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeChecked([...next]);
  };

  const done = ITEMS.filter((item) => checked.has(item.id)).length;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 h-full">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Birth preparedness plan</h2>
        </div>
        <span className="text-sm font-bold text-primary whitespace-nowrap">
          {done}/{ITEMS.length}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Start your plan by week 30. Tick each step when it is done; your progress is saved on this device.
      </p>

      <ul className="space-y-2">
        {ITEMS.map((item) => {
          const isDone = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={isDone}
                className="w-full flex items-start gap-3 text-left p-3 rounded-2xl hover:bg-muted transition-colors"
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={`text-sm leading-relaxed ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
