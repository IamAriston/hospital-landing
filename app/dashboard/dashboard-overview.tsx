"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Stethoscope,
  BedDouble,
  Plus,
  Eye,
  FlaskConical,
  User,
  Siren,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/ui/stat-card";
import { DashCard, DashCardHeader } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { DashAvatar } from "@/components/dashboard/ui/dash-avatar";
import { ActionBtn, ActionLink } from "@/components/dashboard/ui/action-btn";
import { WalkInAppointmentPanel } from "@/components/forms/walk-in-appointment-form";
import { cn } from "@/lib/utils";
import type {
  AppointmentWithRelations,
  DepartmentRow,
  DoctorRow,
} from "@/types/database";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const QUICK_ACTIONS = [
  { icon: Calendar, label: "View Appointments", href: "/dashboard/appointments" },
  { icon: User, label: "Patient Records", href: "/dashboard/patients" },
  { icon: Stethoscope, label: "Doctor Roster", href: "/dashboard/doctors" },
  { icon: FlaskConical, label: "Departments", href: "/dashboard/departments" },
];

interface DashboardOverviewProps {
  firstName: string;
  todayAppointments: AppointmentWithRelations[];
  totalToday: number;
  newCount: number;
  confirmedCount: number;
  doctorsActive: number;
  doctorsTotal: number;
  departments: DepartmentRow[];
  doctors: DoctorRow[];
}

