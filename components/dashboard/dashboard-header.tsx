"use client";

import * as React from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  Search,
  Plus,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  Calendar,
  User,
  BedDouble,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

interface DashboardTopbarProps {
  collapsed: boolean;
  onCollapse: () => void;
  dark: boolean;
  setDark: (v: boolean | ((prev: boolean) => boolean)) => void;
}

const NEW_MENU = [
  { icon: Calendar,  label: "New Appointment", sub: "Book a consultation", href: "/dashboard/appointments" },
  { icon: User,      label: "Register Patient", sub: "Add a new patient",   href: "/dashboard/patients" },
  { icon: BedDouble, label: "Admit Patient",    sub: "Allocate a bed",      href: "/dashboard" },
  { icon: Upload,    label: "Upload Lab Report",sub: "Attach to patient",   href: "/dashboard" },
];

const iconBtnCls =
  "w-[38px] h-[38px] rounded-[9px] bg-dash-surface border border-dash-border text-dash-text-dim flex items-center justify-center cursor-pointer transition-[border-color,color] duration-[150ms] relative hover:border-dash-border-strong hover:text-dash-text";

export function DashboardTopbar({ collapsed, onCollapse, dark, setDark }: DashboardTopbarProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-dash-topbar-bg backdrop-blur-[14px] border-b border-dash-border px-7 h-[68px] flex items-center gap-[18px] transition-colors duration-[250ms] ease-in-out shrink-0">
      {/* Collapse toggle */}
      <button
        onClick={onCollapse}
        title="Toggle sidebar"
        className="w-9 h-9 rounded-[9px] flex items-center justify-center text-dash-text-dim border border-dash-border bg-dash-surface cursor-pointer transition-[border-color,color] duration-[150ms] hover:border-dash-border-strong hover:text-dash-text"
      >
        <PanelLeftClose
          size={18}
          className={cn("transition-transform duration-[220ms]", collapsed ? "-scale-x-100" : "")}
        />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-[520px] relative">
        <Search
          size={17}
          className="absolute left-[14px] top-1/2 -translate-y-1/2 text-dash-text-mute pointer-events-none"
        />
        <input
          placeholder="Search patients, doctors, appointments…"
          autoComplete="off"
          name="dash-search"
          role="searchbox"
          className="w-full py-[11px] pr-[60px] pl-[42px] bg-dash-surface-3 border border-transparent rounded-[10px] outline-none text-[14px] text-dash-text transition-[border-color,background-color] duration-[150ms] focus:border-brand-teal focus:bg-dash-surface"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-[10px]">
        {/* New dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex items-center gap-[7px] px-[14px] py-[9px] bg-grad-teal text-white rounded-[9px] font-semibold text-[13.5px] font-display cursor-pointer transition-[opacity,transform] duration-[150ms] border-none shadow-[0_2px_8px_rgba(13,148,136,.28),inset_0_-1px_0_rgba(0,0,0,.08)] hover:opacity-90 hover:-translate-y-[1px]"
          >
            <Plus size={16} strokeWidth={2.4} />
            <span>New</span>
            <ChevronDown size={14} strokeWidth={2.2} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] bg-dash-surface border border-dash-border rounded-xl shadow-pop min-w-[240px] p-[6px] z-50">
              {NEW_MENU.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-[10px] rounded-[9px] no-underline transition-colors duration-[150ms] hover:bg-dash-surface-3"
                >
                  <div className="w-[34px] h-[34px] rounded-lg bg-brand-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                    <item.icon size={17} strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col leading-[1.2]">
                    <span className="text-dash-text text-[13.5px] font-semibold">{item.label}</span>
                    <span className="text-dash-text-mute text-[12px]">{item.sub}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-dash-border mx-1" />

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          title={dark ? "Light mode" : "Dark mode"}
          className={iconBtnCls}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        {/* <button title="Notifications" className={iconBtnCls}>
          <Bell size={17} />
          <span className="absolute top-2 right-[9px] w-2 h-2 rounded-full bg-brand-red border-2 border-dash-topbar-bg" />
        </button> */}

        {/* User pill */}
        {/* <div
          title="Account"
          className="flex items-center gap-[10px] pl-[5px] pr-[10px] py-[5px] border border-dash-border rounded-full bg-dash-surface cursor-pointer transition-[border-color] duration-[150ms] hover:border-dash-border-strong"
        >
          <div className="w-[30px] h-[30px] rounded-full bg-[linear-gradient(135deg,#F59E0B,#DC2626)] text-white flex items-center justify-center font-display font-bold text-[12.5px]">
            RN
          </div>
          <div className="flex flex-col leading-[1.1] pr-1">
            <span className="text-[11px] text-dash-text-mute font-medium">{getGreeting()}</span>
            <span className="text-[13px] text-dash-text font-semibold">Reena</span>
          </div>
          <ChevronDown size={14} className="text-dash-text-mute mr-1" />
        </div> */}
      </div>
    </header>
  );
}

/* Keep backward-compat export for any existing import */
export { DashboardTopbar as DashboardHeader };
