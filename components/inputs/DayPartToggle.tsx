"use client";

import { cn } from "@/lib/cn";

interface DayPartToggleProps {
  options: readonly string[];
  value: string;
  onChange: (val: string) => void;
}

export default function DayPartToggle({ options, value, onChange }: DayPartToggleProps) {
  return (
    <div className="flex gap-1.5 h-11">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 rounded-xl border text-[13px] font-semibold font-display",
            "transition-all duration-150 cursor-pointer",
            value === opt
              ? "border-teal-600 bg-teal-600 text-white shadow-sm"
              : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-navy",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
