'use client';

import { useId, useMemo, useState } from 'react';
import { EventGrid } from './EventGrid';
import { FilterBar } from './FilterBar';
import { ViewToggle } from './ViewToggle';
import {
  availableTags,
  filterEvents,
  tagCounts as computeTagCounts,
} from '@/lib/filters';
import { useViewMode } from '@/lib/useViewMode';
import type { DateBucket, EventKind, EventTag, SGEvent } from '@/lib/types';

interface EventExplorerProps {
  /** Singapore events only — the regional block is rendered separately. */
  events: SGEvent[];
  todayISO: string;
  /**
   * Active tab, controlled by the parent — it also decides whether the
   * regional festivals section (a sibling, not rendered by this component)
   * should be visible, so the parent needs to know the current value.
   */
  kind: EventKind;
  onKindChange: (kind: EventKind) => void;
}

const SECTIONS: { kind: EventKind; label: string; blurb: string }[] = [
  {
    kind: 'music',
    label: 'Music',
    blurb: 'International artists, bands and DJs touring Singapore.',
  },
  {
    kind: 'sports',
    label: 'Sport',
    blurb: 'The marquee fixtures on the Singapore sporting calendar.',
  },
];

/**
 * Owns filter state for the two Singapore sections. The active tab (`kind`)
 * is the one exception — it's lifted to the parent, which uses it to decide
 * whether the regional festivals section should be visible (see `page.tsx`).
 *
 * State is plain React state rather than URL-synced: opening an event is a soft
 * navigation into the intercepted modal route, which preserves this component
 * tree, so the user's filters survive going in and out of an event.
 */
export function EventExplorer({ events, todayISO, kind, onKindChange }: EventExplorerProps) {
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([]);
  const [dateBucket, setDateBucket] = useState<DateBucket>('all');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useViewMode();

  const searchId = useId();

  // Everything in the active section, before tag/date/search narrowing — this
  // is what the filter pills are built from, so no dead filters are offered.
  const sectionEvents = useMemo(
    () => events.filter((event) => event.kind === kind),
    [events, kind],
  );

  const tags = useMemo(() => availableTags(sectionEvents), [sectionEvents]);
  const counts = useMemo(() => computeTagCounts(sectionEvents), [sectionEvents]);

  const visible = useMemo(
    () =>
      filterEvents(sectionEvents, { tags: selectedTags, dateBucket, query }, todayISO),
    [sectionEvents, selectedTags, dateBucket, query, todayISO],
  );

  function switchSection(next: EventKind) {
    if (next === kind) return;
    onKindChange(next);
    // Genre pills and sport pills don't overlap, so a stale selection would
    // silently filter everything out.
    setSelectedTags([]);
  }

  function toggleTag(tag: EventTag) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  const active = SECTIONS.find((section) => section.kind === kind)!;

  return (
    <section id="events" className="scroll-mt-24">
      {/* Section tabs */}
      <div
        role="tablist"
        aria-label="Event type"
        className="inline-flex rounded-full border border-hairline bg-white/4 p-1"
      >
        {SECTIONS.map((section) => (
          <button
            key={section.kind}
            role="tab"
            type="button"
            aria-selected={kind === section.kind}
            onClick={() => switchSection(section.kind)}
            className={`font-display rounded-full px-7 py-2.5 text-base font-bold tracking-tight transition-all duration-300 sm:px-10 sm:text-lg ${
              kind === section.kind
                ? 'bg-gradient-to-r from-amber via-coral to-violet text-white'
                : 'text-muted hover:text-cream'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <p className="mt-4 max-w-2xl text-base text-muted">{active.blurb}</p>

      <div className="mt-8">
        <FilterBar
          tags={tags}
          tagCounts={counts}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClearTags={() => setSelectedTags([])}
          dateBucket={dateBucket}
          onDateBucketChange={setDateBucket}
          query={query}
          onQueryChange={setQuery}
          tagGroupLabel={kind === 'music' ? 'Genre' : 'Sport'}
          resultCount={visible.length}
          searchId={searchId}
        />
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center justify-end">
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
        <EventGrid
          events={visible}
          groupByMonth
          viewMode={viewMode}
          emptyMessage={
            query
              ? `No ${active.label.toLowerCase()} events match “${query}”.`
              : 'Nothing matches those filters yet.'
          }
        />
      </div>
    </section>
  );
}
