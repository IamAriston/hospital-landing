"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ColumnDef<T> = {
  key: string;
  header: React.ReactNode;
  /** Render the cell. Defaults to the value of row[key]. */
  cell?: (row: T) => React.ReactNode;
  /** Tailwind class for the cell + header (e.g. "w-32 text-right"). */
  className?: string;
  /** Whether this column is sortable client-side. */
  sortKey?: (row: T) => string | number;
};

type Props<T> = {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  className,
}: Props<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const sortedRows = React.useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortKey) return rows;
    const arr = [...rows];
    arr.sort((a, b) => {
      const av = col.sortKey!(a);
      const bv = col.sortKey!(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [rows, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  if (rows.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        {empty ?? "No records yet."}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-dash-border">
            {columns.map((col) => {
              const active = sortKey === col.key;
              const sortable = !!col.sortKey;
              return (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500",
                    sortable && "cursor-pointer select-none hover:text-slate-700",
                    col.className,
                  )}
                  onClick={sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {sortable && (
                      <span className="text-[10px] text-slate-400">
                        {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-dash-border last:border-b-0",
                onRowClick && "cursor-pointer hover:bg-dash-surface-3 transition-colors",
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-4 py-3 text-slate-700", col.className)}>
                  {col.cell ? col.cell(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
