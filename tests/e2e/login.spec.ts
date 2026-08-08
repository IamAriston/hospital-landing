import { test, expect } from "@playwright/test";
import { unlock } from "./helpers";

test.describe("Admin login", () => {
  test.beforeEach(async ({ page }) => {
    await unlock(page);
  });

  test("login page renders email + password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder("reception@asthahospital.in")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in to dashboard/i })).toBeVisible();
  });

  test("invalid credentials show an error and stay on /login", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("reception@asthahospital.in").fill("nobody@example.com");
    await page.getByPlaceholder("Enter your password").fill("wrong-password-123");
    await page.getByRole("button", { name: /sign in to dashboard/i }).click();
    await expect(page.getByText(/invalid|incorrect|credentials|error/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated dashboard access redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
