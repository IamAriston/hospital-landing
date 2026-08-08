"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] p-6">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-5">
          <AlertTriangle size={30} />
        </div>
        <h1 className="text-xl font-bold text-dash-text font-display">
          Couldn&apos;t load this page
        </h1>
        <p className="mt-2 text-sm text-dash-text-dim leading-relaxed">
          Something went wrong while loading your dashboard data. This is usually
          temporary — please try again. If it keeps happening, check that the
          database is reachable.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-teal text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <RotateCw size={16} />
          Try again
        </button>
      </div>
    </div>
  );
}
