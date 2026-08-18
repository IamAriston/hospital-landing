import { test, expect, type APIRequestContext } from "@playwright/test";
import { readFileSync } from "node:fs";
import { unlock } from "./helpers";

/**
 * Public booking rate limit (5 per 10 min per IP).
 *
 * Requires migration 008 (booking_attempts table). Probes for the table and
 * SKIPS cleanly when it isn't present, so it never false-fails pre-migration.
 */

function env() {
  const e = Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      }),
  );
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || e.NEXT_PUBLIC_SUPABASE_URL || "",
    service: process.env.SUPABASE_SERVICE_ROLE_KEY || e.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

const tag = Date.now().toString().slice(-7);
const NAME = `E2E RateLimit ${tag}`;
const PHONE_DIGITS = "9812345670";

async function hasBookingAttempts(request: APIRequestContext) {
  const { url, service } = env();
  const res = await request.get(`${url}/rest/v1/booking_attempts?limit=1`, {
    headers: { apikey: service, Authorization: `Bearer ${service}` },
  });
  return res.ok();
}

async function submitBooking(page: import("@playwright/test").Page) {
  const form = page.locator('form:has-text("Patient Details")');
  await form.getByPlaceholder("Your full name").fill(NAME);
  await form.getByPlaceholder("98885 45809").fill(PHONE_DIGITS);
  // Custom date popup: the trigger's accessible name includes its icon, so
  // match by text. Then pick today's day (today is selectable) within the form.
  await form.locator('button:has-text("Pick a date")').click();
  const day = String(new Date().getDate());
  await form.getByRole("button", { name: day, exact: true }).first().click();
  await form.getByRole("button", { name: /^book appointment$/i }).click();
}

test.describe("Booking rate limit", () => {
  test.afterAll(async ({ request }) => {
    const { url, service } = env();
    const headers = { apikey: service, Authorization: `Bearer ${service}` };
    await request.delete(`${url}/rest/v1/appointments?patient_phone=eq.${encodeURIComponent("+91 " + PHONE_DIGITS)}`, { headers });
    await request.delete(`${url}/rest/v1/booking_attempts?ip=in.(unknown,::1,127.0.0.1)`, { headers });
  });

  test("the 6th booking within the window is rejected", async ({ page, request }) => {
    test.skip(!(await hasBookingAttempts(request)), "Requires migration 008 (booking_attempts table). Apply it, then re-run.");

    await unlock(page);
    await page.goto("/#book");

    // 5 allowed submissions.
    for (let i = 0; i < 5; i++) {
      await submitBooking(page);
      await expect(page.getByRole("heading", { name: /appointment requested/i })).toBeVisible();
      await page.getByRole("button", { name: /book another/i }).click();
    }

    // 6th is blocked by the limiter.
    await submitBooking(page);
    await expect(page.getByText(/too many booking attempts/i)).toBeVisible();
  });
});
