// Pure, environment-agnostic pagination helpers + constants. Deliberately NOT
// marked "server-only": the client <Pagination> component imports
// PAGE_SIZE_OPTIONS from here, so this module must be safe in both bundles.

/** Selectable page sizes for dashboard tables. */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

export type Paginated<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
};

type SP = Record<string, string | string[] | undefined>;

/** First value of a (possibly repeated) search param. */
export function firstParam(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.length > 0 ? s : undefined;
}

/** Parse + clamp `page` and `pageSize` from route search params. */
export function parsePageParams(sp: SP): { page: number; pageSize: number } {
  const sizeRaw = Number(firstParam(sp.pageSize));
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(sizeRaw)
    ? sizeRaw
    : DEFAULT_PAGE_SIZE;
  const pageRaw = Number(firstParam(sp.page));
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  return { page, pageSize };
}

/** Supabase `.range()` bounds for a 1-based page. */
export function rangeFor(page: number, pageSize: number): { from: number; to: number } {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}

/**
 * Sanitise a free-text term for use inside a PostgREST `or(...ilike...)` filter,
 * where commas and parentheses are structural. Returns undefined when empty.
 */
export function sanitizeSearch(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const s = raw.replace(/[,()%*]/g, " ").trim();
  return s.length > 0 ? s : undefined;
}
