"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";
import {
  adminAppointmentUpdateSchema,
  publicAppointmentSchema,
  walkInAppointmentSchema,
} from "@/lib/schemas/appointment";
import { requireAuth, zodFieldErrors, actionError } from "./_helpers";
import type { ActionResult, AppointmentRow, PatientRow } from "@/types/database";

/**
 * Public booking — called from the landing site's BookAppointment section.
 * Uses the anon-key client; the `public_insert_appointments` RLS policy
 * allows the insert without authentication.
 *
 * Note: we DON'T chain .select() on the public insert. anon has no SELECT
 * policy on appointments, and Postgres treats INSERT ... RETURNING as a
 * SELECT for policy-eval purposes — so adding .select() would fail RLS.
 */
export async function createAppointment(
  input: unknown,
): Promise<ActionResult<null>> {
  const parsed = publicAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(
      "Please complete the required fields.",
      zodFieldErrors(parsed.error),
    );
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("appointments").insert(parsed.data);

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true, data: null };
}

/**
 * Walk-in booking — staff registering a patient at the front desk.
 * Uses the admin (service-role) client so it can also link a matching
 * patient row when the phone already exists.
 */
export async function createWalkInAppointment(
  input: unknown,
): Promise<ActionResult<AppointmentRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = walkInAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(
      "Please complete the required fields.",
      zodFieldErrors(parsed.error),
    );
  }

  const supabase = createAdminClient();

  // If a patient with that phone already exists, link the appointment to them.
  let patientId = parsed.data.patient_id ?? null;
  if (!patientId && parsed.data.patient_phone) {
    const { data: existing } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", parsed.data.patient_phone)
      .maybeSingle();
    if (existing?.id) patientId = existing.id as string;
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({ ...parsed.data, patient_id: patientId })
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true, data: data as AppointmentRow };
}

/**
 * Phone lookup used by the walk-in form to auto-fill known patients.
 * Returns null when no match — never an error.
 */
export async function lookupPatientByPhone(
  phone: string,
): Promise<ActionResult<PatientRow | null>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const clean = phone.trim();
  if (clean.length < 6) return { ok: true, data: null };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("phone", clean)
    .maybeSingle();

  if (error) return actionError(error.message);
  return { ok: true, data: (data as PatientRow | null) ?? null };
}

export async function updateAppointment(
  id: string,
  input: unknown,
): Promise<ActionResult<AppointmentRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = adminAppointmentUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Invalid update.", zodFieldErrors(parsed.error));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("appointments")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true, data: data as AppointmentRow };
}

export async function deleteAppointment(id: string): Promise<ActionResult<null>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const supabase = createAdminClient();
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) return actionError(error.message);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true, data: null };
}
