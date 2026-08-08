"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, actionError } from "./_helpers";
import type { ActionResult } from "@/types/database";

export type SearchResults = {
  patients: { id: string; name: string; phone: string }[];
  doctors: { id: string; name: string; specialty: string }[];
  departments: { id: string; name: string; slug: string }[];
  appointments: { id: string; patient_name: string; status: string }[];
};

const EMPTY: SearchResults = {
  patients: [],
  doctors: [],
  departments: [],
  appointments: [],
};

/** Strip characters that would break PostgREST `.or()` / `.ilike` filters. */
function sanitize(term: string) {
  return term.replace(/[,()*%]/g, " ").trim();
}

export async function globalSearch(query: string): Promise<ActionResult<SearchResults>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const term = sanitize(query);
  if (term.length < 2) return { ok: true, data: EMPTY };

  const supabase = createAdminClient();
  const like = `%${term}%`;

  try {
    const [patients, doctors, departments, appointments] = await Promise.all([
      supabase
        .from("patients")
        .select("id, name, phone")
        .or(`name.ilike.${like},phone.ilike.${like}`)
        .limit(5),
      supabase
        .from("doctors")
        .select("id, name, specialty")
        .or(`name.ilike.${like},specialty.ilike.${like}`)
        .limit(5),
      supabase.from("departments").select("id, name, slug").ilike("name", like).limit(5),
      supabase
        .from("appointments")
        .select("id, patient_name, status")
        .ilike("patient_name", like)
        .limit(5),
    ]);

    return {
      ok: true,
      data: {
        patients: (patients.data ?? []) as SearchResults["patients"],
        doctors: (doctors.data ?? []) as SearchResults["doctors"],
        departments: (departments.data ?? []) as SearchResults["departments"],
        appointments: (appointments.data ?? []) as SearchResults["appointments"],
      },
    };
  } catch {
    return actionError("Search failed. Please try again.");
  }
}
