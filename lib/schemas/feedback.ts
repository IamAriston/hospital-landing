import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal("")),
  contact: z.string().trim().max(120).optional().or(z.literal("")),
  visit_type: z.string().trim().max(40).default("OPD"),
  department: z.string().trim().max(120).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(0).max(5).default(0),
  message: z
    .string()
    .trim()
    .min(5, "Please share a little more detail (at least 5 characters).")
    .max(3000),
});

export type FeedbackValues = z.input<typeof feedbackSchema>;
