import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { rangeFor, sanitizeSearch, type Paginated } from "@/lib/db/paginate";
import type {
  DepartmentRow,
  DepartmentWithDetails,
} from "@/types/database";

export const CACHE_TAG_DEPARTMENTS = "departments";

export type DepartmentStatusFilter = "active" | "inactive";

export type ListDepartmentsAdminOpts = {
  search?: string; // matches name / slug
  status?: DepartmentStatusFilter;
  page?: number;
  pageSize?: number;
};

/** Normalise Supabase's one-to-one join (object | array | null) to a single row. */
function pickDetails(row: unknown): DepartmentWithDetails {
  const detRaw = (row as { department_details: unknown }).department_details;
  const details = Array.isArray(detRaw) ? detRaw[0] ?? null : detRaw ?? null;
  return {
    ...(row as Omit<DepartmentWithDetails, "department_details">),
    department_details: details,
  } as DepartmentWithDetails;
}

/** Server-paginated admin department list with count + details join. */
export const listDepartmentsAdmin = cache(
  async (opts: ListDepartmentsAdminOpts = {}): Promise<Paginated<DepartmentWithDetails>> => {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 10;
    const supabase = createAdminClient();

    let q = supabase
      .from("departments")
      .select("*, department_details(*)", { count: "exact" })
      .order("display_order", { ascending: true });

    const search = sanitizeSearch(opts.search);
    if (search) q = q.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    if (opts.status === "active") q = q.eq("is_active", true);
    else if (opts.status === "inactive") q = q.eq("is_active", false);

    const { from, to } = rangeFor(page, pageSize);
    const { data, error, count } = await q.range(from, to);
    if (error) throw new Error(`listDepartmentsAdmin: ${error.message}`);
    return {
      rows: (data ?? []).map(pickDetails),
      total: count ?? 0,
      page,
      pageSize,
    };
  },
);

/** Global department counts for the mini-stat cards (unaffected by paging). */
export const getDepartmentStats = cache(async () => {
  const supabase = createAdminClient();
  const [{ count: total }, { count: active }] = await Promise.all([
    supabase.from("departments").select("id", { count: "exact", head: true }),
    supabase.from("departments").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);
  const t = total ?? 0;
  const a = active ?? 0;
  return { total: t, active: a, inactive: t - a };
});

export const getDepartments = cache(async (): Promise<DepartmentRow[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(`getDepartments: ${error.message}`);
  return (data ?? []) as DepartmentRow[];
});

export const getAllDepartmentsAdmin = cache(async (): Promise<DepartmentRow[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw new Error(`getAllDepartmentsAdmin: ${error.message}`);
  return (data ?? []) as DepartmentRow[];
});

export const getDepartmentBySlug = cache(
  async (slug: string): Promise<DepartmentWithDetails | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("departments")
      .select("*, department_details(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(`getDepartmentBySlug: ${error.message}`);
    if (!data) return null;

    // Supabase nests one-to-one joins as either an object or null.
    const details = Array.isArray(data.department_details)
      ? data.department_details[0] ?? null
      : data.department_details ?? null;

    return { ...(data as DepartmentRow), department_details: details };
  },
);

export const getDepartmentWithDetailsByIdAdmin = cache(
  async (id: string): Promise<DepartmentWithDetails | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("departments")
      .select("*, department_details(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`getDepartmentByIdAdmin: ${error.message}`);
    if (!data) return null;
    const details = Array.isArray(data.department_details)
      ? data.department_details[0] ?? null
      : data.department_details ?? null;
    return { ...(data as DepartmentRow), department_details: details };
  },
);
