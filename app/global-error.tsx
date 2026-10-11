'use client' // Error boundaries must be Client Components

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Shown only if the root layout itself fails. It replaces the whole document and does not get the
// app's global styles, so it uses inline styles and follows the OS light/dark preference.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error); // no-op unless Sentry is configured
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          colorScheme: "light dark",
          background: "Canvas",
          color: "CanvasText",
        }}
      >
        <title>Something went wrong | MamaCare</title>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>MamaCare is having a problem</h1>
          <p style={{ lineHeight: 1.6, opacity: 0.8, margin: "0 0 24px" }}>
            Please try again in a moment. If you need medical help urgently, call 912 or go to your nearest health
            facility.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              padding: "12px 24px",
              borderRadius: 16,
              border: "none",
              background: "hsl(346 87% 60%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: 24, fontSize: 12, opacity: 0.6 }}>
              Reference: <code>{error.digest}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
