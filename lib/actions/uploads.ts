"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth, actionError } from "./_helpers";
import type { ActionResult } from "@/types/database";

const BUCKET = "assets";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadImage(
  formData: FormData,
): Promise<ActionResult<{ url: string; path: string }>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null) ?? "uploads";

  if (!(file instanceof File)) return actionError("No file provided.");
  if (file.size > MAX_BYTES) return actionError("File must be 5 MB or smaller.");
  if (!ALLOWED.includes(file.type)) return actionError("Only JPG, PNG, WebP, or GIF.");

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "");
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${safeFolder}/${crypto.randomUUID()}.${ext}`;

  const supabase = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return actionError(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { ok: true, data: { url: publicUrl, path } };
}
