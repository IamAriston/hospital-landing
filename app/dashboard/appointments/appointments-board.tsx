"use client";

import * as React from "react";
import { format } from "date-fns";
import { Download, Plus, Calendar } from "lucide-react";
import { DashCard } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { DashAvatar } from "@/components/dashboard/ui/dash-avatar";
import { ActionBtn } from "@/components/dashboard/ui/action-btn";
import { MiniStatCard, type StatColor } from "@/components/dashboard/ui/mini-stat-card";
import { FilterBar, ChipRow, DashSelect, ClearBtn } from "@/components/dashboard/ui/filter-bar";
import { AdminAppointmentPanel } from "@/components/forms/admin-appointment-form";
import { WalkInAppointmentPanel } from "@/components/forms/walk-in-appointment-form";
import { useResourceTable } from "@/hooks/use-resource-table";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
  DepartmentRow,
  DoctorRow,
} from "@/types/database";

interface Props {
  appointments: AppointmentWithRelations[];
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

const MINI_STATS: { label: string; color: StatColor; key: keyof Counts }[] = [
  { label: "New", color: "amber", key: "new" },
  { label: "Confirmed", color: "green", key: "confirmed" },
  { label: "Today", color: "teal", key: "today" },
  { label: "Total", color: "sky", key: "total" },
];

type Counts = { new: number; confirmed: number; today: number; total: number };

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

export function AppointmentsBoard({ appointments, departments, doctors }: Props) {
  const [selected, setSelected] = React.useState<AppointmentWithRelations | null>(null);
  const [walkInOpen, setWalkInOpen] = React.useState(false);

  const deptOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  const {
    search,
    setSearch,
    filters,
    setFilter,
    setFilters,
    filtered,
  } = useResourceTable<AppointmentWithRelations>({
    rows: appointments,
    searchKeys: ["patient_name", "patient_phone"],
    filterFn: (row, f) => {
      const date = f.date as string | undefined;
      if (date && date !== "all") {
        const bucket = dateBucket(row.preferred_date);
        if (date === "today" && bucket !== "today") return false;
        if (date === "tomorrow" && bucket !== "tomorrow") return false;
        if (date === "week" && !["today", "tomorrow", "week"].includes(bucket)) return false;
      }
      const status = f.status as string | undefined;
      if (status && status !== "all" && row.status !== (status as AppointmentStatus)) return false;
      const department = f.department as string | undefined;
      if (department && department !== "all" && row.department_id !== department) return false;
      return true;
    },
    pageSize: 100,
  });

  // initialize the default date filter on first render
  const initialized = React.useRef(false);
  if (!initialized.current && filters.date === undefined) {
    initialized.current = true;
    setFilters({ date: "today" });
  }

  const counts: Counts = React.useMemo(() => {
    const today = appointments.filter((a) => dateBucket(a.preferred_date) === "today");
    return {
      new: appointments.filter((a) => a.status === "new").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      today: today.length,
      total: appointments.length,
    };
  }, [appointments]);

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Appointments"
        subtitle={`${filtered.length} appointment${filtered.length !== 1 ? "s" : ""}`}
        actions={
          <>
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
            value={counts[s.key]}
            color={s.color}
            live={s.key === "today"}
          />
        ))}
      </div>

      <FilterBar>
        <ChipRow
          options={DATE_CHIPS}
          value={(filters.date as string) ?? "today"}
          onChange={(v) => setFilter("date", v)}
        />
        <div className="w-px h-6 bg-dash-border" />
        <DashSelect
          value={(filters.status as string) ?? "all"}
          onChange={(e) =>
            setFilter("status", e.target.value === "all" ? null : e.target.value)
          }
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
        />
        <DashSelect
          value={(filters.department as string) ?? "all"}
          onChange={(e) =>
            setFilter("department", e.target.value === "all" ? null : e.target.value)
          }
          options={deptOptions}
          placeholder="All Departments"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient…"
          className="px-3 py-[7px] rounded-lg border border-dash-border bg-dash-surface text-[13px] text-dash-text placeholder:text-dash-text-mute outline-none focus:border-brand-teal min-w-[180px] transition-all"
        />
        <ClearBtn
          onClick={() => {
            setFilter("date", "today");
            setFilter("status", null);
            setFilter("department", null);
            setSearch("");
          }}
        />
      </FilterBar>

      {filtered.length === 0 ? (
        <DashCard className="py-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-dash-surface-3 flex items-center justify-center text-dash-text-mute">
            <Calendar size={26} strokeWidth={1.6} />
          </div>
          <h3 className="text-base font-bold text-dash-text">
            {appointments.length === 0
              ? "No appointments yet"
              : "No appointments match your filters"}
          </h3>
          <p className="text-[13.5px] text-dash-text-mute mt-1.5">
            {appointments.length === 0
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
              {filtered.map((a) => {
                const bucket = dateBucket(a.preferred_date);
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className="dash-table-row transition-colors cursor-pointer hover:bg-dash-surface-3"
                  >
                    <td className="px-[18px] py-3.5 border-b border-dash-border">
                      <div className="font-mono font-bold text-[13.5px] text-dash-text">
                        {a.preferred_date
                          ? format(new Date(a.preferred_date), "dd MMM")
                          : "—"}
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
