"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchAppointmentsSince,
  type AppointmentNotification,
} from "@/lib/actions/notifications";
import { createClient } from "@/lib/supabase/client";
import { playPing } from "@/lib/play-ping";

export type NotificationItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  createdAt: string;
  read: boolean;
};

type Ctx = {
  items: NotificationItem[];
  unreadCount: number;
  connected: boolean;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
};

const NotificationsContext = React.createContext<Ctx | null>(null);

const SINCE_KEY = "astha-notif-since";
const POLL_MS = 20_000;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function toItem(a: AppointmentNotification): NotificationItem {
  const onToday = a.preferred_date === todayIso();
  const bits = [
    a.preferred_date
      ? new Date(a.preferred_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })
      : "Date TBC",
    a.time_slot,
    a.doctor,
    a.department,
  ].filter(Boolean);
  return {
    id: a.id,
    title: `New appointment: ${a.patient_name?.trim() || "Patient"}`,
    subtitle: bits.join(" · "),
    href: onToday ? "/dashboard/opd" : "/dashboard/appointments",
    createdAt: a.created_at,
    read: false,
  };
}

function notifyBrowser(title: string, body: string) {
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  } catch {
    /* ignore */
  }
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const [connected, setConnected] = React.useState(false);

  const sinceRef = React.useRef<string>(new Date().toISOString());
  const firstLoadRef = React.useRef(true);
  const seenRef = React.useRef<Set<string>>(new Set());
  const pollingRef = React.useRef(false);

  const poll = React.useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const res = await fetchAppointmentsSince(sinceRef.current);
      if (!res.ok) return;

      const fresh = res.data.filter((a) => !seenRef.current.has(a.id));
      if (fresh.length === 0) return;

      fresh.forEach((a) => seenRef.current.add(a.id));

      // Advance the watermark to the newest record we've seen.
      const newest = fresh.reduce(
        (max, a) => (a.created_at > max ? a.created_at : max),
        sinceRef.current,
      );
      sinceRef.current = newest;
      try {
        localStorage.setItem(SINCE_KEY, newest);
      } catch {
        /* ignore */
      }

      const newItems = fresh.map(toItem);
      setItems((prev) => [...newItems, ...prev].slice(0, 50));

      // Don't alert for the backlog present on first load — only new arrivals.
      if (!firstLoadRef.current) {
        playPing();
        const lead = newItems[0];
        toast.success(lead.title, {
          description:
            newItems.length > 1
              ? `${newItems.length} new appointments`
              : lead.subtitle,
        });
        notifyBrowser(lead.title, lead.subtitle);
        router.refresh();
      }
    } finally {
      firstLoadRef.current = false;
      pollingRef.current = false;
    }
  }, [router]);

  // Baseline watermark + polling loop.
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(SINCE_KEY);
      if (saved) sinceRef.current = saved;
    } catch {
      /* ignore */
    }

    try {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    } catch {
      /* ignore */
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  // Realtime enhancement — trigger an immediate poll on INSERT (best effort;
  // requires the appointments table in the realtime publication, migration 006).
  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-appointments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        () => poll(),
      )
      .subscribe((status) => setConnected(status === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [poll]);

  const markAllRead = React.useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = React.useCallback((id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const clearAll = React.useCallback(() => setItems([]), []);

  const unreadCount = items.reduce((n, i) => n + (i.read ? 0 : 1), 0);

  const value: Ctx = {
    items,
    unreadCount,
    connected,
    markAllRead,
    markRead,
    clearAll,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
}
