"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import Icon from "@/components/ui/Icon";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  hasError?: boolean;
  className?: string;
}

export default function SelectField({
  value,
  onChange,
  options,
  placeholder,
  hasError,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll selected option into view when dropdown opens
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector("[data-selected]")?.scrollIntoView({ block: "nearest" });
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full h-11 pl-4 pr-3 rounded-xl border bg-white text-[14.5px] font-sans",
          "flex items-center gap-2 transition-[border-color,box-shadow] duration-150",
          "hover:border-slate-400",
          hasError ? "border-red-400 bg-red-50/40" : "border-slate-300",
          open && "border-sky-500 shadow-input-focus",
        )}
      >
        <span className={cn("flex-1 text-left truncate", selected ? "text-navy" : "text-slate-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <Icon
          name="chevron"
          size={15}
          stroke={2.2}
          className={cn("text-slate-400 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-popover overflow-hidden"
        >
          <div className="overflow-y-auto max-h-52 scrollbar-thin py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                data-selected={opt.value === value ? true : undefined}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-[14px] font-sans transition-colors flex items-center justify-between",
                  opt.value === value
                    ? "bg-sky-50 text-sky-700 font-semibold"
                    : "text-navy hover:bg-slate-50",
                )}
              >
                {opt.label}
                {opt.value === value && (
                  <Icon name="check" size={14} stroke={2.5} className="text-sky-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
