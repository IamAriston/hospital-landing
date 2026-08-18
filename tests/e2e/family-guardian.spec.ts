import { test, expect, type APIRequestContext } from "@playwright/test";
import { readFileSync } from "node:fs";
import { loginAsAdmin } from "./helpers";

/**
 * Family (many patients on one phone) + guardian-name check-in.
 *
 * Requires migration 008 (UNIQUE(phone, name) + guardian_name column). Probes
 * for the guardian_name column and SKIPS cleanly if 008 isn't applied yet.
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
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || e.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    service: process.env.SUPABASE_SERVICE_ROLE_KEY || e.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

const tag = Date.now().toString().slice(-7);
const SOLO_PHONE = `+91 96${tag}0`;
const SOLO = `E2E Guardian ${tag}`;
const GUARDIAN = `E2E Parent Of ${tag}`;
const FAM_PHONE = `+91 97${tag}0`;
const PARENT = `E2E Parent ${tag}`;
const CHILD = `E2E Child ${tag}`;

async function has008(request: APIRequestContext) {
  const { url, service } = env();
  const res = await request.get(`${url}/rest/v1/patients?select=guardian_name&limit=1`, {
    headers: { apikey: service, Authorization: `Bearer ${service}` },
  });
  return res.ok();
}

function svcHeaders(rep = false) {
  const { service } = env();
  const h: Record<string, string> = {
    apikey: service,
    Authorization: `Bearer ${service}`,
    "Content-Type": "application/json",
  };
  if (rep) h.Prefer = "return=representation";
  return h;
}

async function insertBooking(request: APIRequestContext, name: string, phone: string) {
  const { url, anon } = env();
  const today = new Date().toISOString().slice(0, 10);
  const res = await request.post(`${url}/rest/v1/appointments`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    data: { patient_name: name, patient_phone: phone, preferred_date: today, time_slot: "Morning", status: "new" },
  });
  expect(res.ok(), `booking insert failed: ${res.status()} ${await res.text()}`).toBeTruthy();
}

/** Open a booking's check-in panel from the appointments board. */
async function openCheckIn(page: import("@playwright/test").Page, name: string) {
  await page.goto("/dashboard/appointments");
  await page.getByRole("button", { name: "All", exact: true }).first().click();
  await page.getByPlaceholder("Search patient…").fill(name);
  await page.getByRole("row", { name: new RegExp(name) }).click();
  await page.getByRole("button", { name: /check in/i }).click();
}

