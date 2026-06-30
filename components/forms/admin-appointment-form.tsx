"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Button } from "@/components/ui/button";
import {
  adminAppointmentUpdateSchema,
  type AdminAppointmentUpdateValues,
} from "@/lib/schemas/appointment";
import { useServerAction } from "@/hooks/use-server-action";
import { updateAppointment, deleteAppointment } from "@/lib/actions/appointments";
import { cn } from "@/lib/utils";
import type { AppointmentWithRelations } from "@/types/database";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
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
