"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { actionError } from "./_helpers";
import type { ActionResult, LabReportRow } from "@/types/database";

/** Normalise a phone to digits so "+91 98xxx" and "98xxx" match. */
function digits(s: string) {
  return s.replace(/\D/g, "");
}

const labSchema = z.object({
  report_id: z.string().trim().min(3, "Enter the Report ID from your slip."),
  phone: z.string().trim().min(6, "Enter your registered phone number."),
});

export type LabLookupResult = {
  report_id: string;
  patient_name: string;
  test_name: string;
  status: LabReportRow["status"];
  ready_at: string | null;
  file_url: string | null;
};

export async function lookupLabReport(input: unknown): Promise<ActionResult<LabLookupResult>> {
  const parsed = labSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lab_reports")
    .select("report_id, patient_name, patient_phone, test_name, status, ready_at, file_url")
    .eq("report_id", parsed.data.report_id.trim())
    .maybeSingle();

  if (error) return actionError("Lookup failed. Please try again in a moment.");

  // Compare on trailing digits so formatting differences don't block matches.
  const enteredDigits = digits(parsed.data.phone);
  const matches =
    data &&
    enteredDigits.length >= 6 &&
    digits(data.patient_phone).endsWith(enteredDigits.slice(-10));

  if (!data || !matches) {
    return actionError(
      "No report found for that Report ID and phone number. Please check and try again.",
    );
  }

  return {
    ok: true,
    data: {
      report_id: data.report_id,
      patient_name: data.patient_name,
      test_name: data.test_name,
      status: data.status,
      ready_at: data.ready_at,
      file_url: data.file_url,
    },
  };
}

const apptSchema = z.object({
  phone: z.string().trim().min(6, "Enter your registered phone number."),
});

export type AppointmentLookupItem = {
  patient_name: string;
  status: string;
  preferred_date: string | null;
  time_slot: string | null;
  department: string | null;
  doctor: string | null;
};

export async function lookupAppointments(
  input: unknown,
): Promise<ActionResult<AppointmentLookupItem[]>> {
  const parsed = apptSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const enteredDigits = digits(parsed.data.phone);
  if (enteredDigits.length < 6) {
    return actionError("Enter your registered phone number.");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "patient_name, patient_phone, status, preferred_date, time_slot, departments(name), doctors(name)",
    )
    .ilike("patient_phone", `%${enteredDigits.slice(-10)}%`)
    .order("preferred_date", { ascending: false })
    .limit(10);

  if (error) return actionError("Lookup failed. Please try again in a moment.");

  const items: AppointmentLookupItem[] = (data ?? []).map((row) => {
    const dept = row.departments as { name: string } | { name: string }[] | null;
    const doc = row.doctors as { name: string } | { name: string }[] | null;
    return {
      patient_name: row.patient_name,
      status: row.status,
      preferred_date: row.preferred_date,
      time_slot: row.time_slot,
      department: Array.isArray(dept) ? (dept[0]?.name ?? null) : (dept?.name ?? null),
      doctor: Array.isArray(doc) ? (doc[0]?.name ?? null) : (doc?.name ?? null),
    };
  });

  return { ok: true, data: items };
}
