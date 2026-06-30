"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useServerAction } from "@/hooks/use-server-action";
import {
  createWalkInAppointment,
  lookupPatientByPhone,
} from "@/lib/actions/appointments";
import {
  walkInAppointmentSchema,
  type WalkInAppointmentValues,
} from "@/lib/schemas/appointment";
import { cn } from "@/lib/utils";
import type { DepartmentRow, DoctorRow, PatientRow } from "@/types/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, UserCheck, X } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

const TIME_SLOTS = [
  { value: "Morning", label: "Morning (8 AM – 12 PM)" },
  { value: "Afternoon", label: "Afternoon (12 PM – 5 PM)" },
  { value: "Evening", label: "Evening (5 PM – 8 PM)" },
];

const STATUS_OPTIONS = [
  { value: "confirmed", label: "Confirmed (Walk-in)" },
  { value: "new", label: "New (Pending)" },
  { value: "contacted", label: "Contacted" },
  { value: "cancelled", label: "Cancelled" },
];

interface WalkInAppointmentFormProps {
  departments: DepartmentRow[];
  doctors: DoctorRow[];
  onClose: () => void;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function WalkInAppointmentForm({
  departments,
  doctors,
  onClose,
}: WalkInAppointmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WalkInAppointmentValues>({
    resolver: zodResolver(walkInAppointmentSchema),
    defaultValues: {
      patient_name: "",
      patient_phone: "",
      patient_email: "",
      department_id: null,
      doctor_id: null,
      preferred_date: todayISO(),
      time_slot: undefined,
      message: "",
      status: "confirmed",
      admin_notes: "",
      patient_id: null,
    },
  });

  const [matchedPatient, setMatchedPatient] = React.useState<PatientRow | null>(null);
  const phone = watch("patient_phone");
  const departmentId = watch("department_id");

  const lookupAction = useServerAction(lookupPatientByPhone, {
    successMessage: false,
    errorMessage: "Lookup failed",
    onSuccess: (data) => {
      if (data) {
        setMatchedPatient(data);
        setValue("patient_id", data.id, { shouldValidate: false });
        setValue("patient_name", data.name, { shouldValidate: true });
        if (data.email) setValue("patient_email", data.email);
      } else {
        setMatchedPatient(null);
        setValue("patient_id", null);
      }
    },
  });

  const submitAction = useServerAction(createWalkInAppointment, {
    successMessage: "Appointment booked",
    onSuccess: onClose,
  });

  const filteredDoctors = departmentId
    ? doctors.filter((d) => d.department_id === departmentId)
    : doctors;

  // Radix Select forbids empty-string item values — use a sentinel
  // and convert to null when reading/writing.
  const NONE = "__none__";
  const deptOptions = [
    { value: NONE, label: "No department" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];
  const doctorOptions = [
    { value: NONE, label: "Any available doctor" },
    ...filteredDoctors.map((d) => ({ value: d.id, label: d.name })),
  ];

  function clearMatch() {
    setMatchedPatient(null);
    setValue("patient_id", null);
  }

  return (
    <form
      onSubmit={handleSubmit((values) => submitAction.run(values))}
      className="flex flex-col h-full"
    >
      <header className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
        <div>
          <h2 className="text-lg font-bold text-dash-text font-display">
            New Appointment
          </h2>
          <p className="text-xs text-dash-text-mute mt-0.5">
            Register a walk-in or call-in patient
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
        <div>
          <div className="text-[13px] font-bold text-dash-text uppercase tracking-wider mb-3">
            Patient
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2 items-end mb-3">
            <FormInput
              label="Phone (+91)"
              placeholder="98765 11200"
              required
              error={errors.patient_phone?.message}
              {...register("patient_phone", {
                onChange: () => clearMatch(),
              })}
            />
            <button
              type="button"
              onClick={() => phone && lookupAction.run(phone)}
              disabled={!phone || lookupAction.pending}
              className="h-10 px-3 inline-flex items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50 text-teal-700 text-sm font-semibold hover:bg-teal-100 disabled:opacity-50 dark:border-teal-700/40 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
            >
              <Search size={14} />
              {lookupAction.pending ? "…" : "Find"}
            </button>
          </div>

          {matchedPatient && (
            <div className="mb-3 flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-md text-sm dark:bg-green-900/20 dark:border-green-800/40">
              <UserCheck size={16} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-green-900 dark:text-green-200">
                  Existing patient · {matchedPatient.name}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                  {[matchedPatient.age && `${matchedPatient.age} yrs`, matchedPatient.sex, matchedPatient.city]
                    .filter(Boolean)
                    .join(" · ") || "Linked to existing patient record"}
                </div>
              </div>
              <button
                type="button"
                onClick={clearMatch}
                className="text-xs text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-200 underline"
              >
                Clear
              </button>
            </div>
          )}

          <FormInput
            label="Full name"
            placeholder="Patient name"
            required
            error={errors.patient_name?.message}
            {...register("patient_name")}
          />

          <FormInput
            type="email"
            label="Email (optional)"
            placeholder="patient@example.com"
            containerClassName="mt-4"
            error={errors.patient_email?.message}
            {...register("patient_email")}
          />
        </div>

        <div className="pt-2 border-t border-dash-border">
          <div className="text-[13px] font-bold text-dash-text uppercase tracking-wider mb-3">
            Visit
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="department_id"
              render={({ field }) => (
                <FormSelect
                  label="Department"
                  placeholder="Choose department"
                  options={deptOptions}
                  value={field.value ?? NONE}
                  onValueChange={(v) => {
                    field.onChange(v === NONE ? null : v);
                    setValue("doctor_id", null);
                  }}
                  error={errors.department_id?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="doctor_id"
              render={({ field }) => (
                <FormSelect
                  label="Doctor"
                  placeholder="Any doctor"
                  options={doctorOptions}
                  value={field.value ?? NONE}
                  onValueChange={(v) => field.onChange(v === NONE ? null : v)}
                  error={errors.doctor_id?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <FormInput
              type="date"
              label="Date"
              required
              error={errors.preferred_date?.message}
              {...register("preferred_date")}
            />
            <Controller
              control={control}
              name="time_slot"
              render={({ field }) => (
                <FormSelect
                  label="Time slot"
                  placeholder="Pick a slot"
                  options={TIME_SLOTS}
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v || undefined)}
                  error={errors.time_slot?.message}
                />
              )}
            />
          </div>

          <FormTextarea
            label="Reason / message"
            rows={2}
            placeholder="Reason for visit, symptoms, etc."
            containerClassName="mt-4"
            {...register("message")}
          />
        </div>

        <div className="pt-2 border-t border-dash-border">
          <div className="text-[13px] font-bold text-dash-text uppercase tracking-wider mb-3">
            Admin
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
            label="Admin notes (optional)"
            rows={2}
            placeholder="Internal notes — visible only to staff."
            containerClassName="mt-4"
            {...register("admin_notes")}
          />
        </div>
      </div>

      <footer className="flex justify-end gap-2 px-6 py-4 border-t border-dash-border bg-dash-surface">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={submitAction.pending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitAction.pending}
          className={cn("bg-teal-600 hover:bg-teal-700 text-white")}
        >
          {submitAction.pending ? "Booking…" : "Book appointment"}
        </Button>
      </footer>
    </form>
  );
}

interface WalkInAppointmentPanelProps {
  open: boolean;
  onClose: () => void;
  departments: DepartmentRow[];
  doctors: DoctorRow[];
}

export function WalkInAppointmentPanel({
  open,
  onClose,
  departments,
  doctors,
}: WalkInAppointmentPanelProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[560px] bg-dash-surface border-l border-dash-border z-50 shadow-pop flex flex-col overflow-hidden text-dash-text">
        <WalkInAppointmentForm
          departments={departments}
          doctors={doctors}
          onClose={onClose}
        />
      </div>
    </>
  );
}
