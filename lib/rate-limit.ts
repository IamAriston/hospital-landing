import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const LIMIT = Number(process.env.BOOKING_RATE_LIMIT ?? 5);
const WINDOW_MIN = Number(process.env.BOOKING_RATE_WINDOW_MIN ?? 10);

/** Best-effort client IP from proxy headers. Falls back to "unknown". */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Sliding-window rate limit for public bookings, keyed by IP and backed by the
 * `booking_attempts` table. Returns true when the request is allowed (and logs
 * the attempt); false when the IP has hit the limit within the window.
 *
 * Fails open: if the store is unavailable we allow the booking rather than
 * block a real patient over an infra hiccup.
 */
export async function allowBooking(ip: string): Promise<boolean> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();

  const { count, error } = await supabase
    .from("booking_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);

  if (error) return true; // fail open
  if ((count ?? 0) >= LIMIT) return false;

  await supabase.from("booking_attempts").insert({ ip });
  return true;
}
