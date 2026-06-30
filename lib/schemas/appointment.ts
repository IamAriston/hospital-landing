import { z } from "zod";
import { phoneSchema } from "./common";

const STATUS = ["new", "contacted", "confirmed", "cancelled"] as const;
const TIME_SLOT = ["Morning", "Afternoon", "Evening"] as const;

/**
 * Schema for the public booking form on the landing page.
 * Keep it lenient: many fields are optional because patients may not
 * know which department/doctor they need.
 */
export const publicAppointmentSchema = z.object({
  patient_name: z.string().trim().min(2, "Please enter your name"),
  patient_phone: phoneSchema,
  patient_email: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  department_id: z.string().uuid().nullable().optional(),
  doctor_id: z.string().uuid().nullable().optional(),
  preferred_date: z.string().min(1, "Pick a date").optional(),
  time_slot: z.enum(TIME_SLOT).optional(),
  message: z.string().trim().optional(),
});

/**
 * Schema the admin dashboard uses to edit existing appointments
 * (status changes + admin notes).
 */
export const adminAppointmentUpdateSchema = z.object({
  status: z.enum(STATUS),
  admin_notes: z.string().trim().optional().nullable(),
});

/**
 * Walk-in booking schema — staff registering an appointment directly at
 * the dashboard. Same patient/booking fields as the public form, plus the
 * admin can set initial status (walk-ins default to `confirmed`) and add
 * internal notes.
 */
export const walkInAppointmentSchema = publicAppointmentSchema.extend({
  status: z.enum(STATUS).default("confirmed"),
  admin_notes: z.string().trim().optional().nullable(),
  patient_id: z.string().uuid().nullable().optional(),
});

export type PublicAppointmentValues = z.input<typeof publicAppointmentSchema>;
export type PublicAppointmentPayload = z.output<typeof publicAppointmentSchema>;
export type AdminAppointmentUpdateValues = z.input<typeof adminAppointmentUpdateSchema>;
export type WalkInAppointmentValues = z.input<typeof walkInAppointmentSchema>;
