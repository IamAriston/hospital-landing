"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { PatientForm } from "@/components/forms/patient-form";
import { useServerAction } from "@/hooks/use-server-action";
import {
  checkInAppointment,
  deleteAppointment,
  lookupPatientsByPhone,
  updateAppointment,
} from "@/lib/actions/appointments";
import {
  adminAppointmentUpdateSchema,
  type AdminAppointmentUpdateValues,
} from "@/lib/schemas/appointment";
import { cn, namesMatch } from "@/lib/utils";
import type { AppointmentWithRelations, PatientRow } from "@/types/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, UserCheck, UserPlus, Users, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

// "Confirmed" is intentionally not directly selectable: an appointment can only
// be confirmed through check-in, which verifies/links the patient record. It
// stays in the list (disabled) so an already-confirmed appointment still shows.
const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed (via check-in)", disabled: true },
  { value: "cancelled", label: "Cancelled" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentWithRelations | null;
  onDelete?: () => void;
}

export function AdminAppointmentPanel({ open, onClose, appointment, onDelete }: Props) {
  if (!open || !appointment) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-dash-surface border-l border-dash-border z-50 shadow-pop flex flex-col overflow-hidden text-dash-text">
        <AppointmentFormBody
          appointment={appointment}
          onClose={onClose}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}

