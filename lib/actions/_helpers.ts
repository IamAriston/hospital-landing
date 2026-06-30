import "server-only";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import type { ActionResult } from "@/types/database";

/** Wraps zod validation + auth gate for an admin server action. */
export async function requireAuth(): Promise<
  { ok: true; userId: string } | { ok: false; result: ActionResult<never> }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      result: { ok: false, error: "You must be signed in to do that." },
    };
  }
  return { ok: true, userId: user.id };
}

/** Maps a ZodError into the fieldErrors shape expected by ActionResult. */
export function zodFieldErrors<T>(err: z.ZodError<T>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = [];
    out[key].push(issue.message);
  }
  return out;
}

export function actionError(message: string, fieldErrors?: Record<string, string[]>): ActionResult<never> {
  return { ok: false, error: message, fieldErrors };
}
