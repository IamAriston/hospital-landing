import { test, expect } from "@playwright/test";
import { SITE_PASSWORD } from "./helpers";

test.describe("Site password gate", () => {
  test("locked visitors are redirected to /password", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/");
    await expect(page).toHaveURL(/\/password/);
    await expect(
      page.getByRole("heading", { name: /password protected/i }),
    ).toBeVisible();
  });

  test("wrong password shows an error and stays on /password", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/password");
    await page.getByPlaceholder("Enter password").fill("definitely-wrong");
    await page.getByRole("button", { name: /enter site/i }).click();
    await expect(page.locator("#site-password-error")).toContainText(/incorrect password/i);
    await expect(page).toHaveURL(/\/password/);
  });

  test("correct password unlocks the site", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/password");
    await page.getByPlaceholder("Enter password").fill(SITE_PASSWORD);
    await page.getByRole("button", { name: /enter site/i }).click();
    await page.waitForURL((url) => !url.pathname.startsWith("/password"));
    await expect(page).toHaveURL(/localhost:3000\/?$/);
  });

  test("gated deep links redirect back after unlock", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/doctors");
    await expect(page).toHaveURL(/\/password\?next=%2Fdoctors/);
    await page.getByPlaceholder("Enter password").fill(SITE_PASSWORD);
    await page.getByRole("button", { name: /enter site/i }).click();
    await expect(page).toHaveURL(/\/doctors$/);
  });
});
