"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "./use-debounce";

interface UseTableFilterOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  initialSearch?: string;
}

export function useTableFilter<T>({ data, searchKeys, initialSearch = "" }: UseTableFilterOptions<T>) {
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 250);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return data;
    const q = debouncedSearch.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key];
        return typeof val === "string" && val.toLowerCase().includes(q);
      })
    );
  }, [data, debouncedSearch, searchKeys]);

  return { search, setSearch, filtered };
}
