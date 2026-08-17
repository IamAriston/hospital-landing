"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAuth, actionError } from "./_helpers";
import type { ActionResult } from "@/types/database";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Uploaded files live under <project>/assets, outside public/. They are served
// back through app/assets/[...path]/route.ts.
const ASSETS_ROOT = path.join(process.cwd(), "assets");

/**
 * Given a public URL previously returned by this action (e.g.
 * `/assets/2026/08/doctors/uuid.jpg`), recover the relative path within the
 * assets root. Returns null when the URL isn't one of ours or escapes the root,
 * so callers fall back to a fresh upload instead of overwriting something else.
 */
function relPathFromUrl(url: string): string | null {
  const clean = url.split("?")[0]; // drop any cache-busting query
  if (!clean.startsWith("/assets/")) return null;
  const rel = clean.slice("/assets/".length);
  const abs = path.resolve(ASSETS_ROOT, rel);
  // Guard against traversal — the resolved path must stay inside ASSETS_ROOT.
  if (abs !== ASSETS_ROOT && !abs.startsWith(ASSETS_ROOT + path.sep)) return null;
  return rel;
}

export async function uploadImage(
  formData: FormData,
): Promise<ActionResult<{ url: string; path: string }>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth.result;

  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null) ?? "doctors";
  // When replacing an existing image, the caller passes the current public URL
  // so we overwrite the same file in place rather than orphaning a new one.
  const replaceUrl = (formData.get("replaceUrl") as string | null) ?? null;

  if (!(file instanceof File)) return actionError("No file provided.");
  if (file.size > MAX_BYTES) return actionError("File must be 5 MB or smaller.");
  if (!ALLOWED.includes(file.type)) return actionError("Only JPG, PNG, WebP, or GIF.");

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "") || "doctors";
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";

  // Overwrite the existing file when replacing; otherwise mint a fresh
  // assets/YYYY/MM/<folder>/uuid.ext path.
  const existingRel = replaceUrl ? relPathFromUrl(replaceUrl) : null;
  let relPath: string;
  if (existingRel) {
    relPath = existingRel;
  } else {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    relPath = `${year}/${month}/${safeFolder}/${crypto.randomUUID()}.${ext}`;
  }

  const absPath = path.join(ASSETS_ROOT, relPath);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await mkdir(path.dirname(absPath), { recursive: true });
    await writeFile(absPath, buffer); // truncates → true overwrite on replace
  } catch (err) {
    return actionError(
      err instanceof Error ? err.message : "Could not save the file.",
    );
  }

  // On overwrite the path is unchanged, so add a version query to bust any
  // browser / next-image cache and to give the DB a distinct value to store.
  const base = `/assets/${relPath}`;
  const url = existingRel ? `${base}?v=${Date.now()}` : base;

  return { ok: true, data: { url, path: relPath } };
}
