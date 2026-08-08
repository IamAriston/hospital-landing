"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  /** Cooldown in seconds before the button can be used again. */
  cooldown?: number;
  /** Optional extra work to run alongside the server re-fetch. */
  onRefresh?: () => void;
  className?: string;
  label?: string;
}

/**
 * Re-fetches the latest records without a full page reload. In the App Router
 * `router.refresh()` re-runs the server components (re-hitting the data layer)
 * and reconciles the result while preserving client state. After a refresh the
 * button is disabled for `cooldown` seconds and shows a live countdown.
 */
export function RefreshButton({
  cooldown = 60,
  onRefresh,
  className,
  label = "Refresh",
}: RefreshButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [remaining, setRemaining] = React.useState(0);

  React.useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const disabled = pending || remaining > 0;

  function handleClick() {
    if (disabled) return;
    onRefresh?.();
    startTransition(() => {
      router.refresh();
    });
    setRemaining(cooldown);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={remaining > 0 ? `Refresh available in ${remaining} seconds` : "Refresh"}
      title={remaining > 0 ? `Please wait ${remaining}s before refreshing again` : "Fetch latest records"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[9px] font-semibold transition-all duration-150 cursor-pointer border px-3.5 py-[9px] text-[13.5px]",
        "bg-dash-surface border-dash-border text-dash-text hover:border-dash-border-strong",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <RotateCw size={15} className={cn(pending && "animate-spin")} />
      {remaining > 0 ? `Refresh (${remaining}s)` : label}
    </button>
  );
}
