import Link from 'next/link';
import { Artwork } from './Artwork';
import { StatusBadge } from './Badges';
import { dateChip, formatDateRange } from '@/lib/dates';
import { glowFor } from '@/lib/gradients';
import { type SGEvent, TAG_LABELS, type ViewMode, tagsOf } from '@/lib/types';

interface EventCardProps {
  event: SGEvent;
  /** Staggers the scroll-reveal across the grid. */
  index?: number;
  /** 'large' (default) and 'small' share the same card shell; 'list' is a row. */
  variant?: ViewMode;
}

export function EventCard({ event, index = 0, variant = 'large' }: EventCardProps) {
  if (variant === 'list') return <EventListRow event={event} index={index} />;

  const chip = dateChip(event.startDate);
  const tags = tagsOf(event);
  const isMultiDay = Boolean(event.endDate && event.endDate !== event.startDate);
  const compact = variant === 'small';

  return (
    <article
      data-reveal
      style={
        {
          '--reveal-delay': `${Math.min(index, 7) * 55}ms`,
          '--card-glow': glowFor(event.palette),
        } as React.CSSProperties
      }
      className="group relative"
    >
      <Link
        href={`/events/${event.id}`}
        scroll={false}
        className="block h-full overflow-hidden rounded-2xl border border-hairline bg-ink-card transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:border-white/20 group-hover:shadow-[0_22px_60px_-18px_var(--card-glow)] focus-visible:-translate-y-1.5"
      >
        <div className="relative">
          <Artwork
            title={event.title}
            palette={event.palette}
            className={`w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] ${
              compact ? 'aspect-square' : 'aspect-4/3'
            }`}
          />

          {/* Date chip */}
          <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl border border-white/15 bg-black/55 px-3 py-2 backdrop-blur-md">
            <span className="font-display text-xl leading-none font-bold text-cream">
              {chip.day}
            </span>
            <span className="mt-0.5 text-[0.62rem] font-semibold tracking-widest text-cream/70">
              {chip.month}
            </span>
            {isMultiDay && !compact ? (
              <span className="mt-1 text-[0.55rem] font-medium tracking-wider text-cream/55 uppercase">
                +{' '}
                {Math.round(
                  (Date.parse(event.endDate!) - Date.parse(event.startDate)) / 86_400_000,
                )}{' '}
                d
              </span>
            ) : null}
          </div>

          <div className="absolute top-3 right-3">
            <StatusBadge status={event.status} />
          </div>

          {/* Genre / category, sat on the artwork's dark foot. Skipped when
              compact — the smaller frame doesn't have room for both this and
              the date/status chips without crowding. */}
          {!compact ? (
            <div className="absolute right-3 bottom-3 left-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/45 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-white/90 uppercase backdrop-blur-sm"
                >
                  {TAG_LABELS[tag]}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className={compact ? 'p-3' : 'p-4 sm:p-5'}>
          <h3
            className={
              compact
                ? 'font-display line-clamp-2 text-sm leading-snug font-bold text-cream'
                : 'font-display text-xl leading-tight font-bold tracking-tight text-balance text-cream sm:text-2xl'
            }
          >
            {event.title}
          </h3>
          {!compact && event.subtitle ? (
            <p className="mt-1 text-sm text-faint italic">{event.subtitle}</p>
          ) : null}

          <p className={compact ? 'mt-1.5 text-xs font-medium text-muted' : 'mt-3 text-sm font-medium text-muted'}>
            {formatDateRange(event.startDate, event.endDate)}
          </p>

          {compact ? (
            <p className="mt-1 truncate text-xs text-faint">{event.venue}</p>
          ) : (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-faint">
              <svg
                viewBox="0 0 16 16"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-current opacity-70"
                aria-hidden="true"
              >
                <path d="M8 0a5 5 0 0 0-5 5c0 3.6 4.35 10.53 4.54 10.82a.55.55 0 0 0 .92 0C8.65 15.53 13 8.6 13 5a5 5 0 0 0-5-5Zm0 7.2A2.2 2.2 0 1 1 8 2.8a2.2 2.2 0 0 1 0 4.4Z" />
              </svg>
              <span>
                {event.venue}
                {event.scope === 'regional' ? ` · ${event.city}, ${event.country}` : ''}
              </span>
            </p>
          )}

          {!compact ? (
            <>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted/80">
                {event.summary}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
                <span className="text-xs font-medium text-faint">
                  {event.priceFrom ? `From ${event.priceFrom}` : event.area}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-coral transition-transform duration-300 group-hover:translate-x-0.5">
                  Details
                  <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden="true">
                    <path d="M4.5 1.5 9 6l-4.5 4.5-1-1L7 6 3.5 2.5z" />
                  </svg>
                </span>
              </div>
            </>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

/**
 * List-view row. Structurally different enough from the grid card (horizontal,
 * no summary, no separate footer) that it's its own layout rather than another
 * branch of the card above. Meant to sit inside a shared, divided container —
 * see `EventGrid` — so it carries no border or rounding of its own.
 */
function EventListRow({ event, index }: { event: SGEvent; index: number }) {
  const tags = tagsOf(event);

  return (
    <article
      data-reveal
      style={{ '--reveal-delay': `${Math.min(index, 11) * 35}ms` } as React.CSSProperties}
      className="group"
    >
      <Link
        href={`/events/${event.id}`}
        scroll={false}
        className="flex items-center gap-4 bg-ink-card px-4 py-3 transition-colors duration-300 hover:bg-white/5 sm:gap-5 sm:px-5"
      >
        <Artwork
          title={event.title}
          palette={event.palette}
          className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h3 className="font-display truncate text-base font-bold tracking-tight text-cream sm:text-lg">
              {event.title}
            </h3>
            {event.subtitle ? (
              <span className="hidden truncate text-xs text-faint italic sm:inline">
                {event.subtitle}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted">
            {formatDateRange(event.startDate, event.endDate)} · {event.venue}
          </p>
          {tags.length > 0 ? (
            <div className="mt-1.5 hidden flex-wrap gap-1.5 sm:flex">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-hairline bg-white/5 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-cream/75 uppercase"
                >
                  {TAG_LABELS[tag]}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge status={event.status} />
          <span className="hidden text-xs font-medium text-faint sm:block">
            {event.priceFrom ?? event.area}
          </span>
        </div>

        <svg
          viewBox="0 0 12 12"
          className="hidden h-3.5 w-3.5 shrink-0 fill-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:fill-coral sm:block"
          aria-hidden="true"
        >
          <path d="M4.5 1.5 9 6l-4.5 4.5-1-1L7 6 3.5 2.5z" />
        </svg>
      </Link>
    </article>
  );
}
