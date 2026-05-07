// 0 = Sunday, 1 = Monday, …, 6 = Saturday
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const FULL  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export type Schedule = {
  days: number[];     // 0–6
  startHour: number;  // 24-h, e.g. 9
  endHour: number;    // 24-h, e.g. 14 (exclusive)
};

function fmtHour(h: number): string {
  if (h === 0)  return "12 AM";
  if (h < 12)   return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

/** Compress sorted day array into readable string.
 *  [1,2,3,4,5,6] → "Mon to Sat"
 *  [1,3,5]       → "Mon, Wed, Fri"
 *  [2,4]         → "Tue & Thu"
 */
function fmtDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length >= 3) {
    let consecutive = true;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) { consecutive = false; break; }
    }
    if (consecutive) return `${SHORT[sorted[0]]} to ${SHORT[sorted[sorted.length - 1]]}`;
  }
  if (sorted.length === 2 && sorted[1] === sorted[0] + 1) {
    return `${SHORT[sorted[0]]} & ${SHORT[sorted[1]]}`;
  }
  return sorted.map((d) => SHORT[d]).join(", ");
}

/** "Mon, Wed, Fri — 9 AM to 2 PM" */
export function formatOpd(s: Schedule): string {
  if (!s?.days) return "By appointment";
  return `${fmtDays(s.days)} — ${fmtHour(s.startHour)} to ${fmtHour(s.endHour)}`;
}

/** Is right now within this schedule? (day + hour) */
export function isOpenNow(s: Schedule): boolean {
  if (!s?.days) return false;
  const now  = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  return s.days.includes(now.getDay()) && hour >= s.startHour && hour < s.endHour;
}

/** Does this schedule run today at all, regardless of current hour? */
export function isAvailableToday(s: Schedule): boolean {
  if (!s?.days) return false;
  return s.days.includes(new Date().getDay());
}

/** "Available Today" | "Next: Wednesday" */
export function availabilityLabel(s: Schedule): string {
  if (!s?.days) return "By Appointment";
  const today = new Date().getDay();
  if (s.days.includes(today)) return "Available Today";
  for (let i = 1; i <= 7; i++) {
    const d = (today + i) % 7;
    if (s.days.includes(d)) return `Next: ${FULL[d]}`;
  }
  return "By Appointment";
}
