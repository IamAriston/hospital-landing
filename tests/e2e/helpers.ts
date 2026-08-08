import { type Page, type APIRequestContext, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

/** Read Supabase URL + anon key from .env.local (test process may not have them). */
export function supabaseEnv() {
  try {
    const env = Object.fromEntries(
      readFileSync(".env.local", "utf8")
        .split(/\r?\n/)
        .filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => {
          const i = l.indexOf("=");
          return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
        }),
    );
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "",
      anonKey:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "",
    };
  } catch {
    return { url: "", anonKey: "" };
  }
}

/** Insert an appointment via the public (anon) REST endpoint. Returns ok. */
export async function createAppointmentViaApi(
  request: APIRequestContext,
  patientName: string,
) {
  const { url, anonKey } = supabaseEnv();
  if (!url || !anonKey) return false;
  const today = new Date().toISOString().slice(0, 10);
  const res = await request.post(`${url}/rest/v1/appointments`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    data: {
      patient_name: patientName,
      patient_phone: "+91 90000 00000",
      preferred_date: today,
      time_slot: "Morning",
      status: "new",
    },
  });
  return res.ok();
}

/** Shared site password (matches SITE_PASSWORD in .env.local). */
export const SITE_PASSWORD = process.env.SITE_PASSWORD ?? "aastha2026";

/** Optional real admin credentials for authenticated dashboard tests. */
export const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "";
export const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";

/** Unlock the Shopify-style site gate so the rest of the site is reachable. */
export async function unlock(page: Page) {
  await page.goto("/password");
  await page.getByPlaceholder("Enter password").fill(SITE_PASSWORD);
  await page.getByRole("button", { name: /enter site/i }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/password"));
}

/** Unlock the gate then sign in as the configured admin, landing on /dashboard. */
export async function loginAsAdmin(page: Page) {
  await unlock(page);
  await page.goto("/login");
  await page.getByPlaceholder("reception@asthahospital.in").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("Enter your password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in to dashboard/i }).click();
  await page.waitForURL(/\/dashboard/);
}

/** Assert the current page is not an error / not-found fallback. */
export async function expectNoErrorPage(page: Page) {
  await expect(page.getByText("Something went wrong")).toHaveCount(0);
  await expect(page.getByText("Page not found")).toHaveCount(0);
}
