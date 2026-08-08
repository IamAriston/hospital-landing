// Creates (or ensures) a confirmed admin user for E2E tests.
// Usage: node scripts/create-test-user.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const email =
  process.env.TEST_ADMIN_EMAIL || env.TEST_ADMIN_EMAIL || "e2e-admin@aastha.local";
const password =
  process.env.TEST_ADMIN_PASSWORD || env.TEST_ADMIN_PASSWORD || "E2eTest!2026";

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  if (/already been registered|already exists/i.test(error.message)) {
    console.log(`User already exists: ${email}`);
    process.exit(0);
  }
  console.error("ERROR:", error.message);
  process.exit(1);
}

console.log(`Created user ${email} (${data.user.id})`);
