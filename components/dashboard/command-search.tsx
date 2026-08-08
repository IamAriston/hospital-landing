"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Users,
  Building2,
  Settings,
  Globe,
  UserPlus,
  CalendarPlus,
  Activity,
  Phone,
  CornerDownLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { globalSearch, type SearchResults } from "@/lib/actions/search";

type Item = {
  key: string;
  label: string;
  sub?: string;
  href: string;
  icon: React.ElementType;
  group: string;
};

const ACTIONS: Item[] = [
  // Navigate
  { key: "nav-overview", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Go to" },
  { key: "nav-appts", label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays, group: "Go to" },
  { key: "nav-opd", label: "Today's OPD", href: "/dashboard/opd", icon: Activity, group: "Go to" },
  { key: "nav-patients", label: "Patient Records", href: "/dashboard/patients", icon: Users, group: "Go to" },
  { key: "nav-doctors", label: "Doctor Roster", href: "/dashboard/doctors", icon: Stethoscope, group: "Go to" },
  { key: "nav-depts", label: "Departments", href: "/dashboard/departments", icon: Building2, group: "Go to" },
  { key: "nav-settings", label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Go to" },
  { key: "nav-public", label: "Public website", href: "/", icon: Globe, group: "Go to" },
  // Create (boards open their panel on ?action=new)
  { key: "act-patient", label: "Register patient", sub: "Add a new patient record", href: "/dashboard/patients?action=new", icon: UserPlus, group: "Actions" },
  { key: "act-appt", label: "New appointment", sub: "Book a walk-in / consultation", href: "/dashboard/appointments?action=new", icon: CalendarPlus, group: "Actions" },
  { key: "act-doctor", label: "Add doctor", sub: "Add to the roster", href: "/dashboard/doctors?action=new", icon: Stethoscope, group: "Actions" },
  { key: "act-dept", label: "Add department", sub: "Create a department", href: "/dashboard/departments?action=new", icon: Building2, group: "Actions" },
];

function buildRecordItems(r: SearchResults): Item[] {
  const items: Item[] = [];
  for (const p of r.patients) {
    items.push({
      key: `pat-${p.id}`,
      label: p.name,
      sub: p.phone,
      href: `/dashboard/patients?q=${encodeURIComponent(p.name)}`,
      icon: Users,
      group: "Patients",
    });
  }
  for (const d of r.doctors) {
    items.push({
      key: `doc-${d.id}`,
      label: d.name,
      sub: d.specialty,
      href: `/dashboard/doctors?q=${encodeURIComponent(d.name)}`,
      icon: Stethoscope,
      group: "Doctors",
    });
  }
  for (const dep of r.departments) {
    items.push({
      key: `dep-${dep.id}`,
      label: dep.name,
      href: `/dashboard/departments?q=${encodeURIComponent(dep.name)}`,
      icon: Building2,
      group: "Departments",
    });
  }
  for (const a of r.appointments) {
    items.push({
      key: `apt-${a.id}`,
      label: a.patient_name,
      sub: `Appointment · ${a.status}`,
      href: `/dashboard/appointments?q=${encodeURIComponent(a.patient_name)}`,
      icon: Phone,
      group: "Appointments",
    });
  }
  return items;
}

/* ── Topbar trigger + Ctrl/Cmd+K to open ────────────────────────────────── */
export function CommandSearch() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        aria-keyshortcuts="Control+K"
        className="flex-1 max-w-[520px] flex items-center gap-2 py-[10px] pl-[42px] pr-[10px] relative bg-dash-surface-3 border border-transparent rounded-[10px] text-[14px] text-dash-text-mute text-left transition-colors duration-[150ms] hover:border-dash-border cursor-text"
      >
        <Search
          size={17}
          className="absolute left-[14px] top-1/2 -translate-y-1/2 text-dash-text-mute pointer-events-none"
        />
        <span className="flex-1 truncate">Search or jump to…</span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-[11px] font-semibold text-dash-text-mute bg-dash-surface border border-dash-border rounded px-1.5 py-0.5">
          Ctrl K
        </kbd>
      </button>

      {open && <CommandDialog onClose={() => setOpen(false)} />}
    </>
  );
}

