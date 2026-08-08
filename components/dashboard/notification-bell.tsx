"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Check, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "./notifications-context";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationBell() {
  const { items, unreadCount, connected, markAllRead, markRead, clearAll } =
    useNotifications();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open && unreadCount > 0) markAllRead();
        }}
        title="Notifications"
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        className="w-[38px] h-[38px] rounded-[9px] bg-dash-surface border border-dash-border text-dash-text-dim flex items-center justify-center cursor-pointer transition-[border-color,color] duration-[150ms] relative hover:border-dash-border-strong hover:text-dash-text"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-red text-white text-[10.5px] font-bold flex items-center justify-center border-2 border-dash-topbar-bg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[340px] bg-dash-surface border border-dash-border rounded-xl shadow-pop z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-dash-border">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-dash-text">Notifications</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full",
                  connected
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-500",
                )}
                title={connected ? "Realtime connected" : "Auto-refreshing every 20s"}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    connected ? "bg-green-500 animate-pulse" : "bg-slate-400",
                  )}
                />
                {connected ? "Live" : "Auto"}
              </span>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[12px] font-semibold text-dash-text-mute hover:text-dash-text"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell size={26} className="mx-auto mb-2 text-dash-text-mute opacity-50" />
                <p className="text-[13px] text-dash-text-mute">You&apos;re all caught up.</p>
              </div>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex gap-3 px-4 py-3 border-b border-dash-border last:border-0 transition-colors hover:bg-dash-surface-3",
                    !n.read && "bg-brand-teal-50/40",
                  )}
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                    <CalendarClock size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-dash-text truncate">
                      {n.title}
                    </p>
                    {n.subtitle && (
                      <p className="text-[12px] text-dash-text-mute truncate">{n.subtitle}</p>
                    )}
                    <p className="text-[11px] text-dash-text-mute mt-0.5">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 shrink-0" />
                  )}
                </Link>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-4 py-2.5 border-t border-dash-border flex items-center justify-between">
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-dash-text-dim hover:text-dash-text"
              >
                <Check size={14} /> Mark all read
              </button>
              <Link
                href="/dashboard/appointments"
                onClick={() => setOpen(false)}
                className="text-[12.5px] font-semibold text-brand-teal hover:underline"
              >
                View all
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