export function DashboardOverview({
  firstName,
  todayAppointments,
  totalToday,
  newCount,
  confirmedCount,
  doctorsActive,
  doctorsTotal,
  departments,
  doctors,
}: DashboardOverviewProps) {
  const [walkInOpen, setWalkInOpen] = React.useState(false);
  const queueNow = todayAppointments.slice(0, 5);

  const byDept: Record<string, number> = {};
  todayAppointments.forEach((a) => {
    const name = a.departments?.name ?? "—";
    byDept[name] = (byDept[name] || 0) + 1;
  });
  const maxDept = Math.max(...Object.values(byDept), 1);
  const topDepts = Object.entries(byDept)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const stats = [
    {
      label: "Appointments Today",
      value: totalToday,
      delta: newCount > 0 ? `${newCount} new` : "—",
      trend: newCount > 0 ? ("up" as const) : null,
      icon: Calendar,
      iconBg: "bg-brand-teal-50",
      iconColor: "text-brand-teal",
    },
    {
      label: "Confirmed Today",
      value: confirmedCount,
      delta: `${totalToday > 0 ? Math.round((confirmedCount / totalToday) * 100) : 0}%`,
      trend: null,
      icon: Clock,
      iconBg: "bg-brand-amber-50",
      iconColor: "text-brand-amber",
    },
    {
      label: "Active Doctors",
      value: doctorsActive,
      delta: `of ${doctorsTotal}`,
      trend: null,
      icon: Stethoscope,
      iconBg: "bg-brand-sky-50",
      iconColor: "text-brand-sky",
    },
    {
      // TODO: phase 2 — wire to a bed-management table
      label: "Beds Available",
      value: "—",
      delta: "TBD",
      trend: null,
      icon: BedDouble,
      iconBg: "bg-dash-surface-3",
      iconColor: "text-dash-text-mute",
    },
  ];

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title={<>{getGreeting()}, {firstName} 👋</>}
        subtitle={<>Here&apos;s what&apos;s happening at Astha today · {todayLabel()}</>}
        actions={
          <>
            <ActionBtn variant="secondary" onClick={() => window.location.reload()}>
              Refresh
            </ActionBtn>
            <ActionLink href="/dashboard/appointments" variant="secondary">
              View Inbox
            </ActionLink>
            <ActionBtn
              variant="primary"
              icon={<Plus size={16} strokeWidth={2.4} />}
              onClick={() => setWalkInOpen(true)}
            >
              New Appointment
            </ActionBtn>
          </>
        }
      />

      <WalkInAppointmentPanel
        open={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        departments={departments}
        doctors={doctors}
      />

      <div className="grid grid-cols-4 gap-[18px] mb-6 ov-stats">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            {...s}
            animateClass={`dash-animate dash-animate-${((i + 1) as 1 | 2 | 3 | 4)}`}
          />
        ))}
      </div>

      <div className="grid gap-[18px] ov-grid grid-cols-[1.6fr_1fr]">
        <DashCard noPad className="overflow-hidden dash-animate">
          <DashCardHeader>
            <div>
              <h3 className="text-base font-bold text-dash-text">Today&apos;s Queue</h3>
              <p className="text-[12.5px] text-dash-text-mute mt-0.5">
                Appointments scheduled for today
              </p>
            </div>
            <ActionLink
              href="/dashboard/appointments"
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={14} />}
            >
              View All
            </ActionLink>
          </DashCardHeader>

          {queueNow.length === 0 ? (
            <p className="p-10 text-center text-sm text-dash-text-mute">
              No appointments scheduled for today.
            </p>
          ) : (
            queueNow.map((a, i) => (
              <div
                key={a.id}
                className={cn(
                  "grid items-center gap-3.5 px-5 py-3.5 dash-table-row grid-cols-[80px_1fr_auto_auto]",
                  i < queueNow.length - 1 && "border-b border-dash-border",
                )}
              >
                <div className="font-mono text-[13.5px] font-bold text-dash-text bg-dash-surface-3 px-2.5 py-1.5 rounded-lg text-center">
                  {a.time_slot ?? "—"}
                </div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <DashAvatar name={a.patient_name} size={36} />
                  <div className="min-w-0">
                    <p className="font-semibold text-[13.5px] text-dash-text truncate">
                      {a.patient_name}
                    </p>
                    <p className="text-[12px] text-dash-text-mute truncate">
                      {a.doctors?.name ?? "Any doctor"} ·{" "}
                      {a.departments?.name ?? "—"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
                <Link
                  href="/dashboard/appointments"
                  aria-label="View appointment"
                  className="w-[34px] h-[34px] rounded-lg border border-dash-border bg-dash-surface text-dash-text-mute flex items-center justify-center hover:text-dash-text hover:border-dash-border-strong transition-all"
                >
                  <Eye size={14} />
                </Link>
              </div>
            ))
          )}
        </DashCard>

        <div className="flex flex-col gap-[18px]">
          {/* <DashCard>
            <h3 className="text-[15px] font-bold text-dash-text mb-3.5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((q) => (
                <Link
                  key={q.label}
                  href={q.href}
                  className="flex flex-col items-start gap-2 p-3.5 bg-dash-surface border border-dash-border rounded-xl cursor-pointer transition-all hover:border-brand-teal hover:-translate-y-[2px] hover:shadow-hover"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-teal-50 text-brand-teal flex items-center justify-center">
                    <q.icon size={16} />
                  </div>
                  <span className="text-[13px] font-semibold text-dash-text">{q.label}</span>
                </Link>
              ))}
            </div>
          </DashCard> */}

          {/* {topDepts.length > 0 && ( */}
            <DashCard>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-[15px] font-bold text-dash-text">Today by Department</h3>
                <span className="dash-pill dash-pill-teal !px-[10px] !py-[5px]">
                  {totalToday} total
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {topDepts.map(([dept, n]) => (
                  <div key={dept}>
                    <div className="flex justify-between text-[12.5px] mb-1">
                      <span className="text-dash-text font-medium">{dept}</span>
                      <span className="text-dash-text-mute font-semibold">{n}</span>
                    </div>
                    <div className="h-1.5 bg-dash-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-brand-teal to-brand-sky"
                        style={{ width: `${(n / maxDept) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </DashCard>
          {/* )} */}
{/* 
          <DashCard className="bg-gradient-to-br from-teal-50/60 to-sky-50/60">
            <div className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0">
                <Siren size={20} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-dash-text mb-1">Emergency Standby</h3>
                <p className="text-[12.5px] text-dash-text-dim leading-relaxed">
                  2 ambulances on standby · ER staffed with 3 doctors. No active emergencies.
                </p>
              </div>
            </div>
          </DashCard> */}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .ov-stats { grid-template-columns: 1fr 1fr !important; }
          .ov-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .ov-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
