"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  adminAppointmentUpdateSchema,
  publicAppointmentSchema,
  walkInAppointmentSchema,
} from "@/lib/schemas/appointment";
import { patientSchema } from "@/lib/schemas/patient";
import { getAppointmentsForPatient } from "@/lib/db/appointments";
import { allowBooking, getClientIp } from "@/lib/rate-limit";
import { requireAuth, zodFieldErrors, actionError } from "./_helpers";
import type {
  ActionResult,
  AppointmentRow,
  AppointmentWithRelations,
  PatientRow,
} from "@/types/database";

/**
 * Public booking — called from the landing site's BookAppointment section.
 *
 * The booking is rate-limited per IP and stored fully UNLINKED: no patient
 * record is created or attached here. A phone can belong to several family
 * members, so identity is resolved by staff at check-in, where they verify
 * the person and link/create the right patient record.
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

  const ip = await getClientIp();
  if (!(await allowBooking(ip))) {
    return actionError(
      "Too many booking attempts. Please wait a few minutes and try again.",
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("appointments")
    .insert({ ...parsed.data, patient_id: null });

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
  return { ok: true, data: null };
}

/**
 * All patients registered to a phone number. A number is a household contact,
 * so this can return several people (a parent and their children).
 */
async function findPatientsByPhone(phone: string): Promise<PatientRow[]> {
  const clean = phone.trim();
  if (clean.length < 6) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("patients")
    .select("*")
    .eq("phone", clean)
    .order("created_at", { ascending: true });
  return (data as PatientRow[] | null) ?? [];
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

  // Link to the patient the staff picked in the form. If they didn't pick and
  // the phone maps to exactly one person, link that one; otherwise (0 or an
  // ambiguous family of several) leave it unlinked for check-in to resolve.
  let patientId = parsed.data.patient_id ?? null;
  if (!patientId && parsed.data.patient_phone) {
    const candidates = await findPatientsByPhone(parsed.data.patient_phone);
    if (candidates.length === 1) patientId = candidates[0]!.id;
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
 * Phone lookup used by the walk-in and check-in forms. A number can belong to
 * several family members, so this returns every patient on it (empty when none).
 */
export async function lookupPatientsByPhone(
  phone: string,
): Promise<ActionResult<PatientRow[]>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const clean = phone.trim();
  if (clean.length < 6) return { ok: true, data: [] };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("phone", clean)
    .order("created_at", { ascending: true });

  if (error) return actionError(error.message);
  return { ok: true, data: (data as PatientRow[] | null) ?? [] };
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
  revalidatePath("/dashboard/opd");
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

/**
 * Front-desk check-in: the moment that connects a booking to a patient record.
 *
 * Staff open the appointment when the patient arrives, fill in / verify the
 * patient's details, and save. This upserts the patient record (create for a
 * new phone, update for an existing one), links the appointment to it, and
 * confirms the booking — which puts the patient in Today's OPD queue.
 */
export async function checkInAppointment(
  appointmentId: string,
  patientInput: unknown,
  targetPatientId?: string | null,
): Promise<ActionResult<PatientRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = patientSchema.safeParse(patientInput);
  if (!parsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(parsed.error));
  }

  const supabase = createAdminClient();

  const { data: appt, error: apptErr } = await supabase
    .from("appointments")
    .select("patient_id")
    .eq("id", appointmentId)
    .maybeSingle();
  if (apptErr) return actionError(apptErr.message);
  if (!appt) return actionError("Appointment not found.");

  // The check-in UI decides who this appointment is for (an existing family
  // member on the number, or a brand-new person). We trust that choice:
  //   • a target id  → verify/update that record;
  //   • no target    → create a new patient (a new family member). The
  //     UNIQUE(phone, name) index blocks an exact same-name-and-number dup.
  const targetId =
    targetPatientId ?? (appt.patient_id as string | null) ?? null;

  let patient: PatientRow;
  if (targetId) {
    const { data, error } = await supabase
      .from("patients")
      .update(parsed.data)
      .eq("id", targetId)
      .select()
      .single();
    if (error) {
      if (error.code === "23505")
        return actionError("Another patient on this number already uses that name.");
      return actionError(error.message);
    }
    patient = data as PatientRow;
  } else {
    const { data, error } = await supabase
      .from("patients")
      .insert(parsed.data)
      .select()
      .single();
    if (error) {
      if (error.code === "23505")
        return actionError(
          "A patient with this name is already registered on this number. Open their record to check them in instead.",
        );
      return actionError(error.message);
    }
    patient = data as PatientRow;
  }

  const { error: linkErr } = await supabase
    .from("appointments")
    .update({ patient_id: patient.id, status: "confirmed" })
    .eq("id", appointmentId);
  if (linkErr) return actionError(linkErr.message);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard/opd");
  revalidatePath("/dashboard/patients");
  revalidatePath("/dashboard");
  return { ok: true, data: patient };
}

/**
 * Appointment history for a single patient — used by the patient drawer in the
 * dashboard to show every past and upcoming visit.
 */
export async function listPatientAppointments(
  patientId: string,
): Promise<ActionResult<AppointmentWithRelations[]>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  try {
    const rows = await getAppointmentsForPatient(patientId);
    return { ok: true, data: rows };
  } catch (err) {
    return actionError(err instanceof Error ? err.message : "Failed to load history.");
  }
}
