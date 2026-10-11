import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-background pt-24" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}
