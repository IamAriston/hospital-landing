"use client";

import { useMemo, useState } from "react";

interface UsePaginationOptions {
  total: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({ total, pageSize = 10, initialPage = 1 }: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));
  const prev = () => goTo(page - 1);
  const next = () => goTo(page + 1);
  const first = () => goTo(1);
  const last = () => goTo(totalPages);

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return { page, totalPages, pageSize, canPrev, canNext, goTo, prev, next, first, last, from, to };
}
