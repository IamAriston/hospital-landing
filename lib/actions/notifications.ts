"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, actionError } from "./_helpers";
import type { ActionResult } from "@/types/database";

export type AppointmentNotification = {
  id: string;
  patient_name: string;
  status: string;
  preferred_date: string | null;
  time_slot: string | null;
  department: string | null;
  doctor: string | null;
  created_at: string;
};

/**
 * Returns appointments created strictly after `sinceIso`, newest first.
 * Uses the service-role client so it works regardless of RLS / realtime
 * configuration — this is the reliable backbone of dashboard notifications.
 */
export async function fetchAppointmentsSince(
  sinceIso: string,
): Promise<ActionResult<AppointmentNotification[]>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, patient_name, status, preferred_date, time_slot, created_at, departments(name), doctors(name)",
    )
    .gt("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return actionError(error.message);

  const items: AppointmentNotification[] = (data ?? []).map((row) => {
    const dept = row.departments as { name: string } | { name: string }[] | null;
    const doc = row.doctors as { name: string } | { name: string }[] | null;
    return {
      id: row.id as string,
      patient_name: row.patient_name as string,
      status: row.status as string,
      preferred_date: (row.preferred_date as string | null) ?? null,
      time_slot: (row.time_slot as string | null) ?? null,
      department: Array.isArray(dept) ? (dept[0]?.name ?? null) : (dept?.name ?? null),
      doctor: Array.isArray(doc) ? (doc[0]?.name ?? null) : (doc?.name ?? null),
      created_at: row.created_at as string,
    };
  });

  return { ok: true, data: items };
}