test.describe("Family identity + guardian", () => {
  test.afterAll(async ({ request }) => {
    const { url } = env();
    for (const p of [SOLO_PHONE, FAM_PHONE]) {
      await request.delete(`${url}/rest/v1/appointments?patient_phone=eq.${encodeURIComponent(p)}`, { headers: svcHeaders() });
      await request.delete(`${url}/rest/v1/patients?phone=eq.${encodeURIComponent(p)}`, { headers: svcHeaders() });
    }
  });

  test("guardian name is captured and saved at check-in", async ({ page, request }) => {
    test.skip(!(await has008(request)), "Requires migration 008 (guardian_name). Apply it, then re-run.");

    await insertBooking(request, SOLO, SOLO_PHONE);
    await loginAsAdmin(page);
    await openCheckIn(page, SOLO);

    // No existing patient on this number → straight to the new-patient form.
    const form = page.locator('form:has-text("Check in — new patient")');
    await expect(form.getByPlaceholder("As per ID proof")).toHaveValue(SOLO);
    await form.getByPlaceholder("e.g. 34").fill("6");
    await form.getByRole("button", { name: "Male", exact: true }).click();
    await form.getByRole("combobox").click();
    await page.keyboard.type("A+");
    await page.keyboard.press("Enter");
    await form.getByLabel("Guardian Name").fill(GUARDIAN);
    await form.getByRole("button", { name: /check in & confirm/i }).click();

    await expect(page.getByText("Checked in & confirmed")).toBeVisible();

    // Guardian persisted on the new patient record.
    const rows = await (
      await request.get(
        `${env().url}/rest/v1/patients?phone=eq.${encodeURIComponent(SOLO_PHONE)}&select=name,guardian_name`,
        { headers: svcHeaders() },
      )
    ).json();
    expect(rows.length).toBe(1);
    expect(rows[0].guardian_name).toBe(GUARDIAN);
  });

  test("one number holds several patients, and check-in offers the family picker", async ({
    page,
    request,
  }) => {
    test.skip(!(await has008(request)), "Requires migration 008 (UNIQUE(phone,name)). Apply it, then re-run.");

    // Two people share the one number — only possible with the composite unique
    // index from migration 008. This asserts the schema change directly.
    const { url } = env();
    const p1 = await request.post(`${url}/rest/v1/patients`, {
      headers: svcHeaders(true),
      data: { name: PARENT, phone: FAM_PHONE, age: 40, sex: "F", blood_group: "O+" },
    });
    expect(p1.ok(), `parent insert failed: ${p1.status()} ${await p1.text()}`).toBeTruthy();
    const p2 = await request.post(`${url}/rest/v1/patients`, {
      headers: svcHeaders(true),
      data: { name: CHILD, phone: FAM_PHONE, age: 8, sex: "M", blood_group: "B+" },
    });
    expect(p2.ok(), `child insert on same number failed (composite unique?): ${p2.status()} ${await p2.text()}`).toBeTruthy();

    const both = await (
      await request.get(`${url}/rest/v1/patients?phone=eq.${encodeURIComponent(FAM_PHONE)}&select=name`, { headers: svcHeaders() })
    ).json();
    expect(both.length).toBe(2);

    // A booking that doesn't name-match either family member → check-in shows
    // the "who is this for?" picker listing the people on the number.
    await insertBooking(request, `E2E Visitor ${tag}`, FAM_PHONE);
    await loginAsAdmin(page);
    await openCheckIn(page, `E2E Visitor ${tag}`);

    await expect(page.getByRole("heading", { name: /who is this appointment for/i })).toBeVisible();
    await expect(page.getByText(PARENT)).toBeVisible();
    await expect(page.getByText(CHILD)).toBeVisible();
    await expect(page.getByRole("button", { name: /new patient on this number/i })).toBeVisible();
  });

  test("picking a family member survives a dashboard refresh and completes check-in", async ({
    page,
    request,
  }) => {
    test.skip(!(await has008(request)), "Requires migration 008. Apply it, then re-run.");

    const { url } = env();
    const REG_PHONE = `+91 98${tag}0`;
    const EXISTING = `E2E Sibling ${tag}`;
    const NEWCOMER = `E2E Newcomer ${tag}`;

    // An existing sibling on the number so the picker appears.
    await request.post(`${url}/rest/v1/patients`, {
      headers: svcHeaders(true),
      data: { name: EXISTING, phone: REG_PHONE, age: 12, sex: "M", blood_group: "O+" },
    });
    await insertBooking(request, NEWCOMER, REG_PHONE);

    await loginAsAdmin(page);
    await openCheckIn(page, NEWCOMER);

    // Pick "new patient", then a fresh booking arrives → dashboard auto-refresh.
    await page.getByRole("button", { name: /new patient on this number/i }).click();
    const form = page.locator('form:has-text("Check in — new patient")');
    await expect(form).toBeVisible();

    await insertBooking(request, `E2E Noise ${tag}`, `+91 93${tag}0`);
    await page.waitForTimeout(3000);

    // Selection survived the refresh — still the new-patient form, not the picker.
    await expect(form).toBeVisible();
    await expect(page.getByRole("heading", { name: /who is this appointment for/i })).toHaveCount(0);

    // Complete check-in for the new sibling.
    await form.getByPlaceholder("e.g. 34").fill("5");
    await form.getByRole("button", { name: "Female", exact: true }).click();
    await form.getByRole("combobox").click();
    await page.keyboard.type("A+");
    await page.keyboard.press("Enter");
    await form.getByRole("button", { name: /check in & confirm/i }).click();
    await expect(page.getByText("Checked in & confirmed")).toBeVisible();

    // Now three people share the number.
    const rows = await (
      await request.get(`${url}/rest/v1/patients?phone=eq.${encodeURIComponent(REG_PHONE)}&select=name`, { headers: svcHeaders() })
    ).json();
    expect(rows.length).toBe(2); // sibling + newcomer

    // cleanup extras
    await request.delete(`${url}/rest/v1/appointments?patient_phone=eq.${encodeURIComponent(REG_PHONE)}`, { headers: svcHeaders() });
    await request.delete(`${url}/rest/v1/appointments?patient_phone=eq.${encodeURIComponent("+91 93" + tag + "0")}`, { headers: svcHeaders() });
    await request.delete(`${url}/rest/v1/patients?phone=eq.${encodeURIComponent(REG_PHONE)}`, { headers: svcHeaders() });
  });
});
