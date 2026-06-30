"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";

export type DashboardProfile = { fullName: string; role: string } | null;

export function DashboardShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: DashboardProfile;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [dark, setDark] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("astha-dark") === "1";
      setDark(saved);
    } catch {}
  }, []);

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    try {
      localStorage.setItem("astha-dark", dark ? "1" : "0");
    } catch {}
  }, [dark]);

  return (
    <div
      className={cn(
        "grid min-h-screen bg-dash-bg transition-[grid-template-columns] duration-[220ms] ease-in-out",
        collapsed ? "grid-cols-[72px_1fr]" : "grid-cols-[244px_1fr]",
      )}
    >
      <AppSidebar collapsed={collapsed} pathname={pathname} profile={profile ?? null} />

      <div className="flex flex-col min-w-0 overflow-hidden">
        <DashboardTopbar
          collapsed={collapsed}
          onCollapse={() => setCollapsed((c) => !c)}
          dark={dark}
          setDark={setDark}
        />
        <main className="flex-1 overflow-y-auto bg-dash-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
