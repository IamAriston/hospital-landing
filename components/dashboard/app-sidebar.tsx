"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Calendar,
  Clock,
  Users,
  Stethoscope,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NAV: Array<{
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  exact?: boolean;
  badge?: number;
}> = [
  { href: "/dashboard",              label: "Dashboard",       icon: LayoutGrid,   exact: true },
  { href: "/dashboard/appointments", label: "Appointments",    icon: Calendar },
  { href: "/dashboard/opd",          label: "Today's OPD",     icon: Clock },
  { href: "/dashboard/patients",     label: "Patient Records", icon: Users },
  { href: "/dashboard/doctors",      label: "Doctor Roster",   icon: Stethoscope },
  { href: "/dashboard/departments",  label: "Departments",     icon: Building2 },
];

interface AppSidebarProps {
  collapsed: boolean;
  pathname: string;
  profile: { fullName: string; role: string } | null;
}

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "U";
}

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
};

function isActive(href: string, exact: boolean, pathname: string) {
  return exact ? pathname === href : pathname.startsWith(href);
}

const sideNavLinkCls = (active: boolean, collapsed: boolean) =>
  cn(
    "flex items-center rounded-[9px] no-underline whitespace-nowrap transition-all duration-[150ms] ease-in-out relative text-[14px]",
    collapsed ? "gap-0 justify-center p-[10px]" : "gap-3 justify-start px-3 py-[10px]",
    active
      ? "bg-dash-sidebar-active text-white font-semibold shadow-[0_0_0_1px_rgba(56,189,248,.12),0_4px_12px_rgba(14,165,233,.08)]"
      : "bg-transparent text-dash-sidebar-text font-medium hover:bg-[rgba(255,255,255,.05)] hover:text-white hover:translate-x-[2px]",
  );

const popoverItemCls =
  "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] text-dash-sidebar-text no-underline hover:bg-[rgba(255,255,255,.06)] hover:text-white transition-colors";

export function AppSidebar({ collapsed, pathname, profile }: AppSidebarProps) {
  const fullName = profile?.fullName?.trim() || "Astha User";
  const initials = initialsFromName(fullName);
  const role = profile?.role ? ROLE_LABEL[profile.role] ?? profile.role : "Staff";
  return (
    <aside
      className={cn(
        "bg-dash-sidebar-bg text-dash-sidebar-text flex flex-col sticky top-0 h-screen z-30",
        "transition-[padding] duration-[220ms] ease-in-out overflow-x-hidden overflow-y-auto",
        "border-r border-[rgba(255,255,255,.06)]",
        collapsed ? "px-[10px] pt-[18px] pb-[14px]" : "px-[14px] pt-[18px] pb-[14px]",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center px-[6px] pt-[6px] pb-1 mb-[18px] overflow-hidden",
          collapsed ? "gap-0 justify-center" : "gap-[11px] justify-start",
        )}
      >
        <div className="w-9 h-9 rounded-[10px] shrink-0 bg-[linear-gradient(135deg,#38BDF8,#14B8A6)] flex items-center justify-center text-white font-display font-extrabold text-[18px] shadow-[0_0_16px_rgba(56,189,248,.35),inset_0_-2px_0_rgba(0,0,0,.18)]">
          A
        </div>
        {!collapsed && (
          <div>
            <div className="font-display text-white font-extrabold text-[18px] leading-[1.05] whitespace-nowrap">
              Astha
            </div>
            <div className="text-[10.5px] text-[#7DD3FC] uppercase tracking-[.14em] mt-0.5 whitespace-nowrap">
              Staff Portal
            </div>
          </div>
        )}
      </div>

      {/* Main nav label */}
      {!collapsed && (
        <div className="text-[11px] text-[#64748B] uppercase tracking-[.14em] font-bold mx-3 mt-[18px] mb-2">
          Main
        </div>
      )}

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact ?? false, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={sideNavLinkCls(active, collapsed)}
            >
              {active && (
                <span className="absolute -left-[14px] top-2 bottom-2 w-[3px] bg-[linear-gradient(180deg,#38BDF8,#14B8A6)] rounded-r-[3px]" />
              )}

              <item.icon
                size={19}
                strokeWidth={1.8}
                className={cn("shrink-0", active ? "text-[#5EEAD4]" : "text-[#94A3B8]")}
              />

              {!collapsed && <span>{item.label}</span>}

              {item.badge && !collapsed && (
                <span className="ml-auto bg-brand-teal text-white text-[11px] font-bold px-[7px] py-[2px] rounded-full min-w-5 text-center">
                  {item.badge}
                </span>
              )}

              {item.badge && collapsed && (
                <span className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full bg-brand-teal" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card with popover for sign out (and settings when collapsed) */}
      <Popover>
        <div
          className={cn(
            "mt-auto bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.06)] rounded-xl flex items-center overflow-hidden",
            collapsed ? "p-2 justify-center" : "p-2 pr-1.5 gap-1 justify-start",
          )}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              title={collapsed ? fullName : undefined}
              className={cn(
                "flex items-center text-left rounded-lg transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/60",
                "hover:bg-[rgba(255,255,255,.04)]",
                collapsed ? "p-0 justify-center" : "flex-1 min-w-0 gap-[10px] px-1.5 py-1 -mx-1.5 -my-1",
              )}
            >
              <div className="w-9 h-9 rounded-full shrink-0 bg-[linear-gradient(135deg,#F59E0B,#DC2626)] text-white font-bold text-[13px] flex items-center justify-center font-display">
                {initials}
              </div>
              {!collapsed && (
                <div className="flex flex-col leading-[1.1] min-w-0 flex-1">
                  <span className="text-white text-[13.5px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                    {fullName}
                  </span>
                  <span className="text-[#94A3B8] text-[11.5px] mt-1 whitespace-nowrap">
                    {role}
                  </span>
                </div>
              )}
            </button>
          </PopoverTrigger>

          {!collapsed && (
            <Link
              href="/dashboard/settings"
              title="Settings"
              aria-label="Settings"
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-[rgba(255,255,255,.06)] hover:text-white transition-colors"
            >
              <Settings size={17} strokeWidth={1.8} />
            </Link>
          )}
        </div>

        <PopoverContent
          side="top"
          align="end"
          sideOffset={8}
          className="w-[200px] p-1.5 bg-dash-sidebar-bg border border-[rgba(255,255,255,.08)] ring-0 shadow-[0_10px_30px_rgba(0,0,0,.45)]"
        >
          {collapsed && (
            <Link href="/dashboard/settings" className={popoverItemCls}>
              <Settings size={16} strokeWidth={1.8} className="text-[#94A3B8]" />
              <span>Settings</span>
            </Link>
          )}
          <form action="/logout" method="post">
            <button type="submit" className={cn(popoverItemCls, "w-full")}>
              <LogOut size={16} strokeWidth={1.8} className="text-[#94A3B8]" />
              <span>Sign Out</span>
            </button>
          </form>
        </PopoverContent>
      </Popover>
    </aside>
  );
}
