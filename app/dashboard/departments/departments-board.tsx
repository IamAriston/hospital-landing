"use client";

import * as React from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { DashCard } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { ActionBtn } from "@/components/dashboard/ui/action-btn";
import { MiniStatCard } from "@/components/dashboard/ui/mini-stat-card";
import { FilterBar, ChipRow, ClearBtn } from "@/components/dashboard/ui/filter-bar";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DepartmentPanel } from "@/components/forms/department-panel";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useResourceTable } from "@/hooks/use-resource-table";
import { useServerAction } from "@/hooks/use-server-action";
import { deleteDepartment } from "@/lib/actions/departments";
import { cn } from "@/lib/utils";
import type { DepartmentWithDetails } from "@/types/database";

interface Props {
  departments: DepartmentWithDetails[];
}

const STATUS_CHIPS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function DepartmentsBoard({ departments }: Props) {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DepartmentWithDetails | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<DepartmentWithDetails | null>(null);

  const {
    search,
    setSearch,
    filters,
    setFilter,
    filtered,
  } = useResourceTable<DepartmentWithDetails>({
    rows: departments,
    searchKeys: ["name", "slug"],
    filterFn: (row, f) => {
      if (f.status === "active" && !row.is_active) return false;
      if (f.status === "inactive" && row.is_active) return false;
      return true;
    },
    pageSize: 100,
  });

  const counts = {
    total: departments.length,
    active: departments.filter((d) => d.is_active).length,
    inactive: departments.filter((d) => !d.is_active).length,
  };

  const deleteAction = useServerAction(deleteDepartment, {
    successMessage: "Department deleted",
    onSuccess: () => setConfirmDelete(null),
  });

  function openCreate() {
    setEditing(null);
    setPanelOpen(true);
  }
  function openEdit(d: DepartmentWithDetails) {
    setEditing(d);
    setPanelOpen(true);
  }

  const columns: ColumnDef<DepartmentWithDetails>[] = [
    {
      key: "name",
      header: "Department",
      sortKey: (r) => r.name,
      cell: (r) => (
        <div>
          <div className="font-semibold text-dash-text">{r.name}</div>
          <div className="text-xs text-slate-400">/{r.slug}</div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      className: "max-w-xs",
      cell: (r) => (
        <span className="text-slate-600 line-clamp-2">{r.description || "—"}</span>
      ),
    },
    {
      key: "details",
      header: "Detail page",
      cell: (r) => {
        const det = r.department_details;
        if (!det) return <span className="text-xs text-slate-400">No details</span>;
        const parts = [
          det.conditions.length && `${det.conditions.length} conditions`,
          det.procedures.length && `${det.procedures.length} procedures`,
          det.equipment.length && `${det.equipment.length} equipment`,
        ].filter(Boolean);
        return (
          <span className="text-xs text-slate-500">
            {parts.length ? parts.join(" · ") : "Empty"}
          </span>
        );
      },
    },
    {
      key: "is_active",
      header: "Status",
      sortKey: (r) => (r.is_active ? 1 : 0),
      cell: (r) => (
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
            r.is_active
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-slate-100 text-slate-500 border border-slate-200",
          )}
        >
          {r.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "display_order",
      header: "Order",
      sortKey: (r) => r.display_order,
      className: "w-20",
    },
    {
      key: "actions",
      header: "",
      className: "w-32 text-right",
      cell: (r) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(r);
            }}
            aria-label="Edit"
            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-md"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(r);
            }}
            aria-label="Delete"
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Departments"
        subtitle={`${counts.total} departments configured`}
        actions={
          <ActionBtn
            variant="primary"
            icon={<Plus size={15} strokeWidth={2.4} />}
            onClick={openCreate}
          >
            Add Department
          </ActionBtn>
        }
      />

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <MiniStatCard label="Total" value={counts.total} color="teal" />
        <MiniStatCard label="Active" value={counts.active} color="sky" live />
        <MiniStatCard label="Inactive" value={counts.inactive} color="muted" />
      </div>

      <FilterBar>
        <ChipRow
          options={STATUS_CHIPS}
          value={(filters.status as string) ?? "all"}
          onChange={(v) => setFilter("status", v === "all" ? null : v)}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search departments…"
          className="px-3 py-[7px] rounded-lg border border-dash-border bg-dash-surface text-[13px] text-dash-text placeholder:text-dash-text-mute outline-none focus:border-brand-teal min-w-[180px] transition-all"
        />
        <ClearBtn
          onClick={() => {
            setFilter("status", null);
            setSearch("");
          }}
        />
      </FilterBar>

      <DashCard noPad>
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(r) => r.id}
          onRowClick={openEdit}
          empty={
            departments.length === 0
              ? "No departments yet. Click Add Department to create the first one."
              : "No departments match the current filters."
          }
        />
      </DashCard>

      <DepartmentPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        department={editing}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await deleteAction.run(confirmDelete.id);
        }}
        title="Delete this department?"
        description={
          confirmDelete
            ? `${confirmDelete.name} and its detail content will be removed. Doctors in this department will have no department assigned.`
            : undefined
        }
        confirmLabel="Delete department"
        pending={deleteAction.pending}
      />
    </div>
  );
}
