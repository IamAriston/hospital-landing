"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { requireAuth, zodFieldErrors, actionError } from "./_helpers";
import type {
  ActionResult,
  ProfileRow,
  ProfilePreferences,
} from "@/types/database";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().optional(),
  title: z.string().trim().optional(),
  bio: z.string().trim().optional(),
});

const preferencesSchema = z.object({
  notifications: z
    .object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      appointment: z.boolean().optional(),
      lab: z.boolean().optional(),
    })
    .optional(),
  timezone: z.string().trim().optional(),
  language: z.string().trim().optional(),
});

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[0-9]/, "Include at least one number"),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

async function mergePreferences(
  userId: string,
  patch: Partial<ProfilePreferences>,
): Promise<ProfilePreferences> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", userId)
    .single();
  const current = (data?.preferences ?? {}) as ProfilePreferences;
  return {
    ...current,
    ...patch,
    notifications: { ...current.notifications, ...patch.notifications },
  };
}

export async function updateProfile(input: unknown): Promise<ActionResult<ProfileRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(parsed.error));
  }

  const { full_name, phone, title, bio } = parsed.data;
  const preferences = await mergePreferences(auth.userId, { phone, title, bio });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name, preferences })
    .eq("id", auth.userId)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard", "layout");
  return { ok: true, data: data as ProfileRow };
}

export async function updatePreferences(input: unknown): Promise<ActionResult<ProfileRow>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = preferencesSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(parsed.error));
  }

  const preferences = await mergePreferences(auth.userId, parsed.data);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ preferences })
    .eq("id", auth.userId)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/settings");
  return { ok: true, data: data as ProfileRow };
}

export async function updatePassword(input: unknown): Promise<ActionResult<null>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) {
    return actionError("Please fix the errors.", zodFieldErrors(parsed.error));
  }

  const user = await getCurrentUser();
  if (!user?.email) return actionError("Could not verify your account.");

  const supabase = await createClient();

  // Re-authenticate to confirm the current password is correct.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.current,
  });
  if (signInError) {
    return actionError("Current password is incorrect.", {
      current: ["Current password is incorrect."],
    });
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.next });
  if (error) return actionError(error.message);

  return { ok: true, data: null };
}
