"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSwitch } from "@/components/ui/form-switch";
import { Button } from "@/components/ui/button";
import { ArrayInput } from "@/components/forms/array-input";
import { ScheduleInput } from "@/components/forms/schedule-input";
import {
  departmentWithDetailsSchema,
  type DepartmentFormValues,
} from "@/lib/schemas/department";
import { slugify } from "@/lib/schemas/common";
import { useServerAction } from "@/hooks/use-server-action";
import { createDepartment, updateDepartment } from "@/lib/actions/departments";
import { cn } from "@/lib/utils";
import type { DepartmentWithDetails } from "@/types/database";

interface DepartmentFormProps {
  department?: DepartmentWithDetails | null;
  onClose: () => void;
}

export function DepartmentForm({ department, onClose }: DepartmentFormProps) {
  const isEdit = !!department;

  const defaults: DepartmentFormValues = {
    name: department?.name ?? "",
    slug: department?.slug ?? "",
    icon: department?.icon ?? "stethoscope",
    description: department?.description ?? "",
    is_active: department?.is_active ?? true,
    display_order: department?.display_order ?? 0,
    details: {
      when_to_visit: department?.department_details?.when_to_visit ?? "",
      opd_schedule: department?.department_details?.opd_schedule ?? null,
      conditions: department?.department_details?.conditions ?? [],
      procedures: department?.department_details?.procedures ?? [],
      equipment: department?.department_details?.equipment ?? [],
    },
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentWithDetailsSchema),
    defaultValues: defaults,
  });

  const name = watch("name");
  const slugTouched = React.useRef(isEdit);

  React.useEffect(() => {
    if (!slugTouched.current && name) setValue("slug", slugify(name));
  }, [name, setValue]);

  const action = useServerAction(
    isEdit
      ? (input: unknown) => updateDepartment(department!.id, input)
      : createDepartment,
    {
      successMessage: isEdit ? "Department updated" : "Department created",
      onSuccess: onClose,
    },
  );

  async function onSubmit(values: DepartmentFormValues) {
    await action.run(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <header className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
        <h2 className="text-lg font-bold text-dash-text font-display">
          {isEdit ? `Edit ${department!.name}` : "Add Department"}
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
            label="Name"
            placeholder="Cardiology"
            required
            error={errors.name?.message}
            {...register("name")}
          />
          <FormInput
            label="Slug"
            placeholder="cardiology"
            required
            hint="URL-friendly identifier."
            error={errors.slug?.message}
            {...register("slug", {
              onChange: () => {
                slugTouched.current = true;
              },
            })}
          />
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-4 items-start">
          <FormInput
            label="Icon"
            placeholder="heart"
            hint="lucide-react icon name (e.g. heart, brain, stethoscope)."
            error={errors.icon?.message}
            {...register("icon")}
          />
          <FormInput
            type="number"
            label="Display order"
            error={errors.display_order?.message}
            {...register("display_order")}
          />
        </div>

        <FormTextarea
          label="Description"
          rows={2}
          placeholder="One-line summary used in the department card and detail page."
          {...register("description")}
        />

        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <FormSwitch
              label="Active"
              description="Inactive departments are hidden from the public site."
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <div className="pt-2 border-t border-dash-border">
          <h3 className="text-[13px] font-bold text-dash-text uppercase tracking-wider mb-3">
            Detail Page
          </h3>

          <FormTextarea
            label="When to visit"
            rows={2}
            placeholder="Symptoms or scenarios that should prompt a visit to this department."
            {...register("details.when_to_visit")}
          />

          <Controller
            control={control}
            name="details.opd_schedule"
            render={({ field }) => (
              <ScheduleInput
                value={field.value ?? null}
                onChange={field.onChange}
                label="OPD schedule"
                className="mt-4"
              />
            )}
          />

          <Controller
            control={control}
            name="details.conditions"
            render={({ field }) => (
              <ArrayInput
                value={field.value ?? []}
                onChange={field.onChange}
                label="Conditions treated"
                placeholder="Add a condition and press Enter"
                className="mt-4"
              />
            )}
          />
          <Controller
            control={control}
            name="details.procedures"
            render={({ field }) => (
              <ArrayInput
                value={field.value ?? []}
                onChange={field.onChange}
                label="Procedures & treatments"
                placeholder="Add a procedure and press Enter"
                className="mt-4"
              />
            )}
          />
          <Controller
            control={control}
            name="details.equipment"
            render={({ field }) => (
              <ArrayInput
                value={field.value ?? []}
                onChange={field.onChange}
                label="Equipment & facilities"
                placeholder="Add equipment and press Enter"
                className="mt-4"
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
          {action.pending ? "Saving…" : isEdit ? "Save changes" : "Create department"}
        </Button>
      </footer>
    </form>
  );
}
