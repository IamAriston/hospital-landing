import { DepartmentsBoard } from "./departments-board";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DepartmentWithDetails } from "@/types/database";

export const dynamic = "force-dynamic";

async function getAllDepartmentsWithDetails(): Promise<DepartmentWithDetails[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*, department_details(*)")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => {
    const detRaw = (row as { department_details: unknown }).department_details;
    const details = Array.isArray(detRaw) ? detRaw[0] ?? null : detRaw ?? null;
    return { ...(row as Omit<DepartmentWithDetails, "department_details">), department_details: details };
  }) as DepartmentWithDetails[];
}

export default async function DepartmentsAdminPage() {
  const departments = await getAllDepartmentsWithDetails();
  return <DepartmentsBoard departments={departments} />;
}
