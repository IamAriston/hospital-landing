import * as React from "react";
import { cn } from "@/lib/utils";

interface ChipOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  children?: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "bg-dash-surface border border-dash-border rounded-2xl shadow-card mb-[18px] flex items-center gap-3.5 flex-wrap p-[14px_18px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ChipRowProps {
  options: ChipOption[];
  value: string;
  onChange: (v: string) => void;
}

export function ChipRow({ options, value, onChange }: ChipRowProps) {
  return (
    <div className="dash-chip-row">
      {options.map((o) => (
        <button
          key={o.value}
          className={cn("dash-chip", value === o.value && "active")}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface DashSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: ChipOption[];
  placeholder?: string;
}

export function DashSelect({
  options,
  placeholder,
  className,
  ...props
}: DashSelectProps) {
  return (
    <select
      className={cn(
        "px-3 py-[7px] rounded-lg border border-dash-border bg-dash-surface text-[13px] font-medium text-dash-text cursor-pointer outline-none focus:border-brand-teal",
        className,
      )}
      {...props}
    >
      {placeholder && <option value="all">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

interface ClearBtnProps {
  onClick: () => void;
}

export function ClearBtn({ onClick }: ClearBtnProps) {
  return (
    <button
      className="ml-auto text-[13.5px] font-semibold text-dash-text-dim hover:text-dash-text px-2.5 py-1.5 rounded-lg hover:bg-dash-surface-3 transition-all"
      onClick={onClick}
    >
      ✕ Clear
    </button>
  );
}
