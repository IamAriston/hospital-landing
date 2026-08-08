"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  GATE_COOKIE,
  computeGateToken,
  isGateEnabled,
  safeEqual,
} from "@/lib/site-gate";

export type UnlockState = { error?: string };

/** Keep redirect targets on-site to avoid open-redirect abuse. */
function safeNext(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function unlockSite(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  // Gate disabled → nothing to unlock.
  if (!isGateEnabled()) redirect("/");

  const entered = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/"));

  if (!entered) return { error: "Please enter the password." };

  const expected = await computeGateToken(process.env.SITE_PASSWORD as string);
  const provided = await computeGateToken(entered);

  if (!safeEqual(provided, expected)) {
    return { error: "Incorrect password. Please try again." };
  }

  const jar = await cookies();
  // Session cookie (no maxAge/expires) — cleared when the browser is closed,
  // so visitors are asked for the password again each time they reopen the site.
  jar.set(GATE_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect(next);
}
