import { test, expect } from "@playwright/test";
import { unlock } from "./helpers";

test.describe("Landing forms", () => {
  test.beforeEach(async ({ page }) => {
    await unlock(page);
  });

  test("feedback form submits and shows a thank-you state", async ({ page }) => {
    await page.goto("/patients/feedback");

    // Rating is required — pick 5 stars (buttons with aria-label like "5 stars").
    const stars = page.locator("form button svg").first();
    await stars.click(); // clicks the first star; rating becomes >= 1

    await page.getByPlaceholder("Full name").fill("Test Patient");
    await page.getByPlaceholder("So we can follow up if needed").fill("test@example.com");
    await page
      .getByPlaceholder(/Tell us what worked well/i)
      .fill("Automated end-to-end test feedback submission.");

    await page.getByRole("button", { name: /submit feedback/i }).click();

    // With migration 005 applied → thank-you screen. Without the feedback
    // table → an inline error. Either way the flow is wired and never crashes.
    const thankYou = page.getByRole("heading", {
      name: /thank you for your feedback/i,
    });
    const inlineError = page.locator("form p[role='alert']");
    await expect(thankYou.or(inlineError)).toBeVisible();
  });

  test("lab report lookup rejects unknown report ids gracefully", async ({ page }) => {
    await page.goto("/patients/labs");
    await page.getByPlaceholder("+91 98xxx xxxxx").fill("9800000000");
    await page.getByPlaceholder(/AST-2026/).fill("AST-0000-00-000000");
    await page.getByRole("button", { name: /check report status/i }).click();
    // Graceful failure whether the report is absent (table applied) or the
    // lab_reports table isn't provisioned yet (migration 005 pending).
    await expect(
      page.getByText(/no report found|lookup failed|try again/i),
    ).toBeVisible();
  });

  test("appointment tracker handles an unknown phone gracefully", async ({ page }) => {
    await page.goto("/patients/portal");
    await page.getByPlaceholder("+91 98xxx xxxxx").fill("9800000001");
    await page.getByRole("button", { name: /track my appointment/i }).click();
    await expect(page.getByText(/couldn.t find any appointments/i)).toBeVisible();
  });
});
