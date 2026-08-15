'use client';

import {
  DATE_BUCKET_LABELS,
  type DateBucket,
  type EventTag,
  TAG_LABELS,
} from '@/lib/types';

const DATE_BUCKETS: DateBucket[] = ['all', 'this-month', 'next-3-months', 'later'];

interface PillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

function Pill({ active, onClick, children, count }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
        active
          ? 'border-transparent bg-gradient-to-r from-amber via-coral to-violet text-white shadow-[0_6px_20px_-8px_var(--color-coral)]'
          : 'border-hairline bg-white/4 text-muted hover:border-white/22 hover:text-cream'
      }`}
    >
      {children}
      {typeof count === 'number' ? (
        <span className={active ? 'text-white/70' : 'text-faint'}>{count}</span>
      ) : null}
    </button>
  );
}

interface FilterBarProps {
  tags: EventTag[];
  tagCounts: Map<EventTag, number>;
  selectedTags: EventTag[];
  onToggleTag: (tag: EventTag) => void;
  onClearTags: () => void;
  dateBucket: DateBucket;
  onDateBucketChange: (bucket: DateBucket) => void;
  query: string;
  onQueryChange: (query: string) => void;
  /** Label for the tag group, e.g. "Genre" or "Sport". */
  tagGroupLabel: string;
  resultCount: number;
  searchId: string;
}

export function FilterBar({
  tags,
  tagCounts,
  selectedTags,
  onToggleTag,
  onClearTags,
  dateBucket,
  onDateBucketChange,
  query,
  onQueryChange,
  tagGroupLabel,
  resultCount,
  searchId,
}: FilterBarProps) {
  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative max-w-xl">
        <label htmlFor={searchId} className="sr-only">
          Search by artist, event or venue
        </label>
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 fill-faint"
          aria-hidden="true"
        >
          <path d="M6.5 0a6.5 6.5 0 1 0 4.03 11.6l3.94 3.93 1.06-1.06-3.93-3.94A6.5 6.5 0 0 0 6.5 0Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
        </svg>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search artist, event or venue…"
          className="w-full rounded-full border border-hairline bg-white/4 py-3 pr-4 pl-11 text-sm text-cream transition-colors duration-300 placeholder:text-faint hover:border-white/20 focus:border-coral/60 focus:outline-none"
        />
      </div>

      {/* Tag filter */}
      <div>
        <h3 className="mb-2.5 text-[0.7rem] font-semibold tracking-widest text-faint uppercase">
          {tagGroupLabel}
        </h3>
        <div
          role="group"
          aria-label={`Filter by ${tagGroupLabel.toLowerCase()}`}
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Pill active={selectedTags.length === 0} onClick={onClearTags}>
            All
          </Pill>
          {tags.map((tag) => (
            <Pill
              key={tag}
              active={selectedTags.includes(tag)}
              onClick={() => onToggleTag(tag)}
              count={tagCounts.get(tag)}
            >
              {TAG_LABELS[tag]}
            </Pill>
          ))}
        </div>
      </div>

      {/* Date filter */}
      <div>
        <h3 className="mb-2.5 text-[0.7rem] font-semibold tracking-widest text-faint uppercase">
          When
        </h3>
        <div
          role="group"
          aria-label="Filter by date"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {DATE_BUCKETS.map((bucket) => (
            <Pill
              key={bucket}
              active={dateBucket === bucket}
              onClick={() => onDateBucketChange(bucket)}
            >
              {DATE_BUCKET_LABELS[bucket]}
            </Pill>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-faint">
        {resultCount} {resultCount === 1 ? 'event' : 'events'}
      </p>
    </div>
  );
}
