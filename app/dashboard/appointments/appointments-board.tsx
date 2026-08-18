"use client";

import * as React from "react";
import { format } from "date-fns";
import { Download, Plus, Calendar } from "lucide-react";
import { DashCard } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { RefreshButton } from "@/components/dashboard/ui/refresh-button";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { DashAvatar } from "@/components/dashboard/ui/dash-avatar";
import { ActionBtn } from "@/components/dashboard/ui/action-btn";
import { MiniStatCard, type StatColor } from "@/components/dashboard/ui/mini-stat-card";
import { FilterBar, ChipRow, DashSelect, ClearBtn } from "@/components/dashboard/ui/filter-bar";
import { TableSearch } from "@/components/dashboard/ui/table-search";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { useTableQuery } from "@/hooks/use-table-query";
import { AdminAppointmentPanel } from "@/components/forms/admin-appointment-form";
import { WalkInAppointmentPanel } from "@/components/forms/walk-in-appointment-form";
import type {
  AppointmentWithRelations,
  DepartmentRow,
  DoctorRow,
} from "@/types/database";

type Stats = { total: number; new: number; confirmed: number; cancelled: number; today: number };

interface Props {
  appointments: AppointmentWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  date: string;
  status: string;
  department: string;
  patientId?: string;
  stats: Stats;
  departments: DepartmentRow[];
  doctors: DoctorRow[];
}

const DATE_CHIPS = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
  { value: "all", label: "All" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const MINI_STATS: { label: string; color: StatColor; key: keyof Stats }[] = [
  { label: "New", color: "amber", key: "new" },
  { label: "Confirmed", color: "green", key: "confirmed" },
  { label: "Today", color: "teal", key: "today" },
  { label: "Total", color: "sky", key: "total" },
];

function dateBucket(iso: string | null): "today" | "tomorrow" | "week" | "past" | "later" {
  if (!iso) return "later";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff > 0 && diff <= 7) return "week";
  if (diff < 0) return "past";
  return "later";
}

