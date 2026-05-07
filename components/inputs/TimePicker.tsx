"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";

interface TimePickerProps {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  placeholder?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

function parseTime(val: string): { hour: number; minute: string; period: "AM" | "PM" } {
  const m = val.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (m) return { hour: parseInt(m[1]), minute: m[2].padStart(2, "0"), period: m[3].toUpperCase() as "AM" | "PM" };
  return { hour: 9, minute: "00", period: "AM" };
}

export default function TimePicker({
  value,
  onChange,
  hasError,
  placeholder = "Pick time",
}: TimePickerProps) {
  const init = value ? parseTime(value) : { hour: 9, minute: "00", period: "AM" as const };
  const [hour, setHour] = useState(init.hour);
  const [minute, setMinute] = useState(init.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(init.period);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hrRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);

  const commit = (h: number, m: string, p: "AM" | "PM") => onChange(`${h}:${m} ${p}`);

  const pickHour = (h: number) => { setHour(h); commit(h, minute, period); };
  const pickMinute = (m: string) => { setMinute(m); commit(hour, m, period); };
  const pickPeriod = (p: "AM" | "PM") => { setPeriod(p); commit(hour, minute, p); };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll selected items into view when dropdown opens
  useEffect(() => {
    if (!open) return;
    hrRef.current?.querySelector("[data-selected]")?.scrollIntoView({ block: "center" });
    minRef.current?.querySelector("[data-selected]")?.scrollIntoView({ block: "center" });
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
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
        <Icon name="clock" size={15} stroke={2} className="text-slate-400 shrink-0" />
        <span className={cn("flex-1 text-left", value ? "text-navy" : "text-slate-400")}>
          {value || placeholder}
        </span>
        <Icon
          name="chevron"
          size={15}
          stroke={2.2}
          className={cn("text-slate-400 transition-transform duration-200 shrink-0", open && "rotate-180")}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-[0_12px_40px_-10px_rgba(12,35,64,.18)] overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_12px_1fr_52px] border-b border-slate-100">
            <div className="py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">HR</div>
            <div />
            <div className="py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">MIN</div>
            <div />
          </div>

          <div className="grid grid-cols-[1fr_12px_1fr_52px]">
            {/* Hours */}
            <div ref={hrRef} className="overflow-y-auto max-h-52 scrollbar-thin">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  data-selected={hour === h ? true : undefined}
                  onClick={() => pickHour(h)}
                  className={cn(
                    "w-full py-2.5 text-center text-[14px] font-semibold font-display transition-colors",
                    hour === h ? "bg-sky-500 text-white" : "text-navy hover:bg-slate-50",
                  )}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Colon */}
            <div className="flex items-start justify-center pt-[52px] text-slate-300 font-bold text-base select-none">:</div>

            {/* Minutes */}
            <div ref={minRef} className="overflow-y-auto max-h-52 scrollbar-thin">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  data-selected={minute === m ? true : undefined}
                  onClick={() => pickMinute(m)}
                  className={cn(
                    "w-full py-2.5 text-center text-[14px] font-semibold font-display transition-colors",
                    minute === m ? "bg-sky-500 text-white" : "text-navy hover:bg-slate-50",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* AM / PM */}
            <div className="flex flex-col border-l border-slate-100">
              {(["AM", "PM"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => pickPeriod(p)}
                  className={cn(
                    "flex-1 text-[13px] font-bold font-display transition-colors",
                    period === p
                      ? "bg-sky-400 text-white"
                      : "text-slate-500 hover:bg-slate-50",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
