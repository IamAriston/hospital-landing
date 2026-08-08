"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
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
import { PatientPanel } from "@/components/forms/patient-form";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { deletePatient } from "@/lib/actions/patients";
import { cn } from "@/lib/utils";
import type { PatientRow } from "@/types/database";

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
      </div>
    </DashCard>
  );
}

export function PatientsBoard({ patients }: { patients: PatientRow[] }) {
  const [selected, setSelected] = React.useState<PatientRow | null>(null);
  const [search, setSearch] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState("all");
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PatientRow | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<PatientRow | null>(null);

  // Deep-link support: ?q= prefills search, ?action=new opens the register panel.
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
    if (searchParams.get("action") === "new") {
      setEditing(null);
      setPanelOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const term = search.toLowerCase();
  const filtered = patients.filter((p) => {
    if (genderFilter !== "all" && p.sex !== genderFilter) return false;
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      (p.city ?? "").toLowerCase().includes(term) ||
      (p.email ?? "").toLowerCase().includes(term)
    );
  });

  const deleteAction = useServerAction(deletePatient, {
    successMessage: "Patient deleted",
    onSuccess: () => {
      setConfirmDelete(null);
      setSelected(null);
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

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Patient Records"
        subtitle={`${filtered.length} of ${patients.length} patients · search by name, phone, city or email`}
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
        <div className="relative flex-1 min-w-[240px] max-w-[480px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-text-mute pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, city, email…"
            className="w-full pl-9 pr-3.5 py-2 border border-dash-border rounded-xl bg-dash-surface text-[14px] text-dash-text placeholder:text-dash-text-mute outline-none focus:border-brand-teal transition-all"
          />
        </div>
        <ChipRow options={GENDER_CHIPS} value={genderFilter} onChange={setGenderFilter} />
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
              {filtered.map((p) => (
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-dash-text-mute text-sm"
                  >
                    {patients.length === 0
                      ? "No patients yet. Click Register Patient to add the first one."
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
            onClose={() => setSelected(null)}
            onEdit={() => openEdit(selected)}
            onDelete={() => setConfirmDelete(selected)}
          />
        )}
      </div>

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
