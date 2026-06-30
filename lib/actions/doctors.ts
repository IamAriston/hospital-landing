"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { doctorSchema } from "@/lib/schemas/doctor";
import { requireAuth, zodFieldErrors, actionError } from "./_helpers";
import type { ActionResult, DoctorRow } from "@/types/database";

function revalidateAll() {
  revalidatePath("/dashboard/doctors");
  revalidatePath("/doctors");
  revalidatePath("/");
  revalidatePath("/departments", "layout");
}

export async function createDoctor(
  input: unknown,
): Promise<ActionResult<DoctorRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = doctorSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors and try again.", zodFieldErrors(parsed.error));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("doctors")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return actionError("That slug is already taken.");
    return actionError(error.message);
  }

  revalidateAll();
  return { ok: true, data: data as DoctorRow };
}

export async function updateDoctor(
  id: string,
  input: unknown,
): Promise<ActionResult<DoctorRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = doctorSchema.partial().safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors and try again.", zodFieldErrors(parsed.error));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("doctors")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return actionError("That slug is already taken.");
    return actionError(error.message);
  }

  revalidateAll();
  return { ok: true, data: data as DoctorRow };
}

export async function deleteDoctor(id: string): Promise<ActionResult<null>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const supabase = createAdminClient();
  const { error } = await supabase.from("doctors").delete().eq("id", id);
  if (error) return actionError(error.message);

  revalidateAll();
  return { ok: true, data: null };
}

export async function toggleDoctorFeatured(
  id: string,
  isFeatured: boolean,
): Promise<ActionResult<null>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("doctors")
    .update({ is_featured: isFeatured })
    .eq("id", id);

  if (error) return actionError(error.message);

  revalidateAll();
  return { ok: true, data: null };
}
