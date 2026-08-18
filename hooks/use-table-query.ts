"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * URL-search-param state for server-paginated dashboard tables. Filters, search
 * and page all live in the query string so the server component can fetch the
 * right page. Changing any filter resets to page 1.
 */
export function useTableQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = React.useCallback(
    (updates: Record<string, string | null>, opts?: { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      // Any filter/search change invalidates the current page number.
      if (opts?.resetPage !== false) params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const get = React.useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  return { get, setParams, searchParams };
}
