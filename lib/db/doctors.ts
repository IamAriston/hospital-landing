import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { rangeFor, sanitizeSearch, type Paginated } from "@/lib/db/paginate";
import type { DoctorRow, DoctorWithDepartment } from "@/types/database";

export const CACHE_TAG_DOCTORS = "doctors";

export type DoctorStatusFilter = "active" | "inactive" | "featured";

export type ListDoctorsAdminOpts = {
  search?: string; // matches name / specialty
  status?: DoctorStatusFilter;
  departmentId?: string;
  page?: number;
  pageSize?: number;
};

/** Server-paginated admin doctor list with count + department join. */
export const listDoctorsAdmin = cache(
  async (opts: ListDoctorsAdminOpts = {}): Promise<Paginated<DoctorWithDepartment>> => {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 10;
    const supabase = createAdminClient();

    let q = supabase
      .from("doctors")
      .select("*, departments(id, name, slug)", { count: "exact" })
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    const search = sanitizeSearch(opts.search);
    if (search) q = q.or(`name.ilike.%${search}%,specialty.ilike.%${search}%`);
    if (opts.status === "active") q = q.eq("is_active", true);
    else if (opts.status === "inactive") q = q.eq("is_active", false);
    else if (opts.status === "featured") q = q.eq("is_featured", true);
    if (opts.departmentId) q = q.eq("department_id", opts.departmentId);

    const { from, to } = rangeFor(page, pageSize);
    const { data, error, count } = await q.range(from, to);
    if (error) throw new Error(`listDoctorsAdmin: ${error.message}`);
    return {
      rows: (data ?? []) as unknown as DoctorWithDepartment[],
      total: count ?? 0,
      page,
      pageSize,
    };
  },
);

/** Global doctor counts for the roster mini-stat cards (unaffected by paging). */
export const getDoctorStats = cache(async () => {
  const supabase = createAdminClient();
  const [{ count: total }, { count: active }, { count: featured }] = await Promise.all([
    supabase.from("doctors").select("id", { count: "exact", head: true }),
    supabase.from("doctors").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("doctors").select("id", { count: "exact", head: true }).eq("is_featured", true),
  ]);
  const t = total ?? 0;
  const a = active ?? 0;
  return { total: t, active: a, inactive: t - a, featured: featured ?? 0 };
});

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
