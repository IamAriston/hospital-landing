"use client";

import { ImageUpload } from "@/components/forms/image-upload";
import { ScheduleInput } from "@/components/forms/schedule-input";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormTextarea } from "@/components/ui/form-textarea";
import { useServerAction } from "@/hooks/use-server-action";
import { createDoctor, updateDoctor } from "@/lib/actions/doctors";
import { initialsFrom, slugify } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";
import type {
  DepartmentRow,
  DoctorRow,
  Schedule,
} from "@/types/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface DoctorFormProps {
  doctor?: DoctorRow | null;
  departments: DepartmentRow[];
  onClose: () => void;
  onSaved?: (doctor: DoctorRow) => void;
}

/** Soft pastel palette used when picking an avatar tint from the name. */
const AVATAR_PALETTE = [
  "#E0F2FE", // sky
  "#CCFBF1", // teal
  "#FEF3C7", // amber
  "#FCE7F3", // pink
  "#EDE9FE", // violet
  "#DCFCE7", // green
  "#FEE2E2", // rose
  "#E0E7FF", // indigo
];

function pickAvatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length]!;
}

/**
 * UI schema — only the fields the user actually fills in. The rest
 * (slug, initials, avatar_color, rating, display_order) are derived
 * in `onSubmit` and merged into the payload sent to the server action.
 */
const uiSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  specialty: z.string().trim().min(2, "Specialty is required"),
  department_id: z.string().uuid().nullable(),
  years_experience: z.coerce.number().int().min(0).max(80),
  qualifications: z.string().trim().optional().nullable(),
  bio: z.string().trim().optional().nullable(),
  schedule: z
    .object({
      days: z.array(z.number().int().min(0).max(6)),
      startHour: z.number().int().min(0).max(23),
      endHour: z.number().int().min(0).max(23),
    })
    .nullable(),
  photo_url: z.string().url().nullable().or(z.literal("").transform(() => null)),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

type UiValues = z.input<typeof uiSchema>;

export function DoctorForm({
  doctor,
  departments,
  onClose,
  onSaved,
}: DoctorFormProps) {
  const isEdit = !!doctor;

  const defaults: UiValues = {
    name: doctor?.name ?? "",
    specialty: doctor?.specialty ?? "",
    department_id: doctor?.department_id ?? null,
    years_experience: doctor?.years_experience ?? 0,
    qualifications: doctor?.qualifications ?? "",
    bio: doctor?.bio ?? "",
    schedule: (doctor?.schedule as Schedule | null) ?? null,
    photo_url: doctor?.photo_url ?? null,
    is_active: doctor?.is_active ?? true,
    is_featured: doctor?.is_featured ?? false,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UiValues>({
    resolver: zodResolver(uiSchema),
    defaultValues: defaults,
  });

  const action = useServerAction(
    isEdit
      ? (input: unknown) => updateDoctor(doctor!.id, input)
      : createDoctor,
    {
      successMessage: isEdit ? "Doctor updated" : "Doctor created",
      onSuccess: (data) => {
        onSaved?.(data);
        onClose();
      },
    },
  );

  async function onSubmit(values: UiValues) {
    // Derive the auto-generated fields here so they never have to live
    // in form state. On edit we keep the existing slug + avatar_color
    // (slug is the public URL; avatar tint is whatever was stored).
    const payload = {
      ...values,
      slug: isEdit ? doctor!.slug : slugify(values.name),
      initials: initialsFrom(values.name),
      avatar_color: isEdit ? doctor!.avatar_color : pickAvatarColor(values.name),
      rating: isEdit ? doctor!.rating : 5,
      display_order: isEdit ? doctor!.display_order : 0,
    };
    await action.run(payload);
  }

  // Radix Select forbids empty-string item values — use a sentinel
  // and convert back to null at the form layer.
  const NONE = "__none__";
  const deptOptions = [
    { value: NONE, label: "No department" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
        <h2 className="text-lg font-bold text-dash-text font-display">
          {isEdit ? "Edit Doctor" : "Add Doctor"}
        </h2>
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
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Full name"
            placeholder="Dr. Anjali Sharma"
            required
            error={errors.name?.message}
            {...register("name")}
          />
          <FormInput
            label="Specialty"
            placeholder="Cardiologist"
            required
            error={errors.specialty?.message}
            {...register("specialty")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="department_id"
            render={({ field }) => (
              <FormSelect
                label="Department"
                placeholder="Select department"
                options={deptOptions}
                value={field.value ?? NONE}
                onValueChange={(v) => field.onChange(v === NONE ? null : v)}
                error={errors.department_id?.message}
              />
            )}
          />
          <FormInput
            type="number"
            label="Years experience"
            min={0}
            error={errors.years_experience?.message}
            {...register("years_experience")}
          />
        </div>

        <FormInput
          label="Qualifications"
          placeholder="MBBS, MD (Cardiology) — AIIMS"
          {...register("qualifications")}
        />

        <FormTextarea
          label="Bio"
          rows={3}
          placeholder="Brief background, areas of focus, languages…"
          {...register("bio")}
        />

        <Controller
          control={control}
          name="schedule"
          render={({ field }) => (
            <ScheduleInput
              value={field.value ?? null}
              onChange={field.onChange}
              error={errors.schedule?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="photo_url"
          render={({ field }) => (
            <ImageUpload
              value={field.value ?? null}
              onChange={field.onChange}
              folder="doctors"
              label="Profile photo"
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <FormSwitch
                label="Active"
                description="Visible on the public site."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="is_featured"
            render={({ field }) => (
              <FormSwitch
                label="Featured on home"
                description="Show in the home-page doctors carousel."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <footer className="flex justify-end gap-2 px-6 py-4 border-t border-dash-border bg-dash-surface">
        <Button type="button" variant="outline" onClick={onClose} disabled={action.pending}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={action.pending}
          className={cn("bg-teal-600 hover:bg-teal-700 text-white")}
        >
          {action.pending ? "Saving…" : isEdit ? "Save changes" : "Create doctor"}
        </Button>
      </footer>
    </form>
  );
}
