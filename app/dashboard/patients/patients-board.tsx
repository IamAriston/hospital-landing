"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  X,
  Phone,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { DashCard } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { DashAvatar } from "@/components/dashboard/ui/dash-avatar";
import { ActionBtn } from "@/components/dashboard/ui/action-btn";
import { RefreshButton } from "@/components/dashboard/ui/refresh-button";
import { FilterBar, ChipRow } from "@/components/dashboard/ui/filter-bar";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { TableSearch } from "@/components/dashboard/ui/table-search";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { useTableQuery } from "@/hooks/use-table-query";
import { PatientPanel } from "@/components/forms/patient-form";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { deletePatient } from "@/lib/actions/patients";
import { listPatientAppointments } from "@/lib/actions/appointments";
import { cn } from "@/lib/utils";
import type { AppointmentWithRelations, PatientRow } from "@/types/database";

const GENDER_CHIPS = [
  { value: "all", label: "All" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

function sexLabel(sex: PatientRow["sex"]) {
  return sex === "M" ? "Male" : sex === "F" ? "Female" : sex === "Other" ? "Other" : "—";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PatientDrawer({
  p,
  onClose,
  onEdit,
  onDelete,
}: {
  p: PatientRow;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DashCard noPad className="overflow-hidden sticky top-[88px] self-start">
      <div className="relative p-5 pb-4 bg-gradient-to-br from-brand-teal to-brand-teal-700 text-white">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors bg-white/15 border-none text-white"
        >
          <X size={15} />
        </button>
        <DashAvatar name={p.name} size={56} className="mb-3" />
        <h3 className="text-[19px] font-bold text-white">{p.name}</h3>
        <p className="text-[13px] mt-0.5 text-white/85">
          {p.age != null ? `${p.age} yrs · ` : ""}
          {sexLabel(p.sex)}
        </p>
        <div className="flex gap-2 mt-3.5">
          <a
            href={`tel:${p.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-80 bg-white/18 text-white"
          >
            <Phone size={14} /> Call
          </a>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-opacity hover:opacity-80 bg-white/18 text-white"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-opacity hover:opacity-80 bg-white/18 text-white"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Blood Group", value: p.blood_group ?? "—", mono: true },
            { label: "City", value: p.city ?? "—" },
            { label: "Phone", value: p.phone, mono: true },
            { label: "Email", value: p.email ?? "—" },
            { label: "Guardian", value: p.guardian_name ?? "—" },
            { label: "Insurance", value: p.insurance ?? "—" },
            { label: "Registered", value: formatDate(p.created_at) },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div className="text-[10.5px] text-dash-text-mute uppercase tracking-[.1em] font-bold">
                {label}
              </div>
              <div
                className={cn(
                  "text-[13.5px] text-dash-text mt-0.5 font-medium break-words",
                  mono && "font-mono",
                )}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {p.allergies && (
          <div className="flex gap-2 p-2.5 rounded-xl border mb-4 bg-amber-50 border-amber-200 text-amber-700">
            <div className="text-[12.5px]">
              <strong className="text-amber-800">Allergies:</strong> {p.allergies}
            </div>
          </div>
        )}

        {p.notes && (
          <>
            <h4 className="text-[11.5px] uppercase tracking-[.1em] text-dash-text-mute font-bold mb-1.5">
              Clinical Notes
            </h4>
            <p className="text-[13px] text-dash-text-dim leading-relaxed">{p.notes}</p>
          </>
        )}

        {/* keyed by patient id so it remounts (and reloads) per selection */}
        <AppointmentHistory key={p.id} patientId={p.id} />
      </div>
    </DashCard>
  );
}

function AppointmentLine({ a }: { a: AppointmentWithRelations }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-dash-surface-3 border border-dash-border">
      <div className="font-mono text-[12.5px] font-bold text-dash-text w-[52px] shrink-0">
        {a.preferred_date ? formatDate(a.preferred_date).replace(/ \d{4}$/, "") : "—"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] text-dash-text truncate">
          {a.doctors?.name ?? "Any doctor"}
          {a.departments?.name ? ` · ${a.departments.name}` : ""}
        </div>
      </div>
      <StatusBadge status={a.status} small />
    </div>
  );
}

function AppointmentHistory({ patientId }: { patientId: string }) {
  const [rows, setRows] = React.useState<AppointmentWithRelations[] | null>(null);
  const { run, pending } = useServerAction(listPatientAppointments, {
    successMessage: false,
    onSuccess: (data) => setRows(data),
  });

  React.useEffect(() => {
    run(patientId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const hasRows = rows && rows.length > 0;

  return (
    <div className="mt-4 pt-4 border-t border-dash-border">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11.5px] uppercase tracking-[.1em] text-dash-text-mute font-bold">
          Last Appointment
        </h4>
        {hasRows && (
          <Link
            href={`/dashboard/appointments?patient=${patientId}`}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand-teal hover:underline"
          >
            View all
            {rows!.length > 1 ? ` (${rows!.length})` : ""}
            <ChevronRight size={13} />
          </Link>
        )}
      </div>
      {pending && rows === null ? (
        <p className="text-[12.5px] text-dash-text-mute">Loading…</p>
      ) : hasRows ? (
        <AppointmentLine a={rows![0]} />
      ) : (
        <p className="text-[12.5px] text-dash-text-mute">No appointments on record.</p>
      )}
    </div>
  );
}

interface PatientsBoardProps {
  patients: PatientRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  sex: string;
  initialSelected: PatientRow | null;
}

export function PatientsBoard({
  patients,
  total,
  page,
  pageSize,
  sex,
  initialSelected,
}: PatientsBoardProps) {
  const { get, setParams } = useTableQuery();
  const [selected, setSelected] = React.useState<PatientRow | null>(initialSelected);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PatientRow | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<PatientRow | null>(null);

  // ?action=new opens the register panel (e.g. from command search).
  React.useEffect(() => {
    if (get("action") === "new") {
      setEditing(null);
      setPanelOpen(true);
    }
  }, [get]);

  const deleteAction = useServerAction(deletePatient, {
    successMessage: "Patient deleted",
    onSuccess: () => {
      setConfirmDelete(null);
      closeDrawer();
    },
  });

  function openCreate() {
    setEditing(null);
    setPanelOpen(true);
  }

  function openEdit(p: PatientRow) {
    setEditing(p);
    setPanelOpen(true);
  }

  function closeDrawer() {
    setSelected(null);
    if (get("patient")) setParams({ patient: null }, { resetPage: false });
  }

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Patient Records"
        subtitle={`${total} patient${total !== 1 ? "s" : ""} · search by name, phone, city or email`}
        actions={
          <>
            <RefreshButton />
            <ActionBtn
              variant="primary"
              icon={<Plus size={15} strokeWidth={2.4} />}
              onClick={openCreate}
            >
              Register Patient
            </ActionBtn>
          </>
        }
      />

      <FilterBar>
        <TableSearch placeholder="Search name, phone, city, email…" />
        <ChipRow
          options={GENDER_CHIPS}
          value={sex}
          onChange={(v) => setParams({ sex: v === "all" ? null : v })}
        />
      </FilterBar>

      <div className={cn("grid gap-[18px]", selected ? "grid-cols-[1fr_360px]" : "grid-cols-1")}>
        <DashCard noPad className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Name", "Age / Sex", "Phone", "City", "Blood", "Insurance", "Registered", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-[18px] py-3.5 text-[11px] font-bold text-dash-text-mute uppercase tracking-[.08em] border-b border-dash-border bg-dash-surface whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr
                  key={p.id}
                  className={cn(
                    "dash-table-row cursor-pointer transition-colors",
                    selected?.id === p.id ? "bg-dash-surface-3" : "hover:bg-dash-surface-3",
                  )}
                  onClick={() => setSelected(p)}
                >
                  <td className="px-[18px] py-3.5 border-b border-dash-border">
                    <div className="flex items-center gap-2.5">
                      <DashAvatar name={p.name} size={32} />
                      <span className="font-semibold text-[13.5px] text-dash-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13.5px] text-dash-text">
                    {p.age != null ? `${p.age} · ` : ""}
                    {sexLabel(p.sex)}
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border font-mono text-[13px] text-dash-text">
                    {p.phone}
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13.5px] text-dash-text">
                    {p.city ?? "—"}
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border">
                    {p.blood_group ? (
                      <span className="inline-flex items-center bg-red-50 text-red-800 border border-red-200 font-mono font-bold px-2 py-[2px] rounded-full text-[11.5px]">
                        {p.blood_group}
                      </span>
                    ) : (
                      <span className="text-dash-text-mute text-[13px]">—</span>
                    )}
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13px] text-dash-text-dim">
                    {p.insurance ?? "—"}
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13px] text-dash-text-dim">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border">
                    <ChevronRight size={15} className="text-dash-text-mute" />
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-dash-text-mute text-sm"
                  >
                    {total === 0
                      ? "No patients found. Click Register Patient to add one."
                      : "No patients match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashCard>

        {selected && (
          <PatientDrawer
            p={selected}
            onClose={closeDrawer}
            onEdit={() => openEdit(selected)}
            onDelete={() => setConfirmDelete(selected)}
          />
        )}
      </div>

      <Pagination page={page} pageSize={pageSize} total={total} />

      <PatientPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        patient={editing}
        onSaved={(saved) => setSelected(saved)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (confirmDelete) await deleteAction.run(confirmDelete.id);
        }}
        title="Delete this patient?"
        description={
          confirmDelete
            ? `${confirmDelete.name}'s record will be permanently removed. This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete patient"
        pending={deleteAction.pending}
      />
    </div>
  );
}
