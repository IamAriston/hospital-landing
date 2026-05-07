"use client";

import { useEffect } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-cream px-5">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border border-red-100 shadow-sm mb-6">
          <Icon name="siren" size={36} stroke={1.5} className="text-red-500" />
        </div>

        <div className="text-[96px] font-extrabold font-display text-navy leading-none tracking-tight">
          500
        </div>
        <h1 className="mt-3 text-2xl font-bold text-navy font-display">
          Something went wrong
        </h1>
        <p className="mt-3 text-slate-500 text-[16px] leading-relaxed">
          We ran into an unexpected error. Our team has been notified. Please
          try again or contact us if the problem persists.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Button onClick={reset} variant="redOutline" size="lg">
            <Icon name="arrow" size={18} stroke={2} />
            Try Again
          </Button>
          <Button href="/" variant="sky" size="lg">
            <Icon name="home" size={18} stroke={2} />
            Back to Home
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
          Need urgent care?{" "}
          <a
            href={`tel:${siteConfig.emergency}`}
            className="text-red-600 font-semibold hover:underline"
          >
            Emergency: {siteConfig.emergency}
          </a>
        </div>
      </div>
    </section>
  );
}
