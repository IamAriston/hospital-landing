"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const INSURANCE_OPTIONS = [
  "None",
  "CGHS",
  "ESIC",
  "Star Health",
  "HDFC Ergo",
  "ICICI Lombard",
  "New India Assurance",
  "Senior Citizen",
  "Parents'",
  "Other",
];

const schema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.coerce.number({ message: "Enter a valid age" }).min(0).max(120),
  sex: z.enum(["M", "F", "Other"], { message: "Please select gender" }),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{8,15}$/, "Enter a valid phone number"),
  city: z.string().min(1, "City is required"),
  blood: z.string().min(1, "Please select blood group"),
  insurance: z.string().min(1, "Please select insurance / payer"),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface PatientFormProps {
  onSuccess?: (data: FormData) => void;
  onClose?: () => void;
}

export function PatientForm({ onSuccess, onClose }: PatientFormProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { sex: "M" },
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
    onSuccess?.(data);
    setTimeout(() => {
      onClose?.();
    }, 1200);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0D9488"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[15px] font-semibold text-dash-text">
          Patient registered!
        </p>
        <p className="text-sm text-dash-text-mute">
          The patient record has been created successfully.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Name + Age/Sex row */}
      <FormInput
        label="Full Name"
        required
        placeholder="As per ID proof"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Age (years)"
          type="number"
          required
          placeholder="e.g. 34"
          error={errors.age?.message}
          {...register("age")}
        />
        <div>
          <p className="text-sm font-semibold text-dash-text mb-1.5">
            Gender <span className="text-red-500">*</span>
          </p>
          <div className="flex gap-2">
            {(["M", "F", "Other"] as const).map((g) => (
              <label
                key={g}
                className={cn(
                  "flex-1 text-center px-3 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all",
                  watch("sex") === g
                    ? "border-brand-teal bg-brand-teal-50 text-brand-teal"
                    : "border-dash-border bg-dash-surface text-dash-text-dim hover:border-dash-border-strong",
                )}
              >
                <input
                  type="radio"
                  value={g}
                  className="sr-only"
                  {...register("sex")}
                />
                {g === "M" ? "Male" : g === "F" ? "Female" : "Other"}
              </label>
            ))}
          </div>
          {errors.sex && (
            <p className="text-xs text-red-600 mt-1">{errors.sex.message}</p>
          )}
        </div>
      </div>

      {/* Contact */}
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
          label="City / Town"
          required
          placeholder="e.g. Shimla"
          error={errors.city?.message}
          {...register("city")}
        />
      </div>

      {/* Blood + Insurance */}
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Blood Group"
          required
          error={errors.blood?.message}
          placeholder="Select blood group"
          value={watch("blood") ?? ""}
          onValueChange={(v) => setValue("blood", v, { shouldValidate: true })}
          options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))}
        />
        <FormSelect
          label="Insurance / Payer"
          required
          error={errors.insurance?.message}
          placeholder="Select insurance"
          value={watch("insurance") ?? ""}
          onValueChange={(v) =>
            setValue("insurance", v, { shouldValidate: true })
          }
          options={INSURANCE_OPTIONS.map((i) => ({ value: i, label: i }))}
        />
      </div>

      {/* Allergies */}
      <FormInput
        label="Known Allergies"
        placeholder="e.g. Penicillin, Aspirin — or leave blank"
        hint="Separate multiple allergies with commas"
        error={errors.allergies?.message}
        {...register("allergies")}
      />

      {/* Notes */}
      <FormTextarea
        label="Clinical Notes"
        placeholder="Any relevant medical history or special notes…"
        rows={3}
        {...register("notes")}
      />

      <div className="flex justify-end gap-3 pt-1">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Registering…" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
}

/* ── Slide-in panel wrapper ─────────────────────────────────────────────── */
interface PatientPanelProps {
  open: boolean;
  onClose: () => void;
}

export function PatientPanel({ open, onClose }: PatientPanelProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-dash-surface z-50 shadow-pop flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
          <div>
            <h2 className="text-[17px] font-bold text-dash-text">
              Register New Patient
            </h2>
            <p className="text-xs text-dash-text-mute mt-0.5">
              Create a new patient record in the system
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-dash-border text-dash-text-mute hover:text-dash-text hover:bg-dash-surface-3 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <PatientForm onClose={onClose} />
        </div>
      </div>
    </>
  );
}
