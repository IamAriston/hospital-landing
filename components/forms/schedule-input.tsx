"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/types/database";

const DAYS = [
  { idx: 1, label: "Mon" },
  { idx: 2, label: "Tue" },
  { idx: 3, label: "Wed" },
  { idx: 4, label: "Thu" },
  { idx: 5, label: "Fri" },
  { idx: 6, label: "Sat" },
  { idx: 0, label: "Sun" },
];

interface ScheduleInputProps {
  value: Schedule | null;
  onChange: (next: Schedule | null) => void;
  label?: string;
  className?: string;
  error?: string;
}

const DEFAULT: Schedule = { days: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 };

export function ScheduleInput({
  value,
  onChange,
  label = "Schedule",
  className,
  error,
}: ScheduleInputProps) {
  const current = value ?? DEFAULT;
  const enabled = value !== null;

  function toggleDay(d: number) {
    const days = current.days.includes(d)
      ? current.days.filter((x) => x !== d)
      : [...current.days, d].sort((a, b) => a - b);
    onChange({ ...current, days });
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-dash-text">{label}</label>
        <label className="text-xs text-dash-text-mute inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked ? DEFAULT : null)}
            className="accent-teal-600"
          />
          Set schedule
        </label>
      </div>

      {enabled && (
        <div className="flex flex-col gap-3 p-3 border border-dash-border rounded-lg bg-dash-surface-3">
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map((d) => {
              const on = current.days.includes(d.idx);
              return (
                <button
                  key={d.idx}
                  type="button"
                  onClick={() => toggleDay(d.idx)}
                  className={cn(
                    "px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors",
                    on
                      ? "bg-teal-600 border-teal-600 text-white"
                      : "bg-dash-surface border-dash-border text-dash-text-dim hover:border-dash-border-strong hover:text-dash-text",
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs text-dash-text-mute mb-1 block">From</label>
              <input
                type="number"
                min={0}
                max={23}
                value={current.startHour}
                onChange={(e) =>
                  onChange({ ...current, startHour: Number(e.target.value) || 0 })
                }
                className="w-full px-2.5 py-1.5 text-sm border border-dash-border rounded-md bg-dash-surface text-dash-text focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 outline-none"
              />
              <p className="text-[10px] text-dash-text-mute mt-0.5">24h, e.g. 9 = 9 AM</p>
            </div>
            <div className="flex-1">
              <label className="text-xs text-dash-text-mute mb-1 block">To</label>
              <input
                type="number"
                min={1}
                max={24}
                value={current.endHour}
                onChange={(e) =>
                  onChange({ ...current, endHour: Number(e.target.value) || 0 })
                }
                className="w-full px-2.5 py-1.5 text-sm border border-dash-border rounded-md bg-dash-surface text-dash-text focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 outline-none"
              />
              <p className="text-[10px] text-dash-text-mute mt-0.5">24h, e.g. 17 = 5 PM</p>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
