import { z } from "zod";
import { scheduleSchema } from "./schedule";
import { slugSchema } from "./common";

const HEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

export const doctorSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  slug: slugSchema,
  specialty: z.string().trim().min(2, "Specialty is required"),
  department_id: z.string().uuid("Pick a department").nullable(),
  years_experience: z.coerce.number().int().min(0).max(80),
  rating: z.coerce.number().min(1).max(5),
  schedule: scheduleSchema.nullable(),
  initials: z.string().trim().min(1).max(4),
  avatar_color: z
    .string()
    .trim()
    .regex(HEX, "Use a hex color like #0D9488")
    .default("#E0F2FE"),
  bio: z.string().trim().optional().nullable(),
  photo_url: z.string().url().optional().nullable().or(z.literal("").transform(() => null)),
  qualifications: z.string().trim().optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
});

export type DoctorFormValues = z.input<typeof doctorSchema>;
export type DoctorPayload = z.output<typeof doctorSchema>;
