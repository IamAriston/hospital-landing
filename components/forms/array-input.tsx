"use client";

import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArrayInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

/**
 * Chip-style editor for string[] fields (conditions, procedures, equipment, etc.).
 * Add by typing + Enter or clicking +. Remove via the X on each chip.
 */
export function ArrayInput({
  value,
  onChange,
  label,
  placeholder = "Type and press Enter",
  className,
  error,
}: ArrayInputProps) {
  const [draft, setDraft] = React.useState("");

  function commit() {
    const v = draft.trim();
    if (!v) return;
    if (value.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...value, v]);
    setDraft("");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-[13px] font-semibold text-dash-text">{label}</label>
      )}
      <div
        className={cn(
          "min-h-[42px] flex flex-wrap gap-1.5 px-2 py-1.5 border rounded-lg bg-dash-surface",
          error
            ? "border-red-300 dark:border-red-800"
            : "border-dash-border focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 dark:focus-within:ring-teal-900/40",
        )}
      >
        {value.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-1 rounded-md border border-teal-100 dark:bg-teal-900/30 dark:border-teal-800/40 dark:text-teal-300"
          >
            {item}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${item}`}
              className="text-teal-600 dark:text-teal-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value.length - 1);
            }
          }}
          placeholder={value.length ? "" : placeholder}
          className="flex-1 min-w-[120px] px-1 py-1 text-sm text-dash-text placeholder:text-dash-text-mute outline-none bg-transparent"
        />
        {draft && (
          <button
            type="button"
            onClick={commit}
            aria-label="Add item"
            className="p-1 text-teal-600 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-md"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
