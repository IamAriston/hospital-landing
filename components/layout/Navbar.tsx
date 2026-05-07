"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { homeConfig } from "@/config/home";
import { navPatientItems } from "@/config/patients";
import { cn } from "@/lib/cn";

const DEPT_ITEMS = homeConfig.departments.map((d) => ({
  label: d.name,
  href: `/departments/${d.slug}`,
  icon: d.icon,
}));

const SERVICE_ITEMS = homeConfig.features.map((f) => ({
  label: f.name,
  href: `/services/${f.slug}`,
  icon: f.icon,
}));

const DROPDOWN_MAP: Record<string, { label: string; href: string; icon: string }[]> = {
  Departments: DEPT_ITEMS,
  Services: SERVICE_ITEMS,
  Patients: navPatientItems,
};

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollToBook = () => {
    const el = document.getElementById("book");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        "bg-white h-17.5 border-b border-slate-200/60 sticky top-0 z-50 transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_rgba(12,35,64,.04),0_6px_24px_rgba(12,35,64,.06)]",
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9.5 h-9.5 rounded-[10px] bg-linear-to-br from-teal-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-lg font-display shadow-[inset_0_-2px_0_rgba(12,35,64,.12)]">
            A
          </div>
          <div className="flex flex-col leading-[1.05]">
            <span className="text-teal-600 font-extrabold text-[22px] font-display tracking-tight">
              Astha
            </span>
            <span className="text-navy text-[11px] font-medium uppercase tracking-[0.12em] mt-0.5">
              Multi Speciality Hospital
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {siteConfig.nav.map((item) => {
            const dropItems = item.caret ? DROPDOWN_MAP[item.label] : null;
            const isOpen = activeDropdown === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => dropItems && setActiveDropdown(item.label)}
                onMouseLeave={() => dropItems && setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-[14.5px] font-medium text-navy px-3 py-2.5 rounded-lg hover:bg-sky-50 hover:text-teal-700 transition-colors",
                    isOpen && "bg-sky-50 text-teal-700",
                  )}
                >
                  {item.label}
                  {item.caret && (
                    <Icon
                      name="chevron"
                      size={14}
                      stroke={2.2}
                      className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                    />
                  )}
                </Link>

                {/* Dropdown panel */}
                {isOpen && dropItems && (
                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-10px_rgba(12,35,64,.18)] overflow-hidden",
                      item.label === "Departments" ? "w-[500px]" : "w-56",
                    )}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[.14em]">
                        {item.label}
                      </span>
                      <Link
                        href={item.href}
                        className="text-[12px] font-semibold text-teal-600 hover:underline flex items-center gap-1"
                      >
                        View All <Icon name="arrowSmall" size={12} stroke={2.5} />
                      </Link>
                    </div>
                    <div
                      className={cn(
                        "p-2",
                        item.label === "Departments" && "grid grid-cols-2",
                      )}
                    >
                      {dropItems.map((drop) => (
                        <Link
                          key={drop.href}
                          href={drop.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <Icon name={drop.icon as IconName} size={14} stroke={1.8} />
                          </div>
                          <span className="text-[13.5px] font-medium text-navy group-hover:text-teal-700 leading-tight">
                            {drop.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors font-display">
            <Icon name="siren" size={16} stroke={2} />
            Emergency
          </button>
          <button
            onClick={scrollToBook}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-sky-400 text-[#04293F] hover:bg-sky-500 transition-colors font-display"
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-navy"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <Icon name={mobileOpen ? "close" : "menu"} size={24} />
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-5 pb-5 flex flex-col max-h-[80vh] overflow-y-auto">
          {siteConfig.nav.map((item) => {
            const dropItems = item.caret ? DROPDOWN_MAP[item.label] : null;
            const isExpanded = mobileExpanded === item.label;
            return (
              <div key={item.label}>
                <div className="flex items-center border-b border-slate-100">
                  <Link
                    href={item.href}
                    className="flex-1 py-3 px-2 text-navy font-medium text-[15px]"
                    onClick={() => !dropItems && setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {dropItems && (
                    <button
                      className="p-2 text-slate-400"
                      onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                    >
                      <Icon
                        name="chevron"
                        size={15}
                        stroke={2}
                        className={cn("transition-transform duration-200", isExpanded && "rotate-180")}
                      />
                    </button>
                  )}
                </div>
                {isExpanded && dropItems && (
                  <div className="bg-slate-50 rounded-xl mx-1 my-1.5 overflow-hidden">
                    {dropItems.map((drop) => (
                      <Link
                        key={drop.href}
                        href={drop.href}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon name={drop.icon as IconName} size={15} stroke={1.8} className="text-teal-600" />
                        <span className="text-[13.5px] font-medium text-navy">{drop.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex gap-2.5 mt-4">
            <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold border border-red-600 text-red-600 font-display">
              <Icon name="siren" size={16} /> Emergency
            </button>
            <button
              onClick={scrollToBook}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-sky-400 text-[#04293F] font-display"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
