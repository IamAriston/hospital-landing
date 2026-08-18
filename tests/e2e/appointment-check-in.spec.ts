import { test, expect, type APIRequestContext } from "@playwright/test";
import { readFileSync } from "node:fs";
import { loginAsAdmin } from "./helpers";

/**
 * End-to-end for the booking → check-in → confirm → patient-record link flow.
 *
 * Runs against the configured Supabase project. Does NOT require migration 008
 * (families / guardian / rate-limit): it exercises a single new patient, which
 * works on the base schema. Creates data via the public REST endpoint and
 * cleans it up with the service-role key at the end.
 */

function serviceEnv() {
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
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    service: process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

const tag = Date.now().toString().slice(-7);
const NAME = `E2E Checkin ${tag}`;
const PHONE = `+91 98${tag}0`; // unique-ish, valid per phoneSchema

async function insertBooking(request: APIRequestContext) {
  const { url, anon } = serviceEnv();
  const today = new Date().toISOString().slice(0, 10);
  const res = await request.post(`${url}/rest/v1/appointments`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    data: {
      patient_name: NAME,
      patient_phone: PHONE,
      preferred_date: today,
      time_slot: "Morning",
      status: "new",
    },
  });
  expect(res.ok(), `booking insert failed: ${res.status()} ${await res.text()}`).toBeTruthy();
}

async function cleanup(request: APIRequestContext) {
  const { url, service } = serviceEnv();
  if (!service) return;
  const headers = { apikey: service, Authorization: `Bearer ${service}` };
  await request.delete(`${url}/rest/v1/appointments?patient_phone=eq.${encodeURIComponent(PHONE)}`, { headers });
  await request.delete(`${url}/rest/v1/patients?phone=eq.${encodeURIComponent(PHONE)}`, { headers });
}

test.describe("Appointment → patient check-in flow", () => {
  test.afterAll(async ({ request }) => {
    await cleanup(request);
  });

  test("booking is checked in, links a patient, confirms, and shows in history", async ({
    page,
    request,
  }) => {
    // 1. A patient books from the landing page (public REST insert).
    await insertBooking(request);

    // 2. Staff open the dashboard appointments board.
    await loginAsAdmin(page);
    await page.goto("/dashboard/appointments");

    // Show all dates, then filter to our booking.
    await page.getByRole("button", { name: "All", exact: true }).first().click();
    await page.getByPlaceholder("Search patient…").fill(NAME);

    const row = page.getByRole("row", { name: new RegExp(NAME) });
    await expect(row).toBeVisible();
    await row.click();

    // 3. Drawer: it's unlinked, and "Confirm" is not directly selectable.
    await expect(page.getByText("Not registered yet")).toBeVisible();
    const checkInBtn = page.getByRole("button", { name: /check in & register patient/i });
    await expect(checkInBtn).toBeVisible();

    // 4. Check in — new patient. Required fields: age, gender, blood group.
    await checkInBtn.click();
    const form = page.locator('form:has-text("Check in — new patient")');
    await expect(form).toBeVisible();

    // Name + phone are prefilled from the booking.
    await expect(form.getByPlaceholder("As per ID proof")).toHaveValue(NAME);
    await form.getByPlaceholder("e.g. 34").fill("30");
    await form.getByRole("button", { name: "Male", exact: true }).click();

    // Blood group (Radix select) — open and pick O+.
    await form.getByRole("combobox").click();
    await page.getByRole("option", { name: "O+", exact: true }).click();

    await form.getByRole("button", { name: /check in & confirm/i }).click();

    // 5. Confirmation toast.
    await expect(page.getByText("Checked in & confirmed")).toBeVisible();

    // 6. The patient now exists and carries the appointment in its history.
    await page.goto("/dashboard/patients");
    await page.getByPlaceholder(/Search name, phone/i).fill(NAME);
    const pRow = page.getByRole("row", { name: new RegExp(NAME) });
    await expect(pRow).toBeVisible();
    await pRow.click();

    // Drawer shows the "Last Appointment" block + a "View all" link.
    await expect(page.getByText("Last Appointment")).toBeVisible();
    const viewAll = page.getByRole("link", { name: /view all/i });
    await expect(viewAll).toBeVisible();

    // 7. "View all" deep-links to the patient-filtered appointments board.
    await viewAll.click();
    await expect(page).toHaveURL(/\/dashboard\/appointments\?patient=/);
    await expect(page.getByText(/showing appointments for/i)).toBeVisible();
    // The patient's confirmed appointment shows in the filtered board.
    await expect(page.getByRole("row", { name: new RegExp(NAME) })).toBeVisible();
  });
});
