import { z } from "zod";
import { phoneSchema } from "./common";

const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const patientSchema = z.object({
  name: z.string().trim().min(2),
  phone: phoneSchema,
  email: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  age: z.coerce.number().int().min(0).max(130),
  sex: z.enum(["M", "F", "Other"]),
  city: z.string().trim().optional(),
  blood_group: z.enum(BLOOD),
  insurance: z.string().trim().optional(),
  allergies: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  guardian_name: z.string().trim().optional(),
});

export type PatientFormValues = z.input<typeof patientSchema>;
export type PatientPayload = z.output<typeof patientSchema>;
