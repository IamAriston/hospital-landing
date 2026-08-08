import { test, expect } from "@playwright/test";
import { unlock, expectNoErrorPage } from "./helpers";

test.describe("Public site navigation", () => {
  test.beforeEach(async ({ page }) => {
    await unlock(page);
  });

  const pages = [
    { path: "/", name: "Home" },
    { path: "/doctors", name: "Doctors" },
    { path: "/departments", name: "Departments" },
    { path: "/services", name: "Services" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
    { path: "/patients", name: "Patients" },
    { path: "/patients/labs", name: "Labs" },
    { path: "/patients/portal", name: "Portal" },
    { path: "/patients/feedback", name: "Feedback" },
    { path: "/blog", name: "Blog" },
  ];

  for (const p of pages) {
    test(`${p.name} page loads without errors`, async ({ page }) => {
      const res = await page.goto(p.path);
      expect(res?.status(), `HTTP status for ${p.path}`).toBeLessThan(400);
      await expectNoErrorPage(page);
      await expect(page.locator("h1").first()).toBeVisible();
    });
  }

  test("unknown routes render the 404 page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});
