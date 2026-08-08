import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { isGateEnabled } from "@/lib/site-gate";
import { UnlockForm } from "./unlock-form";

export const metadata: Metadata = {
  title: `Enter password — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // If the gate is off, there is nothing to unlock.
  if (!isGateEnabled()) redirect("/");

  const sp = await searchParams;
  const next =
    sp.next && sp.next.startsWith("/") && !sp.next.startsWith("//")
      ? sp.next
      : "/";

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-5 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-sky-400 text-2xl font-extrabold text-white">
              {siteConfig.name.charAt(0)}
            </div>
            <div>
              <p className="text-[15px] font-extrabold leading-tight text-navy">
                {siteConfig.fullName}
              </p>
              <p className="text-[12.5px] text-slate-500">{siteConfig.tagline}</p>
            </div>
          </div>

          <div className="mt-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-teal-700">
              Private preview
            </span>
            <h1 className="mt-3 font-display text-2xl font-extrabold text-navy">
              This site is password protected
            </h1>
            <p className="mt-2 text-[14.5px] leading-relaxed text-slate-500">
              Enter the password to continue. If you need access, please contact
              the Aastha team.
            </p>
          </div>

          <UnlockForm next={next} />
        </div>

        <p className="mt-6 text-center text-[13px] text-slate-500">
          Emergency care is always available —{" "}
          <a
            href={`tel:${siteConfig.emergency}`}
            className="font-semibold text-red-600 hover:underline"
          >
            {siteConfig.emergency}
          </a>
        </p>
      </div>
    </main>
  );
}
