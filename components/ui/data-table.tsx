"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  keyExtractor: (row: T) => string | number;
}

function DataTable<T>({
  data,
  columns,
  pageSize = 10,
  emptyMessage = "No records found.",
  className,
  rowClassName,
  onRowClick,
  loading,
  keyExtractor,
}: DataTableProps<T>) {
  const { page, totalPages, canPrev, canNext, prev, next, from, to } = usePagination({
    total: data.length,
    pageSize,
  });

  const pageData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={cn("text-xs font-semibold uppercase tracking-wide", col.headerClassName)}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-sm">
                  Loading…
                </TableCell>
              </TableRow>
            ) : pageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground text-sm">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageData.map((row) => (
                <TableRow
                  key={keyExtractor(row)}
                  className={cn(onRowClick && "cursor-pointer", rowClassName?.(row))}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className={cn("py-3", col.className)}>
                      {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > pageSize && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
          <span>
            Showing {from}–{to} of {data.length}
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" onClick={prev} disabled={!canPrev} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 tabular-nums">
              {page} / {totalPages}
            </span>
            <Button variant="outline" size="icon" onClick={next} disabled={!canNext} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };
