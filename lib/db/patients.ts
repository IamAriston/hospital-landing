import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { rangeFor, sanitizeSearch, type Paginated } from "@/lib/db/paginate";
import type { PatientRow, Sex } from "@/types/database";

export const CACHE_TAG_PATIENTS = "patients";

export type ListPatientsOpts = {
  search?: string;
  sex?: Sex | "all";
  page?: number;
  pageSize?: number;
};

/** Server-paginated patient list with optional search + gender filter. */
export const listPatients = cache(
  async (opts: ListPatientsOpts = {}): Promise<Paginated<PatientRow>> => {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 10;
    const supabase = createAdminClient();

    let q = supabase
      .from("patients")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    const search = sanitizeSearch(opts.search);
    if (search) {
      q = q.or(
        `name.ilike.%${search}%,phone.ilike.%${search}%,city.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }
    if (opts.sex && opts.sex !== "all") q = q.eq("sex", opts.sex);

    const { from, to } = rangeFor(page, pageSize);
    const { data, error, count } = await q.range(from, to);
    if (error) throw new Error(`listPatients: ${error.message}`);
    return { rows: (data ?? []) as PatientRow[], total: count ?? 0, page, pageSize };
  },
);

export const getPatientById = cache(
  async (id: string): Promise<PatientRow | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`getPatientById: ${error.message}`);
    return (data as PatientRow | null) ?? null;
  },
);

// A phone number is a household contact, so it may map to several patients
// (a parent and their children). Returns all of them, oldest first.
export const getPatientsByPhone = cache(
  async (phone: string): Promise<PatientRow[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("phone", phone)
      .order("created_at", { ascending: true });
    if (error) throw new Error(`getPatientsByPhone: ${error.message}`);
    return (data as PatientRow[] | null) ?? [];
  },
);
