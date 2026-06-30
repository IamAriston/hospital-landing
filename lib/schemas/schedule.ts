import { z } from "zod";

export const scheduleSchema = z
  .object({
    days: z.array(z.number().int().min(0).max(6)).min(1, "Pick at least one day"),
    startHour: z.number().int().min(0).max(23),
    endHour: z.number().int().min(0).max(23),
  })
  .refine((s) => s.endHour > s.startHour, {
    message: "End hour must be after start hour",
    path: ["endHour"],
  });

export type ScheduleInput = z.infer<typeof scheduleSchema>;
