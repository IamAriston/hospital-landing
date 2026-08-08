import { test, expect } from "@playwright/test";
import {
  loginAsAdmin,
  createAppointmentViaApi,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "./helpers";

const hasCreds = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

test.describe("Command search", () => {
  test.skip(!hasCreds, "Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to run");

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("opens as a dialog and closes on escape", async ({ page }) => {
    await page.getByRole("button", { name: "Search" }).click();
    const dialog = page.getByRole("dialog", { name: /search/i });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("searchbox")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("action item opens the register-patient panel", async ({ page }) => {
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("searchbox").fill("register patient");
    await page.getByRole("button", { name: /register patient/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/patients/);
    await expect(
      page.getByRole("heading", { name: /register new patient/i }),
    ).toBeVisible();
  });

  test("navigation item jumps to a section", async ({ page }) => {
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("searchbox").fill("doctor roster");
    await page.getByRole("button", { name: /doctor roster/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/doctors/);
    await expect(page.getByText(/doctor roster/i).first()).toBeVisible();
  });

  test("record search finds an appointment and deep-links to it", async ({
    page,
    request,
  }) => {
    const name = `Search Case ${Date.now()}`;
    const ok = await createAppointmentViaApi(request, name);
    expect(ok).toBeTruthy();

    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("searchbox").fill(name);

    const result = page.getByRole("button", { name: new RegExp(name) });
    await expect(result).toBeVisible({ timeout: 10_000 });
    await result.click();

    await expect(page).toHaveURL(/\/dashboard\/appointments\?q=/);
    await expect(page.getByText(name).first()).toBeVisible();
  });
});
