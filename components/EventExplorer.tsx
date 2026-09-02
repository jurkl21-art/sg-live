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
   * Fixed for the lifetime of this component. The active tab lives in the
   * parent (`SingaporeAndRegional`), which remounts this component via
   * `key` whenever it changes, so `kind` never changes mid-mount.
   */
  kind: EventKind;
}

/**
 * Owns filter state for a single Singapore section (Music or Sport). The
 * active tab itself lives one level up, in `SingaporeAndRegional` — see that
 * file for why.
 *
 * State is plain React state rather than URL-synced: opening an event is a soft
 * navigation into the intercepted modal route, which preserves this component
 * tree, so the user's filters survive going in and out of an event.
 */
export function EventExplorer({ events, todayISO, kind }: EventExplorerProps) {
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([]);
  const [dateBucket, setDateBucket] = useState<DateBucket>('all');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useViewMode();

  const searchId = useId();

  // Everything in this section, before tag/date/search narrowing — this is
  // what the filter pills are built from, so no dead filters are offered.
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

  function toggleTag(tag: EventTag) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  const kindLabel = kind === 'music' ? 'music' : 'sport';

  return (
    <>
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
              ? `No ${kindLabel} events match “${query}”.`
              : 'Nothing matches those filters yet.'
          }
        />
      </div>
    </>
  );
}
