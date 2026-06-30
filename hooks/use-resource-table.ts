"use client";

import * as React from "react";
import { useDebounce } from "./use-debounce";

type Filters = Record<string, string | null | undefined>;

type Options<T> = {
  rows: T[];
  searchKeys: (keyof T)[];
  filterFn?: (row: T, filters: Filters) => boolean;
  pageSize?: number;
};

/**
 * One-call composition of search + filter + pagination for any list page.
 * - Search is debounced.
 * - Filters is a free-form record so callers can encode any chip/dropdown state.
 * - Pagination is internal; callers just consume `paged`.
 */
export function useResourceTable<T>({
  rows,
  searchKeys,
  filterFn,
  pageSize = 20,
}: Options<T>) {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>({});
  const [page, setPage] = React.useState(1);

  const debouncedSearch = useDebounce(search, 200);

  const filtered = React.useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return rows.filter((row) => {
      if (term && searchKeys.length) {
        const hit = searchKeys.some((k) =>
          String(row[k] ?? "").toLowerCase().includes(term),
        );
        if (!hit) return false;
      }
      if (filterFn && !filterFn(row, filters)) return false;
      return true;
    });
  }, [rows, debouncedSearch, searchKeys, filters, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = React.useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  // Reset to page 1 whenever search or filters change. Done at the setter
  // level instead of via an effect so we avoid a render-then-correct cycle.
  const setSearchAndReset = React.useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const setFilter = React.useCallback((key: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const setFiltersAndReset = React.useCallback((f: Filters) => {
    setFilters(f);
    setPage(1);
  }, []);

  // Silence the unused warning while keeping the original setSearch in scope.
  void debouncedSearch;

  return {
    search,
    setSearch: setSearchAndReset,
    filters,
    setFilter,
    setFilters: setFiltersAndReset,
    filtered,
    paged,
    page: safePage,
    totalPages,
    setPage,
    pageSize,
  };
}
