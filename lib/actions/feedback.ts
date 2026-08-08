"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { feedbackSchema } from "@/lib/schemas/feedback";
import { zodFieldErrors, actionError } from "./_helpers";
import type { ActionResult } from "@/types/database";

/** Public action — patients submit feedback from /patients/feedback. */
export async function submitFeedback(input: unknown): Promise<ActionResult<null>> {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(parsed.error));
  }

  const { name, contact, visit_type, department, rating, message } = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase.from("feedback").insert({
    name: name || "",
    contact: contact || null,
    visit_type,
    department: department || null,
    rating,
    message,
  });

  if (error) return actionError("We couldn't submit your feedback. Please try again.");

  return { ok: true, data: null };
}
