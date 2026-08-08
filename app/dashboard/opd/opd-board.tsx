"use client";

import * as React from "react";
import { Sun, Sunset, Moon, Phone, Check, X, Clock } from "lucide-react";
import { DashCard } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { DashAvatar } from "@/components/dashboard/ui/dash-avatar";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { MiniStatCard } from "@/components/dashboard/ui/mini-stat-card";
import { RefreshButton } from "@/components/dashboard/ui/refresh-button";
import { useNotifications } from "@/components/dashboard/notifications-context";
import { useServerAction } from "@/hooks/use-server-action";
import { updateAppointment } from "@/lib/actions/appointments";
import { cn } from "@/lib/utils";
import type { AppointmentWithRelations, AppointmentStatus, TimeSlot } from "@/types/database";

const SLOTS: { value: TimeSlot; label: string; icon: React.ElementType; hint: string }[] = [
  { value: "Morning", label: "Morning", icon: Sun, hint: "8 AM – 12 PM" },
  { value: "Afternoon", label: "Afternoon", icon: Sunset, hint: "12 – 4 PM" },
  { value: "Evening", label: "Evening", icon: Moon, hint: "4 – 8 PM" },
];

function QueueRow({ a }: { a: AppointmentWithRelations }) {
  const action = useServerAction(updateAppointment, { successMessage: "Queue updated" });

  const setStatus = (status: AppointmentStatus) => action.run(a.id, { status });

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-dash-border bg-dash-surface">
      <DashAvatar name={a.patient_name} size={40} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[14px] text-dash-text truncate">
            {a.patient_name}
          </span>
          <StatusBadge status={a.status} small />
        </div>
        <div className="text-[12px] text-dash-text-mute truncate">
          {a.doctors?.name ?? "Unassigned"}
          {a.departments?.name ? ` · ${a.departments.name}` : ""}
          {a.patient_phone ? ` · ${a.patient_phone}` : ""}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <a
          href={`tel:${a.patient_phone}`}
          aria-label="Call patient"
          className="w-8 h-8 rounded-lg border border-dash-border flex items-center justify-center text-dash-text-dim hover:text-brand-teal hover:border-brand-teal transition-colors"
        >
          <Phone size={14} />
        </a>
        {a.status !== "confirmed" && (
          <button
            onClick={() => setStatus("confirmed")}
            disabled={action.pending}
            aria-label="Mark confirmed"
            className="w-8 h-8 rounded-lg border border-green-200 bg-green-50 flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <Check size={15} />
          </button>
        )}
        {a.status !== "cancelled" && (
          <button
            onClick={() => setStatus("cancelled")}
            disabled={action.pending}
            aria-label="Cancel appointment"
            className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export function OpdBoard({
  appointments,
  today,
}: {
  appointments: AppointmentWithRelations[];
  today: string;
}) {
  // New-appointment pings, toasts, browser notifications and auto-refresh are
  // handled centrally by the NotificationsProvider (poll + realtime). Here we
  // just reflect its connection status.
  const { connected: live } = useNotifications();

  const active = appointments.filter((a) => a.status !== "cancelled");
  const counts = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    waiting: appointments.filter((a) => a.status === "new" || a.status === "contacted").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const bySlot = (slot: TimeSlot) => active.filter((a) => a.time_slot === slot);
  const unslotted = active.filter((a) => !a.time_slot);

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Today's OPD"
        subtitle={`${today} · ${counts.total} appointment${counts.total === 1 ? "" : "s"} scheduled`}
        actions={
          <>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold border",
                live
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-slate-100 text-slate-500 border-slate-200",
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  live ? "bg-green-500 animate-pulse" : "bg-amber-500 animate-pulse",
                )}
              />
              {live ? "Live" : "Auto-refresh"}
            </span>
            <RefreshButton />
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3.5 mb-6 opd-mini">
        <MiniStatCard label="Scheduled Today" value={counts.total} color="teal" />
        <MiniStatCard label="Confirmed" value={counts.confirmed} color="sky" live />
        <MiniStatCard label="Waiting" value={counts.waiting} color="amber" />
        <MiniStatCard label="Cancelled" value={counts.cancelled} color="muted" />
      </div>

      {counts.total === 0 ? (
        <DashCard className="py-16 text-center">
          <Clock size={28} className="mx-auto mb-3 text-dash-text-mute" />
          <p className="text-dash-text font-semibold">No OPD appointments for today</p>
          <p className="text-dash-text-mute text-sm mt-1">
            New bookings from the website will appear here automatically.
          </p>
        </DashCard>
      ) : (
        <div className="grid grid-cols-3 gap-[18px] opd-cols">
          {SLOTS.map(({ value, label, icon: SlotIcon, hint }) => {
            const rows = bySlot(value);
            return (
              <DashCard key={value} noPad className="overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-dash-border bg-dash-surface-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal-50 text-brand-teal flex items-center justify-center">
                    <SlotIcon size={16} />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold text-dash-text">{label}</div>
                    <div className="text-[11px] text-dash-text-mute">{hint}</div>
                  </div>
                  <span className="ml-auto dash-pill dash-pill-slate">{rows.length}</span>
                </div>
                <div className="p-3 flex flex-col gap-2.5 min-h-[80px]">
                  {rows.length === 0 ? (
                    <p className="text-[12.5px] text-dash-text-mute text-center py-6">
                      No patients in this slot.
                    </p>
                  ) : (
                    rows.map((a) => <QueueRow key={a.id} a={a} />)
                  )}
                </div>
              </DashCard>
            );
          })}
        </div>
      )}

      {unslotted.length > 0 && (
        <DashCard noPad className="overflow-hidden mt-[18px]">
          <div className="px-4 py-3 border-b border-dash-border bg-dash-surface-3 text-[13.5px] font-bold text-dash-text">
            No time slot selected
            <span className="ml-2 dash-pill dash-pill-slate">{unslotted.length}</span>
          </div>
          <div className="p-3 grid gap-2.5 md:grid-cols-2">
            {unslotted.map((a) => (
              <QueueRow key={a.id} a={a} />
            ))}
          </div>
        </DashCard>
      )}

      <style>{`
        @media (max-width: 1000px) { .opd-cols { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) { .opd-mini { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}
