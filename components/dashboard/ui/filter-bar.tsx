import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface DashSelectProps {
  options: ChipOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Filter-bar select built on the design-system Radix Select so it matches the
 * form selects. When a `placeholder` is given it's exposed as an "all" option
 * (the shared convention for "no filter") and shown as the trigger label.
 */
export function DashSelect({
  options,
  placeholder,
  value,
  onValueChange,
  disabled,
  className,
}: DashSelectProps) {
  // Expose the placeholder as the shared "all" option, unless the caller
  // already supplied one.
  const hasAll = options.some((o) => o.value === "all");
  const allOptions =
    placeholder && !hasAll
      ? [{ value: "all", label: placeholder }, ...options]
      : options;

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-[38px] data-[size=default]:h-[38px] min-w-[160px] rounded-lg border-dash-border bg-dash-surface py-0 text-[13px] font-medium text-dash-text focus-visible:border-brand-teal focus-visible:ring-0",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allOptions.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ClearBtnProps {
  onClick: () => void;
  /** Only render when at least one filter is active. Defaults to true. */
  show?: boolean;
}

export function ClearBtn({ onClick, show = true }: ClearBtnProps) {
  if (!show) return null;
  return (
    <button
      className="ml-auto inline-flex items-center gap-1 text-[13.5px] font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all"
      onClick={onClick}
    >
      ✕ Clear
    </button>
  );
}
