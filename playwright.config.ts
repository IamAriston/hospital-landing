import { defineConfig, devices } from "@playwright/test";
import { readFileSync } from "node:fs";

// Load .env.local into the test process (Next loads it for the app, but the
// Playwright runner needs SITE_PASSWORD / TEST_ADMIN_* too).
try {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
} catch {
  /* no .env.local — rely on real env */
}

/**
 * E2E config. Runs the Next dev server automatically and points tests at it.
 * The site password gate is active during tests (SITE_PASSWORD in .env.local),
 * so most specs unlock first via the helper in tests/e2e/helpers.ts.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/password",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
