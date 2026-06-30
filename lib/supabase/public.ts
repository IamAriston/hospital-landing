import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anon-key client without cookies. RLS still applies — only data exposed by
 * `public_read_*` policies is visible. Use for landing-page reads that do not
 * depend on the current user.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
