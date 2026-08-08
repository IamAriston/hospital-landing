"use client";

// global-error replaces the root layout when an error is thrown in the
// layout itself, so it must render its own <html> and <body>.
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#F8FAFC",
          margin: 0,
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#0C2340",
              lineHeight: 1,
            }}
          >
            500
          </div>
          <h1 style={{ marginTop: 12, fontSize: 22, color: "#0C2340" }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: 10, color: "#64748B", lineHeight: 1.6 }}>
            We hit an unexpected error. Please try again — if the problem
            persists, contact us.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "#0D9488",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
