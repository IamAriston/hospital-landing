"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useServerAction } from "@/hooks/use-server-action";
import { createPatient, updatePatient } from "@/lib/actions/patients";
import { cn } from "@/lib/utils";
import type { ActionResult, PatientRow } from "@/types/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import type { ReactNode } from "react";
import { z } from "zod";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const INSURANCE_OPTIONS = [
  "None",
  "CGHS",
  "ESIC",
  "Star Health",
  "HDFC Ergo",
  "ICICI Lombard",
  "New India Assurance",
  "Senior Citizen",
  "Other",
];

// Radix Select forbids empty-string values — use a sentinel for "unset".
const NONE = "__none__";

const uiSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-()]{8,15}$/, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  age: z
    .union([z.coerce.number().int().min(0, "Enter a valid age").max(130, "Enter a valid age"), z.literal("")])
    .refine((v) => v !== "", "Age is required"),
  sex: z
    .enum(["M", "F", "Other"])
    .nullable()
    .refine((v) => v !== null, "Select a gender"),
  city: z.string().trim().optional(),
  blood_group: z
    .enum(BLOOD_GROUPS)
    .nullable()
    .refine((v) => v !== null, "Select a blood group"),
  insurance: z.string().trim().optional(),
  allergies: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  guardian_name: z.string().trim().optional(),
});

type UiValues = z.input<typeof uiSchema>;

interface PatientFormProps {
  patient?: PatientRow | null;
  /** Seed values for a brand-new record (e.g. from a booking) when there is no patient row yet. */
  prefill?: { name?: string; phone?: string; email?: string | null };
  /** Header title override. */
  title?: string;
  /** Header subtitle override. */
  subtitle?: string;
  /** Submit button label override. */
  submitLabel?: string;
  /** Submit button label while pending. */
  submitPendingLabel?: string;
  /** Toast on success. */
  successMessage?: string;
  /** Optional banner rendered at the top of the form body (e.g. a warning). */
  banner?: ReactNode;
  /**
   * Replaces the default create/update action. Receives the normalised patient
   * payload; used by check-in to upsert + confirm in one step.
   */
  overrideAction?: (input: unknown) => Promise<ActionResult<PatientRow>>;
  onClose: () => void;
  onSaved?: (patient: PatientRow) => void;
}

