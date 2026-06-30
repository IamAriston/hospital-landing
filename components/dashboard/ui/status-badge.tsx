import { cn } from "@/lib/utils";

export const STATUS_CONFIG = {
  // Booking workflow statuses (appointments table)
  new:           { label: "New",         cls: "dash-pill dash-pill-amber", live: true  },
  contacted:     { label: "Contacted",   cls: "dash-pill dash-pill-sky",   live: false },
  confirmed:     { label: "Confirmed",   cls: "dash-pill dash-pill-green", live: false },
  cancelled:     { label: "Cancelled",   cls: "dash-pill dash-pill-red",   live: false },

  // OPD / queue presentation statuses (not in DB, used by mock screens)
  scheduled:     { label: "Scheduled",   cls: "dash-pill dash-pill-sky",   live: false },
  waiting:       { label: "Waiting",     cls: "dash-pill dash-pill-amber", live: false },
  "in-progress": { label: "In Progress", cls: "dash-pill dash-pill-teal",  live: true  },
  completed:     { label: "Completed",   cls: "dash-pill dash-pill-green", live: false },
  "in-opd":      { label: "In OPD",      cls: "dash-pill dash-pill-green", live: true  },
  "in-surgery":  { label: "In Surgery",  cls: "dash-pill dash-pill-amber", live: false },
  break:         { label: "On Break",    cls: "dash-pill dash-pill-slate", live: false },
  "on-call":     { label: "On Call",     cls: "dash-pill dash-pill-sky",   live: false },
  off:           { label: "Off Today",   cls: "dash-pill dash-pill-red",   live: false },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

interface StatusBadgeProps {
  status: StatusKey | string;
  className?: string;
  small?: boolean;
}

export function StatusBadge({ status, className, small = false }: StatusBadgeProps) {
  const config =
    STATUS_CONFIG[status as StatusKey] ??
    ({ label: status, cls: "dash-pill dash-pill-slate", live: false } as const);

  return (
    <span
      className={cn(
        config.cls,
        "gap-1.5",
        small && "text-[10.5px] px-2 py-[2px]",
        className
      )}
    >
      {config.live && <span className="dash-live-dot bg-brand-teal" />}
      {config.label}
    </span>
  );
}
