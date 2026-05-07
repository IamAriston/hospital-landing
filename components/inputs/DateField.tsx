"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";

interface DateFieldProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  hasError?: boolean;
  className?: string;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_HEADERS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toYMD(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

function formatDisplay(ymd: string) {
  if (!ymd) return "";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function DateField({ value, onChange, hasError, className }: DateFieldProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value ? parseInt(value.split("-")[0]) : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? parseInt(value.split("-")[1]) - 1 : today.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const todayYMD = toYMD(today);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDay = (day: number) => {
    const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    onChange(ymd);
    setOpen(false);
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0,0,0,0);
    return d < today;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border bg-white text-[14.5px] font-sans",
          "flex items-center gap-2.5 transition-[border-color,box-shadow] duration-150",
          "hover:border-slate-400",
          hasError ? "border-red-400 bg-red-50/40" : "border-slate-300",
          open && "border-sky-500 shadow-[0_0_0_3px_rgba(14,165,233,.15)]",
        )}
      >
        <Icon name="calendar" size={15} stroke={2} className="text-slate-400 shrink-0" />
        <span className={cn("flex-1 text-left", value ? "text-navy" : "text-slate-400")}>
          {value ? formatDisplay(value) : "Pick a date"}
        </span>
        <Icon
          name="chevron"
          size={15}
          stroke={2.2}
          className={cn("text-slate-400 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[280px] bg-white border border-slate-200 rounded-xl shadow-[0_12px_40px_-10px_rgba(12,35,64,.18)] p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Icon name="arrowSmall" size={16} stroke={2.2} className="rotate-180" />
            </button>
            <span className="text-[14px] font-bold text-navy font-display">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Icon name="arrowSmall" size={16} stroke={2.2} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-slate-400 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isSelected = ymd === value;
              const isToday = ymd === todayYMD;
              const past = isPast(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={past}
                  onClick={() => selectDay(day)}
                  className={cn(
                    "h-8 w-full rounded-lg text-[13px] font-medium transition-colors",
                    isSelected && "bg-sky-500 text-white font-bold",
                    !isSelected && isToday && "border border-sky-500 text-sky-600",
                    !isSelected && !isToday && !past && "text-navy hover:bg-slate-100",
                    past && "text-slate-300 cursor-not-allowed",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
