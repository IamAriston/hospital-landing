import { z } from "zod";

/** matches the slug CHECK in schema.sql: ^[a-z0-9]+(?:-[a-z0-9]+)*$ */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and dashes only");

/** 10-digit Indian phone, optional +91, optional spaces/hyphens. */
export const phoneSchema = z
  .string()
  .trim()
  .min(10, "Phone must be at least 10 digits")
  .regex(/^[+\d][\d\s\-+]+$/, "Invalid phone number");

export const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initialsFrom(name: string, max = 2): string {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((s) => s[0]!.toUpperCase())
    .join("");
}