/* ── The modal dialog ───────────────────────────────────────────────────── */
function CommandDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const debounced = useDebounce(query, 250);

  const matchedActions = React.useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return ACTIONS;
    return ACTIONS.filter(
      (a) => a.label.toLowerCase().includes(t) || a.sub?.toLowerCase().includes(t),
    );
  }, [query]);

  const recordItems = React.useMemo(
    () => (results ? buildRecordItems(results) : []),
    [results],
  );

  const items = React.useMemo(
    () => [...matchedActions, ...recordItems],
    [matchedActions, recordItems],
  );

  // Lock body scroll + focus input while the dialog is open.
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const t = debounced.trim();
    if (t.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    globalSearch(t).then((res) => {
      if (cancelled) return;
      setResults(res.ok ? res.data : null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  React.useEffect(() => setActive(0), [items.length]);

  // Keep the active row scrolled into view.
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function go(item: Item | undefined) {
    if (!item) return;
    onClose();
    router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  // Group items in render order while keeping a flat index for keyboard nav.
  let flatIndex = -1;
  const groups: { name: string; items: { item: Item; index: number }[] }[] = [];
  for (const item of items) {
    flatIndex++;
    const last = groups[groups.length - 1];
    if (last && last.name === item.group) {
      last.items.push({ item, index: flatIndex });
    } else {
      groups.push({ name: item.group, items: [{ item, index: flatIndex }] });
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onKeyDown={onKeyDown}
    >
      {/* Backdrop — covers the entire viewport incl. the sidebar */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[4px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-[640px] bg-dash-surface border border-dash-border rounded-2xl shadow-[0_24px_70px_-12px_rgba(0,0,0,.45)] ring-1 ring-black/5 overflow-hidden">
        {/* Search field */}
        <div className="flex items-center gap-3 px-4 border-b border-dash-border">
          <Search size={19} className="text-dash-text-mute shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, doctors, appointments — or jump to a page…"
            autoComplete="off"
            name="dash-search"
            role="searchbox"
            className="flex-1 py-4 bg-transparent outline-none text-[15px] text-dash-text placeholder:text-dash-text-mute"
          />
          {loading && (
            <span className="w-4 h-4 border-2 border-dash-border border-t-brand-teal rounded-full animate-spin shrink-0" />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 p-1.5 rounded-md text-dash-text-mute hover:text-dash-text hover:bg-dash-surface-3"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-1.5">
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13.5px] text-dash-text-mute">
              {loading ? "Searching…" : "No matches found."}
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.name} className="px-2">
                <div className="px-2.5 pt-2.5 pb-1 text-[10.5px] font-bold uppercase tracking-[.1em] text-dash-text-mute">
                  {group.name}
                </div>
                {group.items.map(({ item, index }) => (
                  <button
                    key={item.key}
                    data-index={index}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item)}
                    className={cn(
                      "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left transition-colors",
                      index === active ? "bg-dash-surface-3" : "hover:bg-dash-surface-3",
                    )}
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                      <item.icon size={17} strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-dash-text truncate">
                        {item.label}
                      </div>
                      {item.sub && (
                        <div className="text-[12.5px] text-dash-text-mute truncate">
                          {item.sub}
                        </div>
                      )}
                    </div>
                    {index === active && (
                      <CornerDownLeft size={15} className="text-dash-text-mute shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2.5 border-t border-dash-border flex items-center gap-4 text-[11.5px] text-dash-text-mute">
          <span className="flex items-center gap-1">
            <kbd className="bg-dash-surface-3 border border-dash-border rounded px-1">↑</kbd>
            <kbd className="bg-dash-surface-3 border border-dash-border rounded px-1">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-dash-surface-3 border border-dash-border rounded px-1">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-dash-surface-3 border border-dash-border rounded px-1">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
