"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  departmentSchema,
  departmentDetailsSchema,
} from "@/lib/schemas/department";
import { requireAuth, zodFieldErrors, actionError } from "./_helpers";
import type { ActionResult, DepartmentRow } from "@/types/database";

function revalidateAll() {
  revalidatePath("/dashboard/departments");
  revalidatePath("/departments", "layout");
  revalidatePath("/");
}

/**
 * Creates a department + its details row in one transaction-like flow.
 * Supabase JS does not expose interactive transactions, so we insert
 * the parent first then the child; if the child fails we delete the
 * parent to avoid an orphan.
 */
export async function createDepartment(input: unknown): Promise<ActionResult<DepartmentRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const inputObj = (input ?? {}) as Record<string, unknown>;
  const baseParsed = departmentSchema.safeParse(inputObj);
  const detailsParsed = departmentDetailsSchema.safeParse(inputObj.details ?? {});
  if (!baseParsed.success) {
    return actionError(
      "Please fix the errors and try again.",
      zodFieldErrors(baseParsed.error),
    );
  }
  if (!detailsParsed.success) {
    return actionError(
      "Please fix the errors and try again.",
      zodFieldErrors(detailsParsed.error),
    );
  }

  const supabase = createAdminClient();
  const { data: dept, error: deptErr } = await supabase
    .from("departments")
    .insert(baseParsed.data)
    .select()
    .single();

  if (deptErr) {
    if (deptErr.code === "23505") return actionError("That slug is already taken.");
    return actionError(deptErr.message);
  }

  const { error: detErr } = await supabase
    .from("department_details")
    .insert({ ...detailsParsed.data, department_id: dept.id });

  if (detErr) {
    await supabase.from("departments").delete().eq("id", dept.id);
    return actionError(detErr.message);
  }

  revalidateAll();
  return { ok: true, data: dept as DepartmentRow };
}

export async function updateDepartment(
  id: string,
  input: unknown,
): Promise<ActionResult<DepartmentRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const inputObj = (input ?? {}) as Record<string, unknown>;
  const baseParsed = departmentSchema.partial().safeParse(inputObj);
  const detailsParsed = departmentDetailsSchema.partial().safeParse(inputObj.details ?? {});
  if (!baseParsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(baseParsed.error));
  }
  if (!detailsParsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(detailsParsed.error));
  }

  const supabase = createAdminClient();
  const { data: dept, error: deptErr } = await supabase
    .from("departments")
    .update(baseParsed.data)
    .eq("id", id)
    .select()
    .single();

  if (deptErr) {
    if (deptErr.code === "23505") return actionError("That slug is already taken.");
    return actionError(deptErr.message);
  }

  // Upsert details — there's a UNIQUE constraint on department_id.
  const { error: detErr } = await supabase
    .from("department_details")
    .upsert(
      { ...detailsParsed.data, department_id: id },
      { onConflict: "department_id" },
    );

  if (detErr) return actionError(detErr.message);

  revalidateAll();
  return { ok: true, data: dept as DepartmentRow };
}

export async function deleteDepartment(id: string): Promise<ActionResult<null>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const supabase = createAdminClient();
  // department_details rows are CASCADE deleted by the FK.
  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) return actionError(error.message);

  revalidateAll();
  return { ok: true, data: null };
}
