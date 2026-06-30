import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DoctorRow, DoctorWithDepartment } from "@/types/database";

export const CACHE_TAG_DOCTORS = "doctors";

type GetDoctorsOpts = {
  /** If true, includes inactive rows. Default: false (active only). */
  includeInactive?: boolean;
  /** Optional department filter. */
  departmentId?: string;
  /** Optional featured filter. */
  featuredOnly?: boolean;
};

/**
 * Public-facing read. RLS limits results to `is_active = true`.
 * Pass `includeInactive: true` only from admin contexts that use the
 * admin variant below.
 */
export const getDoctors = cache(async (opts: GetDoctorsOpts = {}): Promise<DoctorRow[]> => {
  const supabase = createPublicClient();
  let q = supabase
    .from("doctors")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (opts.departmentId) q = q.eq("department_id", opts.departmentId);
  if (opts.featuredOnly) q = q.eq("is_featured", true);

  const { data, error } = await q;
  if (error) throw new Error(`getDoctors: ${error.message}`);
  return (data ?? []) as DoctorRow[];
});

/** Admin read — bypasses RLS, returns inactive doctors too. Joined with department. */
export const getAllDoctorsAdmin = cache(async (): Promise<DoctorWithDepartment[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("*, departments(id, name, slug)")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(`getAllDoctorsAdmin: ${error.message}`);
  return (data ?? []) as unknown as DoctorWithDepartment[];
});

export const getDoctorBySlug = cache(async (slug: string): Promise<DoctorRow | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`getDoctorBySlug: ${error.message}`);
  return (data as DoctorRow | null) ?? null;
});

export const getFeaturedDoctors = cache(
  async (limit = 6): Promise<DoctorRow[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("is_featured", true)
      .order("display_order", { ascending: true })
      .limit(limit);

    if (error) throw new Error(`getFeaturedDoctors: ${error.message}`);
    return (data ?? []) as DoctorRow[];
  },
);
