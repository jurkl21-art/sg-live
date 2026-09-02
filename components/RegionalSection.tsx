'use client';

import { useMemo, useState } from 'react';
import { EventGrid } from './EventGrid';
import { ViewToggle } from './ViewToggle';
import { availableCountries } from '@/lib/filters';
import { useViewMode } from '@/lib/useViewMode';
import type { SGEvent } from '@/lib/types';

/**
 * Southeast Asia festivals outside Singapore — the content behind the
 * Regional tab in `SingaporeAndRegional`. Deliberately its own block with
 * its own country filter (no tag/date filtering), so it never mixes with
 * the Singapore Music/Sport sections.
 */
export function RegionalSection({ events }: { events: SGEvent[] }) {
  const [country, setCountry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useViewMode();

  const countries = useMemo(() => availableCountries(events), [events]);
  const visible = useMemo(
    () => (country ? events.filter((event) => event.country === country) : events),
    [events, country],
  );

  return (
    <section id="regional" className="scroll-mt-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-coral uppercase">
            Worth the flight
          </p>
          <h2 className="font-display mt-3 text-[length:var(--text-section)] leading-[0.95] font-bold tracking-tighter text-balance">
            Southeast Asia festivals
          </h2>
          <p className="mt-4 text-base text-muted">
            The regional heavyweights, all within a short-haul hop of Changi. December is the
            season — three of the biggest land inside two weeks of each other.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter festivals by country"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          <button
            type="button"
            onClick={() => setCountry(null)}
            aria-pressed={country === null}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              country === null
                ? 'border-transparent bg-gradient-to-r from-amber via-coral to-violet text-white'
                : 'border-hairline bg-white/4 text-muted hover:border-white/22 hover:text-cream'
            }`}
          >
            All
          </button>
          {countries.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCountry(name)}
              aria-pressed={country === name}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                country === name
                  ? 'border-transparent bg-gradient-to-r from-amber via-coral to-violet text-white'
                  : 'border-hairline bg-white/4 text-muted hover:border-white/22 hover:text-cream'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center justify-end">
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
        <EventGrid
          events={visible}
          viewMode={viewMode}
          emptyMessage="No festivals listed there yet."
        />
      </div>
    </section>
  );
}
