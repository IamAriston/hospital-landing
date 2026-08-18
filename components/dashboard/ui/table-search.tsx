"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTableQuery } from "@/hooks/use-table-query";
import { cn } from "@/lib/utils";

interface TableSearchProps {
  placeholder?: string;
  /** URL param the term is written to. Default "q". */
  paramKey?: string;
  className?: string;
}

/**
 * Debounced search box bound to a URL search param, for server-side filtering.
 * Local state keeps typing snappy; the URL (and therefore the server query) is
 * updated ~300ms after the user stops. Stays in sync when the param is cleared
 * elsewhere (e.g. a Clear button).
 */
export function TableSearch({ placeholder, paramKey = "q", className }: TableSearchProps) {
  const { get, setParams } = useTableQuery();
  const urlValue = get(paramKey) ?? "";
  const [value, setValue] = React.useState(urlValue);

  // Adopt external changes (Clear, deep links) without clobbering active typing.
  React.useEffect(() => {
    setValue(urlValue);
  }, [urlValue]);

  // Push debounced changes to the URL.
  React.useEffect(() => {
    if (value === urlValue) return;
    const t = setTimeout(() => setParams({ [paramKey]: value || null }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={cn("relative flex-1 min-w-[200px] max-w-[420px]", className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-text-mute pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[38px] pl-9 pr-3.5 border border-dash-border rounded-lg bg-dash-surface text-[13.5px] text-dash-text placeholder:text-dash-text-mute outline-none focus:border-brand-teal transition-all"
      />
    </div>
  );
}
