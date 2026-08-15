import { addMonths, daysBetween, monthKey } from './dates';
import {
  type DateBucket,
  type EventKind,
  type EventTag,
  type SGEvent,
  type Scope,
  TAG_LABELS,
  tagsOf,
} from './types';

/**
 * Pure filtering helpers. No React, no component coupling — the UI just calls
 * `filterEvents` and renders whatever comes back.
 */

/** The last day an event is relevant (multi-day events stay listed until they end). */
export function effectiveEndDate(event: SGEvent): string {
  return event.endDate ?? event.startDate;
}

/**
 * Drop anything already finished, and anything beyond the 12-month window.
 *
 * The window is derived from `todayISO` rather than hardcoded, so the site
 * quietly prunes itself as dates pass instead of showing a stale back catalogue.
 */
export function getUpcoming(events: SGEvent[], todayISO: string): SGEvent[] {
  const horizon = addMonths(todayISO, 12);
  return events
    .filter((event) => effectiveEndDate(event) >= todayISO && event.startDate <= horizon)
    .sort(compareByDate);
}

export function compareByDate(a: SGEvent, b: SGEvent): number {
  return a.startDate.localeCompare(b.startDate) || a.title.localeCompare(b.title);
}

/** Which date bucket an event falls into, relative to today. */
export function bucketOf(event: SGEvent, todayISO: string): Exclude<DateBucket, 'all'> {
  if (monthKey(event.startDate) === monthKey(todayISO)) return 'this-month';
  if (daysBetween(todayISO, event.startDate) <= 92) return 'next-3-months';
  return 'later';
}

function matchesBucket(event: SGEvent, bucket: DateBucket, todayISO: string): boolean {
  if (bucket === 'all') return true;
  // "Next 3 months" is inclusive of this month — users read it as a horizon,
  // not as a slice that excludes what is happening right now.
  if (bucket === 'next-3-months') {
    const actual = bucketOf(event, todayISO);
    return actual === 'this-month' || actual === 'next-3-months';
  }
  return bucketOf(event, todayISO) === bucket;
}

/** Case-insensitive match across name, tour, venue, area, city and tag labels. */
export function searchMatch(event: SGEvent, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    event.title,
    event.subtitle ?? '',
    event.venue,
    event.area,
    event.city,
    event.country,
    ...tagsOf(event).map((tag) => TAG_LABELS[tag]),
  ]
    .join(' ')
    .toLowerCase();

  // Every whitespace-separated term must appear, so "weeknd stadium" works.
  return needle.split(/\s+/).every((term) => haystack.includes(term));
}

export interface FilterState {
  kind?: EventKind;
  scope?: Scope;
  /** Empty means "all tags". Otherwise an event matches if it has any of them. */
  tags: EventTag[];
  dateBucket: DateBucket;
  query: string;
  /** Optional country filter, used by the regional festivals block. */
  country?: string;
}

export const EMPTY_FILTERS: FilterState = {
  tags: [],
  dateBucket: 'all',
  query: '',
};

export function filterEvents(
  events: SGEvent[],
  filters: FilterState,
  todayISO: string,
): SGEvent[] {
  const { kind, scope, tags, dateBucket, query, country } = filters;

  return events.filter((event) => {
    if (kind && event.kind !== kind) return false;
    if (scope && event.scope !== scope) return false;
    if (country && event.country !== country) return false;
    if (tags.length > 0 && !tagsOf(event).some((tag) => tags.includes(tag))) return false;
    if (!matchesBucket(event, dateBucket, todayISO)) return false;
    return searchMatch(event, query);
  });
}

/** Tags actually present in a set of events, so the UI never offers a dead filter. */
export function availableTags(events: SGEvent[]): EventTag[] {
  const seen = new Set<EventTag>();
  for (const event of events) {
    for (const tag of tagsOf(event)) seen.add(tag);
  }
  return [...seen];
}

/** Count of events per tag, for the filter pill badges. */
export function tagCounts(events: SGEvent[]): Map<EventTag, number> {
  const counts = new Map<EventTag, number>();
  for (const event of events) {
    for (const tag of tagsOf(event)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}

/** Countries present in a set of events, alphabetically. */
export function availableCountries(events: SGEvent[]): string[] {
  return [...new Set(events.map((event) => event.country))].sort();
}

/**
 * The hero's "next up": the soonest featured event that still has a firm date.
 * Falls back to the soonest event of any kind so the hero is never empty.
 */
export function nextUpEvent(events: SGEvent[]): SGEvent | undefined {
  return (
    events.find((event) => event.featured && event.status !== 'tbc') ??
    events.find((event) => event.featured) ??
    events[0]
  );
}
