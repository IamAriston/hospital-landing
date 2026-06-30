import { z } from "zod";
import { scheduleSchema } from "./schedule";
import { slugSchema } from "./common";

export const departmentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  slug: slugSchema,
  icon: z.string().trim().min(1, "Icon is required"),
  description: z.string().trim().default(""),
  is_active: z.boolean().default(true),
  display_order: z.coerce.number().int().default(0),
});

export const departmentDetailsSchema = z.object({
  when_to_visit: z.string().trim().default(""),
  opd_schedule: scheduleSchema.nullable().optional(),
  conditions: z.array(z.string().trim().min(1)).default([]),
  procedures: z.array(z.string().trim().min(1)).default([]),
  equipment: z.array(z.string().trim().min(1)).default([]),
});

export const departmentWithDetailsSchema = departmentSchema.extend({
  details: departmentDetailsSchema,
});

export type DepartmentFormValues = z.input<typeof departmentWithDetailsSchema>;
export type DepartmentPayload = z.output<typeof departmentWithDetailsSchema>;