export function AppointmentsBoard({
  appointments,
  total,
  page,
  pageSize,
  date,
  status,
  department,
  patientId,
  stats,
  departments,
  doctors,
}: Props) {
  const { get, setParams } = useTableQuery();
  const [selected, setSelected] = React.useState<AppointmentWithRelations | null>(null);
  const [walkInOpen, setWalkInOpen] = React.useState(false);

  // ?action=new opens the walk-in panel (e.g. from command search).
  React.useEffect(() => {
    if (get("action") === "new") setWalkInOpen(true);
  }, [get]);

  const deptOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  const patientName = patientId ? appointments[0]?.patient_name ?? null : null;

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Appointments"
        subtitle={`${total} appointment${total !== 1 ? "s" : ""}`}
        actions={
          <>
            <RefreshButton />
            <ActionBtn variant="secondary" icon={<Download size={15} />}>
              Export
            </ActionBtn>
            <ActionBtn
              variant="primary"
              icon={<Plus size={15} strokeWidth={2.4} />}
              onClick={() => setWalkInOpen(true)}
            >
              New Appointment
            </ActionBtn>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3.5 mb-5 apt-mini">
        {MINI_STATS.map((s) => (
          <MiniStatCard
            key={s.label}
            label={s.label}
            value={stats[s.key]}
            color={s.color}
            live={s.key === "today"}
          />
        ))}
      </div>

      <FilterBar>
        <ChipRow
          options={DATE_CHIPS}
          value={date}
          onChange={(v) => setParams({ date: v })}
        />
        <div className="w-px h-6 bg-dash-border" />
        <DashSelect
          value={status}
          onValueChange={(v) => setParams({ status: v === "all" ? null : v })}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
        />
        <DashSelect
          value={department}
          onValueChange={(v) => setParams({ department: v === "all" ? null : v })}
          options={deptOptions}
          placeholder="All Departments"
        />
        <TableSearch placeholder="Search patient…" className="min-w-[180px]" />
        <ClearBtn
          show={["date", "status", "department", "q", "patient"].some((k) => get(k))}
          onClick={() =>
            setParams({ date: null, status: null, department: null, q: null, patient: null })
          }
        />
      </FilterBar>

      {patientId && (
        <div className="flex items-center justify-between gap-3 mb-4 px-3.5 py-2.5 rounded-xl border border-brand-teal/30 bg-brand-teal-50 text-brand-teal">
          <div className="text-[13px] font-semibold">
            Showing appointments for {patientName ?? "this patient"}
          </div>
          <button
            type="button"
            onClick={() => setParams({ patient: null })}
            className="text-[12.5px] font-semibold underline hover:no-underline"
          >
            Clear
          </button>
        </div>
      )}

      {appointments.length === 0 ? (
        <DashCard className="py-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-dash-surface-3 flex items-center justify-center text-dash-text-mute">
            <Calendar size={26} strokeWidth={1.6} />
          </div>
          <h3 className="text-base font-bold text-dash-text">
            {total === 0 ? "No appointments yet" : "No appointments match your filters"}
          </h3>
          <p className="text-[13.5px] text-dash-text-mute mt-1.5">
            {total === 0
              ? "Appointments submitted via the booking form on the landing page will appear here."
              : "Try a different date range or clear filters."}
          </p>
        </DashCard>
      ) : (
        <DashCard noPad className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Date", "Patient", "Doctor / Dept", "Slot", "Message", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-[18px] py-3.5 text-[11px] font-bold text-dash-text-mute uppercase tracking-[.08em] border-b border-dash-border bg-dash-surface whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const bucket = dateBucket(a.preferred_date);
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className="dash-table-row transition-colors cursor-pointer hover:bg-dash-surface-3"
                  >
                    <td className="px-[18px] py-3.5 border-b border-dash-border">
                      <div className="font-mono font-bold text-[13.5px] text-dash-text">
                        {a.preferred_date ? format(new Date(a.preferred_date), "dd MMM") : "—"}
                      </div>
                      <div className="text-[11.5px] text-dash-text-mute capitalize">
                        {bucket === "today"
                          ? "Today"
                          : bucket === "tomorrow"
                          ? "Tomorrow"
                          : bucket === "week"
                          ? "This week"
                          : bucket === "past"
                          ? "Past"
                          : "Later"}
                      </div>
                    </td>
                    <td className="px-[18px] py-3.5 border-b border-dash-border">
                      <div className="flex items-center gap-2.5">
                        <DashAvatar name={a.patient_name} size={32} />
                        <div>
                          <div className="font-semibold text-[13.5px] text-dash-text">
                            {a.patient_name}
                          </div>
                          <div className="text-[11.5px] text-dash-text-mute">
                            {a.patient_phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-[18px] py-3.5 border-b border-dash-border">
                      <div className="font-medium text-[13.5px] text-dash-text">
                        {a.doctors?.name ?? "Any doctor"}
                      </div>
                      <div className="text-[12px] text-dash-text-mute">
                        {a.departments?.name ?? "—"}
                      </div>
                    </td>
                    <td className="px-[18px] py-3.5 border-b border-dash-border">
                      <div className="text-[13px] text-dash-text">{a.time_slot ?? "—"}</div>
                    </td>
                    <td className="px-[18px] py-3.5 border-b border-dash-border max-w-[220px]">
                      <div className="text-[13px] text-dash-text truncate">{a.message ?? "—"}</div>
                    </td>
                    <td className="px-[18px] py-3.5 border-b border-dash-border">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-[18px] py-3.5 border-b border-dash-border text-right whitespace-nowrap">
                      <span className="text-xs text-slate-400">Open ›</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DashCard>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} />

      <AdminAppointmentPanel
        open={!!selected}
        onClose={() => setSelected(null)}
        appointment={selected}
      />

      <WalkInAppointmentPanel
        open={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        departments={departments}
        doctors={doctors}
      />

      <style>{`@media (max-width: 900px) { .apt-mini { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </div>
  );
}
