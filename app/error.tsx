'use client' // Error boundaries must be Client Components

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error); // no-op unless Sentry is configured
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-background px-4 pt-24 pb-16">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle className="w-9 h-9 text-destructive" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, this page ran into a problem. Please try again. If you need medical help urgently, don&apos;t wait: call
          912 or go to your nearest health facility.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all"
          >
            <Home className="w-4 h-4" /> Go home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs text-muted-foreground">
            Reference: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </div>
    </main>
  );
}