function AppointmentFormBody({
  appointment,
  onClose,
  onDelete,
}: {
  appointment: AppointmentWithRelations;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const [checkInOpen, setCheckInOpen] = React.useState(false);
  const linked = !!appointment.patient_id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminAppointmentUpdateValues>({
    resolver: zodResolver(adminAppointmentUpdateSchema),
    defaultValues: {
      status: appointment.status,
      admin_notes: appointment.admin_notes ?? "",
    },
  });

  const updateAction = useServerAction(
    (input: unknown) => updateAppointment(appointment.id, input),
    {
      successMessage: "Appointment updated",
      onSuccess: onClose,
    },
  );

  const deleteAction = useServerAction(deleteAppointment, {
    successMessage: "Appointment deleted",
    onSuccess: () => {
      onDelete?.();
      onClose();
    },
  });

  return (
    <>
    <form
      onSubmit={handleSubmit((values) => updateAction.run(values))}
      className="flex flex-col h-full"
    >
      <header className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
        <div>
          <h2 className="text-lg font-bold text-dash-text font-display">
            {appointment.patient_name}
          </h2>
          <p className="text-xs text-dash-text-mute mt-0.5">
            {appointment.doctors?.name ?? "No doctor selected"} ·{" "}
            {appointment.departments?.name ?? "No department"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 text-dash-text-mute hover:text-dash-text rounded-md hover:bg-dash-surface-3"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Phone" value={appointment.patient_phone} />
          <Field label="Email" value={appointment.patient_email ?? "—"} />
          <Field
            label="Preferred date"
            value={appointment.preferred_date ?? "—"}
          />
          <Field label="Preferred time" value={appointment.time_slot ?? "—"} />
        </div>

        {appointment.message && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-dash-text-mute mb-1">
              Message
            </div>
            <p className="text-sm text-dash-text bg-dash-surface-3 border border-dash-border rounded-lg p-3 leading-relaxed">
              {appointment.message}
            </p>
          </div>
        )}

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-dash-text-mute mb-1.5">
            Patient record
          </div>
          <div
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-lg border",
              linked
                ? "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/40"
                : "bg-dash-surface-3 border-dash-border",
            )}
          >
            {linked ? (
              <UserCheck size={18} className="text-green-600 dark:text-green-400 shrink-0" />
            ) : (
              <UserPlus size={18} className="text-dash-text-mute shrink-0" />
            )}
            <div className="flex-1 min-w-0 text-sm">
              <div className="font-semibold text-dash-text">
                {linked ? "Linked to a patient record" : "Not registered yet"}
              </div>
              <div className="text-xs text-dash-text-mute mt-0.5">
                {linked
                  ? "Verify details on arrival, then confirm."
                  : "Check in on arrival to create the patient record."}
              </div>
            </div>
            {linked && (
              <Link
                href={`/dashboard/patients?patient=${appointment.patient_id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal hover:underline shrink-0"
              >
                View <ExternalLink size={12} />
              </Link>
            )}
          </div>
          <Button
            type="button"
            onClick={() => setCheckInOpen(true)}
            className="mt-2.5 w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {appointment.status === "confirmed"
              ? "Update patient record"
              : linked
                ? "Check in & confirm"
                : "Check in & register patient"}
          </Button>
        </div>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <FormSelect
              label="Status"
              options={STATUS_OPTIONS}
              value={field.value}
              onValueChange={(v) => field.onChange(v)}
              error={errors.status?.message}
            />
          )}
        />

        <FormTextarea
          label="Admin notes"
          rows={4}
          placeholder="Internal notes — call attempts, special instructions, etc."
          error={errors.admin_notes?.message}
          {...register("admin_notes")}
        />
      </div>

      <footer className="flex justify-between gap-2 px-6 py-4 border-t border-dash-border bg-dash-surface">
        <Button
          type="button"
          variant="outline"
          onClick={() => deleteAction.run(appointment.id)}
          disabled={deleteAction.pending || updateAction.pending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-dash-border bg-transparent"
        >
          {deleteAction.pending ? "Deleting…" : "Delete"}
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateAction.pending || deleteAction.pending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateAction.pending || deleteAction.pending}
            className={cn("bg-teal-600 hover:bg-teal-700 text-white")}
          >
            {updateAction.pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </footer>
    </form>

    {checkInOpen && (
      <CheckInPanel
        appointment={appointment}
        onClose={() => setCheckInOpen(false)}
        onDone={() => {
          setCheckInOpen(false);
          onClose();
        }}
      />
    )}
    </>
  );
}

/**
 * Slide-in check-in panel — the required verification step before an
 * appointment is confirmed. It loads every patient on the booking's phone
 * (a number can hold a whole family), then:
 *   • auto-selects the person the appointment is linked to, or whose name
 *     matches the booking;
 *   • if several people share the number and none auto-matches, asks staff to
 *     pick which family member (or add a new one);
 *   • saving verifies/creates that patient and confirms the appointment.
 */
export function CheckInPanel({
  appointment,
  onClose,
  onDone,
}: {
  appointment: AppointmentWithRelations;
  onClose: () => void;
  onDone: () => void;
}) {
  // undefined = still loading the family on this number.
  const [candidates, setCandidates] = React.useState<PatientRow[] | undefined>(
    undefined,
  );
  // undefined = staff must pick; null = new patient; PatientRow = verify them.
  const [selected, setSelected] = React.useState<PatientRow | null | undefined>(
    undefined,
  );
  // Guards the initial auto-selection so a late/duplicate lookup resolution (or
  // a StrictMode double-mount) can never clobber a choice the staff has made.
  const decidedRef = React.useRef(false);
  const decide = React.useCallback((v: PatientRow | null | undefined) => {
    decidedRef.current = true;
    setSelected(v);
  }, []);

  const lookup = useServerAction(lookupPatientsByPhone, {
    successMessage: false,
    onSuccess: (list) => {
      setCandidates(list);
      if (decidedRef.current) return; // staff already chose — don't override.
      const auto =
        list.find((p) => p.id === appointment.patient_id) ??
        list.find((p) => namesMatch(p.name, appointment.patient_name)) ??
        null;
      // auto → verify them; else force a pick when a family exists; else new.
      setSelected(auto ?? (list.length ? undefined : null));
    },
    onError: () => {
      setCandidates([]);
      if (!decidedRef.current) setSelected(null);
    },
  });

  React.useEffect(() => {
    lookup.run(appointment.patient_phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = candidates === undefined;
  const family = candidates ?? [];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-dash-surface border-l border-dash-border z-[61] shadow-pop flex flex-col overflow-hidden text-dash-text">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-dash-text-mute">
            Loading patient…
          </div>
        ) : selected === undefined ? (
          <CheckInPicker
            candidates={family}
            phone={appointment.patient_phone}
            onPick={(p) => decide(p)}
            onNew={() => decide(null)}
            onClose={onClose}
          />
        ) : (
          <PatientForm
            key={selected?.id ?? "new"}
            patient={selected}
            prefill={{
              name: appointment.patient_name,
              phone: appointment.patient_phone,
              email: appointment.patient_email,
            }}
            title={selected ? "Check in — verify details" : "Check in — new patient"}
            subtitle={
              selected
                ? "Confirm the details on file, update anything that changed, then confirm."
                : "Add the patient's details, then confirm the appointment."
            }
            banner={
              family.length > 0 ? (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800/50 dark:bg-sky-900/25 dark:text-sky-200">
                  <Users size={16} className="mt-0.5 shrink-0" />
                  <div className="text-[12.5px] leading-relaxed flex-1">
                    {selected
                      ? `Verifying ${selected.name}.`
                      : "Registering a new patient on this number."}
                    {family.filter((c) => c.id !== selected?.id).length > 0 && (
                      <>
                        {" "}
                        Others on this number:{" "}
                        {family
                          .filter((c) => c.id !== selected?.id)
                          .map((c) => c.name)
                          .join(", ")}
                        .
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => decide(undefined)}
                      className="ml-1 font-semibold underline hover:no-underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : null
            }
            submitLabel="Check in & confirm"
            submitPendingLabel="Confirming…"
            successMessage="Checked in & confirmed"
            overrideAction={(input) =>
              checkInAppointment(appointment.id, input, selected ? selected.id : null)
            }
            onClose={onClose}
            onSaved={onDone}
          />
        )}
      </div>
    </>
  );
}

/** Family picker shown when a number holds several patients and none auto-matched. */
function CheckInPicker({
  candidates,
  phone,
  onPick,
  onNew,
  onClose,
}: {
  candidates: PatientRow[];
  phone: string;
  onPick: (p: PatientRow) => void;
  onNew: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
        <div>
          <h2 className="text-lg font-bold text-dash-text font-display">
            Who is this appointment for?
          </h2>
          <p className="text-xs text-dash-text-mute mt-0.5">
            {candidates.length} patients are registered on {phone}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 text-dash-text-mute hover:text-dash-text rounded-md hover:bg-dash-surface-3"
        >
          <X size={18} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
        {candidates.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-dash-border bg-dash-surface hover:border-brand-teal hover:bg-brand-teal-50 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck size={16} className="text-dash-text-mute shrink-0" />
              <span className="font-semibold text-sm text-dash-text">{c.name}</span>
            </div>
            <span className="text-xs text-dash-text-mute">
              {[c.age != null ? `${c.age} yrs` : null, c.sex, c.guardian_name && `G: ${c.guardian_name}`]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={onNew}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-dash-border hover:border-brand-teal hover:bg-brand-teal-50 transition-colors text-left"
        >
          <UserPlus size={16} className="text-brand-teal shrink-0" />
          <span className="font-semibold text-sm text-brand-teal">
            New patient on this number
          </span>
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-dash-text-mute mb-1">
        {label}
      </div>
      <div className="text-sm text-dash-text">{value}</div>
    </div>
  );
}
