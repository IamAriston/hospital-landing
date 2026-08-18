import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Lowercase, trimmed, single-spaced — for comparing person names loosely. */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * True when two names are the "same person" for identity-matching purposes.
 * Used to guard against a booking auto-linking to a different patient who
 * merely shares (or was mistyped into) the same phone number.
 */
export function namesMatch(a: string, b: string): boolean {
  return normalizeName(a) === normalizeName(b);
}
