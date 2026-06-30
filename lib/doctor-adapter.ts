import type { DoctorRow, Schedule } from "@/types/database";

const TONE_PALETTE = [
  { tone: "from-sky-100", toneBg: "bg-sky-100" },
  { tone: "from-teal-100", toneBg: "bg-teal-100" },
  { tone: "from-amber-100", toneBg: "bg-amber-100" },
  { tone: "from-rose-100", toneBg: "bg-rose-100" },
  { tone: "from-violet-100", toneBg: "bg-violet-100" },
  { tone: "from-green-100", toneBg: "bg-green-100" },
  { tone: "from-indigo-100", toneBg: "bg-indigo-100" },
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Maps a database doctor row into the props expected by the existing
 * landing-page DoctorCard component. Avatar tone is derived deterministically
 * from the row id so it stays stable across renders.
 */
export function doctorRowToCardProps(
  row: DoctorRow,
  departmentName: string | null,
): {
  name: string;
  spec: string;
  dept: string;
  yrs: number;
  rating: number;
  schedule: Schedule;
  initial: string;
  tone: string;
  toneBg: string;
} {
  const palette = TONE_PALETTE[hashCode(row.id) % TONE_PALETTE.length];
  return {
    name: row.name,
    spec: row.specialty,
    dept: departmentName ?? "—",
    yrs: row.years_experience,
    rating: Number(row.rating),
    schedule:
      row.schedule ?? { days: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 },
    initial: row.initials,
    tone: palette.tone,
    toneBg: palette.toneBg,
  };
}
