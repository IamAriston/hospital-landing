"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "@/lib/db/paginate";
import { useTableQuery } from "@/hooks/use-table-query";
import { DashSelect } from "@/components/dashboard/ui/filter-bar";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
}

/** Windowed page numbers, e.g. 1 … 4 5 [6] 7 8 … 20. */
function pageWindow(current: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < totalPages - 1) out.push("…");
  out.push(totalPages);
  return out;
}

export function Pagination({ page, pageSize, total }: PaginationProps) {
  const { setParams } = useTableQuery();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const goPage = (p: number) =>
    setParams({ page: p <= 1 ? null : String(p) }, { resetPage: false });

  const btn =
    "inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg border border-dash-border bg-dash-surface text-[13px] font-medium text-dash-text transition-colors disabled:opacity-40 disabled:pointer-events-none hover:border-brand-teal hover:text-brand-teal";

  return (
    <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
      <div className="flex items-center gap-2 text-[13px] text-dash-text-mute">
        <div className="flex items-center gap-1.5">
          <span>Rows</span>
          <DashSelect
            value={String(pageSize)}
            onValueChange={(v) => setParams({ pageSize: v })}
            options={PAGE_SIZE_OPTIONS.map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            className="h-8 data-[size=default]:h-8 min-w-0 w-[68px]"
          />
        </div>
        <span className="ml-1 tabular-nums">
          {from}–{to} of {total}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={btn}
          disabled={current <= 1}
          onClick={() => goPage(current - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pageWindow(current, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-dash-text-mute text-[13px]">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => goPage(p)}
              className={cn(
                btn,
                p === current &&
                  "border-brand-teal bg-brand-teal text-white hover:text-white",
              )}
              aria-current={p === current ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          className={btn}
          disabled={current >= totalPages}
          onClick={() => goPage(current + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
