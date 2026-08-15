/**
 * Date helpers.
 *
 * Everything is anchored to Singapore time (UTC+8) and handled as plain
 * `YYYY-MM-DD` strings rather than local `Date` objects. That avoids the
 * server/client timezone drift that would otherwise cause hydration mismatches
 * and off-by-one days for anyone viewing the site from another timezone.
 */

const SG_TIME_ZONE = 'Asia/Singapore';

const ISO_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: SG_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Today in Singapore, as `YYYY-MM-DD`. */
export function todayInSingapore(now: Date = new Date()): string {
  return ISO_FORMATTER.format(now);
}

/** Parse `YYYY-MM-DD` to a UTC-midnight Date — safe for arithmetic and formatting. */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** `YYYY-MM-DD` of a UTC Date. */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Add whole months to an ISO date, clamping the day to the target month's length. */
export function addMonths(iso: string, months: number): string {
  const date = parseISODate(iso);
  const targetDay = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const daysInTarget = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  date.setUTCDate(Math.min(targetDay, daysInTarget));
  return toISODate(date);
}

/** Whole days from `fromISO` to `toISO`. Negative when `toISO` is in the past. */
export function daysBetween(fromISO: string, toISO: string): number {
  const ms = parseISODate(toISO).getTime() - parseISODate(fromISO).getTime();
  return Math.round(ms / 86_400_000);
}

/** `YYYY-MM` — used for month grouping and the "this month" bucket. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

const DAY_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const DAY_NO_YEAR_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
});

const DAY_MONTH_YEAR_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const MONTH_YEAR_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  month: 'long',
  year: 'numeric',
});

/** "Fri, 25 Sep 2026" — or "9 – 11 Oct 2026" / "3 Dec 2026 – 7 Jan 2027" for ranges. */
export function formatDateRange(startISO: string, endISO?: string): string {
  const start = parseISODate(startISO);
  if (!endISO || endISO === startISO) return DAY_FMT.format(start);

  const end = parseISODate(endISO);
  const sameMonth =
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth();

  return sameMonth
    ? `${start.getUTCDate()} – ${DAY_MONTH_YEAR_FMT.format(end)}`
    : `${DAY_NO_YEAR_FMT.format(start)} – ${DAY_MONTH_YEAR_FMT.format(end)}`;
}

/** "September 2026" — section headers and month dividers. */
export function formatMonthYear(iso: string): string {
  return MONTH_YEAR_FMT.format(parseISODate(iso));
}

/** Compact date chip: `{ day: "25", month: "SEP" }`. */
export function dateChip(iso: string): { day: string; month: string } {
  const date = parseISODate(iso);
  return {
    day: String(date.getUTCDate()),
    month: new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'short' })
      .format(date)
      .toUpperCase(),
  };
}

/** Human countdown: "Tonight", "Tomorrow", "In 12 days", "In 4 months". */
export function countdownLabel(todayISO: string, startISO: string): string {
  const days = daysBetween(todayISO, startISO);
  if (days < 0) return 'Happening now';
  if (days === 0) return 'Tonight';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 14) return 'Next week';
  if (days < 60) return `In ${Math.round(days / 7)} weeks`;
  return `In ${Math.round(days / 30)} months`;
}
