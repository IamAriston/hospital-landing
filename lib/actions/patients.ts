"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { patientSchema } from "@/lib/schemas/patient";
import { requireAuth, zodFieldErrors, actionError } from "./_helpers";
import type { ActionResult, PatientRow } from "@/types/database";

function revalidateAll() {
  revalidatePath("/dashboard/patients");
}

export async function createPatient(input: unknown): Promise<ActionResult<PatientRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = patientSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(parsed.error));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("patients")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return actionError("A patient with that phone already exists.");
    return actionError(error.message);
  }

  revalidateAll();
  return { ok: true, data: data as PatientRow };
}

export async function updatePatient(
  id: string,
  input: unknown,
): Promise<ActionResult<PatientRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = patientSchema.partial().safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(parsed.error));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("patients")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();
  if (error) return actionError(error.message);

  revalidateAll();
  return { ok: true, data: data as PatientRow };
}

export async function deletePatient(id: string): Promise<ActionResult<null>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const supabase = createAdminClient();
  const { error } = await supabase.from("patients").delete().eq("id", id);
  if (error) return actionError(error.message);

  revalidateAll();
  return { ok: true, data: null };
}
