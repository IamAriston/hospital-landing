import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PatientRow } from "@/types/database";

export const CACHE_TAG_PATIENTS = "patients";

export const listPatients = cache(
  async (opts: { search?: string; limit?: number } = {}): Promise<PatientRow[]> => {
    const supabase = createAdminClient();
    let q = supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (opts.search) q = q.or(`name.ilike.%${opts.search}%,phone.ilike.%${opts.search}%`);
    if (opts.limit) q = q.limit(opts.limit);

    const { data, error } = await q;
    if (error) throw new Error(`listPatients: ${error.message}`);
    return (data ?? []) as PatientRow[];
  },
);

export const getPatientByPhone = cache(
  async (phone: string): Promise<PatientRow | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();
    if (error) throw new Error(`getPatientByPhone: ${error.message}`);
    return (data as PatientRow | null) ?? null;
  },
);
