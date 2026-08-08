import { test, expect } from "@playwright/test";
import {
  unlock,
  createAppointmentViaApi,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "./helpers";

const hasCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

test.describe("Dashboard notifications", () => {
  test.skip(!hasCreds, "Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to run");

  test.beforeEach(async ({ page }) => {
    await unlock(page);
    await page.goto("/login");
    await page.getByPlaceholder("reception@asthahospital.in").fill(ADMIN_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /sign in to dashboard/i }).click();
    await page.waitForURL(/\/dashboard/);
  });

  test("bell shows an unread badge when a new appointment is created", async ({
    page,
    request,
  }) => {
    await page.goto("/dashboard/opd");
    // Wait for the provider's first (silent) poll to establish a baseline.
    await page.waitForTimeout(3000);

    const created = await createAppointmentViaApi(request, "E2E Realtime Patient");
    expect(created, "appointment created via REST").toBeTruthy();

    // Bell badge should appear within a couple of poll cycles (poll = 20s).
    const badge = page.locator('[aria-label*="unread"]');
    await expect(badge).toBeVisible({ timeout: 45_000 });

    // Opening the bell reveals the new appointment as a link to its page.
    await page.getByRole("button", { name: /notifications/i }).click();
    await expect(
      page.getByRole("link", { name: /E2E Realtime Patient/ }),
    ).toBeVisible();
  });

  test("OPD board shows a live/auto status indicator", async ({ page }) => {
    await page.goto("/dashboard/opd");
    await expect(page.getByText(/live|auto-refresh/i).first()).toBeVisible();
  });
});
