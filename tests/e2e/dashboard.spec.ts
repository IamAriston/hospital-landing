import { test, expect } from "@playwright/test";
import { unlock, ADMIN_EMAIL, ADMIN_PASSWORD } from "./helpers";

// These flows need a real admin account. Provide credentials via
// TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD to enable them.
const hasCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

test.describe("Authenticated dashboard", () => {
  test.skip(!hasCreds, "Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to run dashboard tests");

  test.beforeEach(async ({ page }) => {
    await unlock(page);
    await page.goto("/login");
    await page.getByPlaceholder("reception@asthahospital.in").fill(ADMIN_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in to dashboard/i }).click();
    await page.waitForURL(/\/dashboard/);
  });

  test("overview loads", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("body")).not.toContainText("Couldn't load this page");
  });

  const sections = [
    { path: "/dashboard/patients", text: /patient records/i },
    { path: "/dashboard/doctors", text: /doctor roster/i },
    { path: "/dashboard/departments", text: /departments/i },
    { path: "/dashboard/appointments", text: /appointments/i },
    { path: "/dashboard/opd", text: /today.s opd/i },
    { path: "/dashboard/settings", text: /settings/i },
  ];

  for (const s of sections) {
    test(`${s.path} loads`, async ({ page }) => {
      await page.goto(s.path);
      await expect(page.getByText(s.text).first()).toBeVisible();
    });
  }

  test("register patient panel opens and validates", async ({ page }) => {
    await page.goto("/dashboard/patients");
    await page.getByRole("button", { name: /register patient/i }).click();
    await expect(page.getByRole("heading", { name: /register new patient/i })).toBeVisible();
    // Submitting empty should surface validation, not navigate away.
    await page.getByRole("button", { name: /register patient/i }).last().click();
    await expect(page.getByRole("heading", { name: /register new patient/i })).toBeVisible();
  });
});
