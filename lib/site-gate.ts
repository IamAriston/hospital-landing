/**
 * Shopify-style site password gate.
 *
 * A single shared password (SITE_PASSWORD) locks the entire site behind a
 * `/password` unlock page. On success we store an httpOnly cookie whose value
 * is a SHA-256 token derived from the password — never the password itself.
 *
 * This module is intentionally dependency-free and uses only Web Crypto so it
 * can run in BOTH the edge runtime (proxy.ts) and the Node runtime (server
 * action). Do not import `node:*` here.
 */

export const GATE_COOKIE = "aastha_site_access";

/** Path that is always reachable without unlocking. */
export const UNLOCK_PATH = "/password";

/** Derive a stable, non-reversible token from the password. */
export async function computeGateToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`aastha-site-gate::v1::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string comparison to avoid leaking timing information. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Whether the gate is switched on at all (no password ⇒ open site). */
export function isGateEnabled(): boolean {
  return Boolean(process.env.SITE_PASSWORD && process.env.SITE_PASSWORD.length > 0);
}
