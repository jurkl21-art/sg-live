'use client';

import { EventCard } from './EventCard';
import { useReveal } from '@/lib/useReveal';
import { formatMonthYear, monthKey } from '@/lib/dates';
import type { SGEvent } from '@/lib/types';

interface EventGridProps {
  events: SGEvent[];
  /** Break the grid into month sections. Off for the shorter regional block. */
  groupByMonth?: boolean;
  emptyMessage?: string;
}

function Grid({ events, offset = 0 }: { events: SGEvent[]; offset?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={offset + index} />
      ))}
    </div>
  );
}

export function EventGrid({
  events,
  groupByMonth = false,
  emptyMessage = 'Nothing matches those filters yet.',
}: EventGridProps) {
  // Re-run the observer setup whenever the visible set changes, so cards added
  // by a filter change get picked up too.
  const containerRef = useReveal<HTMLDivElement>(events);

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline px-6 py-16 text-center">
        <p className="font-display text-xl font-semibold text-cream">{emptyMessage}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-faint">
          Try clearing a filter, widening the date range, or searching for a venue instead of
          an artist.
        </p>
      </div>
    );
  }

  if (!groupByMonth) {
    return (
      <div ref={containerRef}>
        <Grid events={events} />
      </div>
    );
  }

  // Events arrive date-sorted, so a single pass produces ordered month groups.
  const months = new Map<string, SGEvent[]>();
  for (const event of events) {
    const key = monthKey(event.startDate);
    const bucket = months.get(key);
    if (bucket) bucket.push(event);
    else months.set(key, [event]);
  }

  let seen = 0;

  return (
    <div ref={containerRef} className="space-y-12">
      {[...months.entries()].map(([key, monthEvents]) => {
        const offset = seen;
        seen += monthEvents.length;

        return (
          <section key={key} aria-labelledby={`month-${key}`}>
            <div className="mb-5 flex items-center gap-4">
              <h3
                id={`month-${key}`}
                className="font-display text-lg font-bold tracking-tight text-cream"
              >
                {formatMonthYear(`${key}-01`)}
              </h3>
              <span className="h-px flex-1 bg-hairline" />
              <span className="text-xs font-medium text-faint">
                {monthEvents.length} {monthEvents.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            <Grid events={monthEvents} offset={offset} />
          </section>
        );
      })}
    </div>
  );
}
