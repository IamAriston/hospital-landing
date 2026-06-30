import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Astha Hospital",
    template: "%s — Astha Hospital",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  return (
    <DashboardShell
      profile={
        profile
          ? { fullName: profile.full_name, role: profile.role }
          : null
      }
    >
      {children}
    </DashboardShell>
  );
}