export function PatientForm({
  patient,
  prefill,
  title,
  subtitle,
  submitLabel,
  submitPendingLabel,
  successMessage,
  banner,
  overrideAction,
  onClose,
  onSaved,
}: PatientFormProps) {
  const isEdit = !!patient;

  const defaults: UiValues = {
    name: patient?.name ?? prefill?.name ?? "",
    phone: patient?.phone ?? prefill?.phone ?? "",
    email: patient?.email ?? prefill?.email ?? "",
    age: patient?.age ?? "",
    sex: patient?.sex ?? null,
    city: patient?.city ?? "",
    blood_group: patient?.blood_group ?? null,
    insurance: patient?.insurance ?? "",
    allergies: patient?.allergies ?? "",
    notes: patient?.notes ?? "",
    guardian_name: patient?.guardian_name ?? "",
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UiValues>({
    resolver: zodResolver(uiSchema),
    defaultValues: defaults,
  });

  const action = useServerAction(
    overrideAction ??
      (isEdit ? (input: unknown) => updatePatient(patient!.id, input) : createPatient),
    {
      successMessage: successMessage ?? (isEdit ? "Patient updated" : "Patient registered"),
      onSuccess: (data) => {
        onSaved?.(data);
        onClose();
      },
    },
  );

  async function onSubmit(values: UiValues) {
    // Normalise empties/sentinels to what the server zod schema expects.
    const payload = {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      age: values.age === "" || values.age == null ? undefined : Number(values.age),
      sex: values.sex ?? undefined,
      city: values.city || undefined,
      blood_group: values.blood_group ?? undefined,
      insurance: values.insurance || undefined,
      allergies: values.allergies || undefined,
      notes: values.notes || undefined,
      guardian_name: values.guardian_name || undefined,
    };
    await action.run(payload);
  }

  const sex = watch("sex");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
        <div>
          <h2 className="text-lg font-bold text-dash-text font-display">
            {title ?? (isEdit ? "Edit Patient" : "Register New Patient")}
          </h2>
          <p className="text-xs text-dash-text-mute mt-0.5">
            {subtitle ??
              (isEdit
                ? "Update this patient record"
                : "Create a new patient record in the system")}
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
        {banner}
        <FormInput
          label="Full Name"
          required
          placeholder="As per ID proof"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Phone Number"
            type="tel"
            required
            placeholder="+91 98765 XXXXX"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <FormInput
            label="Email (optional)"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Age (years)"
            type="number"
            min={0}
            required
            placeholder="e.g. 34"
            error={errors.age?.message}
            {...register("age")}
          />
          <div>
            <p className="text-sm font-semibold text-dash-text mb-1.5">
              Gender <span className="text-destructive">*</span>
            </p>
            <div className="flex gap-2">
              {(["M", "F", "Other"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setValue("sex", g, { shouldValidate: true })}
                  className={cn(
                    "flex-1 text-center px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                    sex === g
                      ? "border-brand-teal bg-brand-teal-50 text-brand-teal"
                      : "border-dash-border bg-dash-surface text-dash-text-dim hover:border-dash-border-strong",
                  )}
                >
                  {g === "M" ? "Male" : g === "F" ? "Female" : "Other"}
                </button>
              ))}
            </div>
            {errors.sex?.message && (
              <p className="text-xs text-destructive mt-1.5">{errors.sex.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="blood_group"
            render={({ field }) => (
              <FormSelect
                label="Blood Group"
                required
                placeholder="Select blood group"
                value={field.value ?? NONE}
                onValueChange={(v) => field.onChange(v === NONE ? null : v)}
                options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))}
                error={errors.blood_group?.message}
              />
            )}
          />
          <FormInput
            label="City / Town"
            placeholder="e.g. Shimla"
            error={errors.city?.message}
            {...register("city")}
          />
        </div>

        <FormInput
          label="Guardian Name"
          placeholder="For minors — parent / guardian name (optional)"
          hint="Fill in when the contact number belongs to a parent or guardian"
          error={errors.guardian_name?.message}
          {...register("guardian_name")}
        />

        <FormInput
          label="Insurance / Payer"
          placeholder="e.g. CGHS, Star Health — or leave blank"
          error={errors.insurance?.message}
          {...register("insurance")}
        />

        <FormInput
          label="Known Allergies"
          placeholder="e.g. Penicillin, Aspirin — or leave blank"
          hint="Separate multiple allergies with commas"
          error={errors.allergies?.message}
          {...register("allergies")}
        />

        <FormTextarea
          label="Clinical Notes"
          placeholder="Any relevant medical history or special notes…"
          rows={3}
          {...register("notes")}
        />
      </div>

      <footer className="flex justify-end gap-3 px-6 py-4 border-t border-dash-border">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={action.pending}>
          {action.pending
            ? (submitPendingLabel ?? (isEdit ? "Saving…" : "Registering…"))
            : (submitLabel ?? (isEdit ? "Save changes" : "Register Patient"))}
        </Button>
      </footer>
    </form>
  );
}

/* ── Slide-in panel wrapper ─────────────────────────────────────────────── */
interface PatientPanelProps {
  open: boolean;
  onClose: () => void;
  patient?: PatientRow | null;
  onSaved?: (patient: PatientRow) => void;
}

export function PatientPanel({ open, onClose, patient, onSaved }: PatientPanelProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-dash-surface border-l border-dash-border z-50 shadow-pop flex flex-col overflow-hidden text-dash-text">
        <PatientForm patient={patient} onClose={onClose} onSaved={onSaved} />
      </div>
    </>
  );
}
