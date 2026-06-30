"use client";

import * as React from "react";
import { Plus, Printer, MoreVertical, Calendar, Star, Edit2, Trash2 } from "lucide-react";
import { DashCard } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { DashAvatar } from "@/components/dashboard/ui/dash-avatar";
import { ActionBtn } from "@/components/dashboard/ui/action-btn";
import { MiniStatCard } from "@/components/dashboard/ui/mini-stat-card";
import { FilterBar, ChipRow, DashSelect, ClearBtn } from "@/components/dashboard/ui/filter-bar";
import { DoctorPanel } from "@/components/forms/doctor-panel";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useResourceTable } from "@/hooks/use-resource-table";
import { useServerAction } from "@/hooks/use-server-action";
import { deleteDoctor } from "@/lib/actions/doctors";
import { formatOpd } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import type { DepartmentRow, DoctorWithDepartment } from "@/types/database";

interface DoctorsBoardProps {
  doctors: DoctorWithDepartment[];
  departments: DepartmentRow[];
}

const STATUS_CHIPS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "featured", label: "Featured" },
];

export function DoctorsBoard({ doctors, departments }: DoctorsBoardProps) {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DoctorWithDepartment | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<DoctorWithDepartment | null>(null);

  const {
    search,
    setSearch,
    filters,
    setFilter,
    paged,
    filtered,
  } = useResourceTable<DoctorWithDepartment>({
    rows: doctors,
    searchKeys: ["name", "specialty"],
    filterFn: (row, f) => {
      if (f.status === "active" && !row.is_active) return false;
      if (f.status === "inactive" && row.is_active) return false;
      if (f.status === "featured" && !row.is_featured) return false;
      if (f.department && row.department_id !== f.department) return false;
      return true;
    },
    pageSize: 50,
  });

  const counts = {
    total: doctors.length,
    active: doctors.filter((d) => d.is_active).length,
    inactive: doctors.filter((d) => !d.is_active).length,
    featured: doctors.filter((d) => d.is_featured).length,
  };

  const deleteAction = useServerAction(deleteDoctor, {
    successMessage: "Doctor deleted",
    onSuccess: () => setConfirmDelete(null),
  });

  function openCreate() {
    setEditing(null);
    setPanelOpen(true);
  }

  function openEdit(doctor: DoctorWithDepartment) {
    setEditing(doctor);
    setPanelOpen(true);
  }

  const deptOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Doctor Roster"
        subtitle={`${filtered.length} of ${counts.total} doctors`}
        actions={
          <>
            <ActionBtn variant="secondary" icon={<Printer size={15} />}>
              Roster Sheet
            </ActionBtn>
            <ActionBtn
              variant="primary"
              icon={<Plus size={15} strokeWidth={2.4} />}
              onClick={openCreate}
            >
              Add Doctor
            </ActionBtn>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3.5 mb-5 dr-mini">
        <MiniStatCard label="Total Staff" value={counts.total} color="teal" />
        <MiniStatCard label="Active" value={counts.active} color="sky" live />
        <MiniStatCard label="Featured" value={counts.featured} color="amber" />
        <MiniStatCard label="Inactive" value={counts.inactive} color="muted" />
      </div>

      <FilterBar>
        <ChipRow
          options={STATUS_CHIPS}
          value={(filters.status as string) ?? "all"}
          onChange={(v) => setFilter("status", v === "all" ? null : v)}
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
          placeholder="Search doctors…"
          className="px-3 py-[7px] rounded-lg border border-dash-border bg-dash-surface text-[13px] text-dash-text placeholder:text-dash-text-mute outline-none focus:border-brand-teal min-w-[180px] transition-all"
        />
        <ClearBtn
          onClick={() => {
            setFilter("status", null);
            setFilter("department", null);
            setSearch("");
          }}
        />
      </FilterBar>

      {paged.length === 0 ? (
        <DashCard className="py-16 text-center text-dash-text-mute text-sm">
          {doctors.length === 0
            ? "No doctors yet. Click Add Doctor to create the first one."
            : "No doctors match the current filters."}
        </DashCard>
      ) : (
        <div className="grid gap-[18px] grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {paged.map((d) => (
            <DoctorCard
              key={d.id}
              d={d}
              onEdit={() => openEdit(d)}
              onDelete={() => setConfirmDelete(d)}
            />
          ))}
        </div>
      )}

      <DoctorPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        doctor={editing}
        departments={departments}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await deleteAction.run(confirmDelete.id);
        }}
        title="Delete this doctor?"
        description={
          confirmDelete
            ? `${confirmDelete.name} will be removed from the site immediately. This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete doctor"
        pending={deleteAction.pending}
      />

      <style>{`@media (max-width: 900px) { .dr-mini { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </div>
  );
}

function DoctorCard({
  d,
  onEdit,
  onDelete,
}: {
  d: DoctorWithDepartment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const deptName = d.departments?.name ?? "—";
  const scheduleLabel = d.schedule ? formatOpd(d.schedule) : "By appointment";
  return (
    <DashCard noPad className="overflow-hidden dash-card-hover group">
      <div className="p-5 pb-4 border-b border-dash-border flex gap-3.5">
        <DashAvatar name={d.name} size={54} charIndex={4} stripPrefix="Dr. " />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2 items-start">
            <h3 className="text-[15px] font-bold text-dash-text leading-snug truncate">
              {d.name}
            </h3>
            <span
              className={cn(
                "shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                d.is_active
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-slate-100 text-slate-500 border border-slate-200",
              )}
            >
              {d.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-[13px] font-semibold mt-0.5 text-brand-teal">{d.specialty}</p>
          <div className="flex items-center gap-2 mt-2 text-[11.5px] text-dash-text-mute flex-wrap">
            {/* <span className="flex items-center gap-1">
              <Star size={11} fill="#F59E0B" strokeWidth={0} className="text-[#F59E0B]" />
              {Number(d.rating).toFixed(1)}
            </span> */}
            <span>{d.years_experience} yrs exp</span>
            <span>·</span>
            <span className="truncate max-w-[120px]">{deptName}</span>
            {d.is_featured && (
              <>
                <span>·</span>
                <span className="text-amber-600 font-semibold">★ Featured</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5">
        <div className="text-[10.5px] text-dash-text-mute uppercase tracking-[.1em] font-bold">
          Schedule
        </div>
        <div className="text-[13px] text-dash-text mt-0.5 font-medium">{scheduleLabel}</div>
      </div>

      <div className="px-4 py-3 border-t border-dash-border bg-dash-surface-3 flex gap-1.5">
        <button
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-[7px] text-[12.5px] font-semibold border border-dash-border bg-dash-surface text-dash-text rounded-lg cursor-pointer hover:border-dash-border-strong transition-all"
        >
          <Edit2 size={13} /> Edit
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete doctor"
          className="px-2.5 py-[7px] border border-dash-border bg-dash-surface text-red-600 rounded-lg cursor-pointer flex items-center justify-center hover:border-red-200 hover:bg-red-50 transition-all"
        >
          <Trash2 size={14} />
        </button>
        <button
          aria-label="More"
          className="px-2.5 py-[7px] border border-dash-border bg-dash-surface text-dash-text-dim rounded-lg cursor-pointer flex items-center justify-center hover:border-dash-border-strong hover:text-dash-text transition-all"
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </DashCard>
  );
}
