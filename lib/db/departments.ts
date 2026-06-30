import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  DepartmentRow,
  DepartmentWithDetails,
} from "@/types/database";

export const CACHE_TAG_DEPARTMENTS = "departments";

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
