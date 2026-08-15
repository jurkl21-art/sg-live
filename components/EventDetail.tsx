import { Artwork } from './Artwork';
import { StatusBadge, TagBadge } from './Badges';
import { countdownLabel, formatDateRange } from '@/lib/dates';
import { type SGEvent, tagsOf } from '@/lib/types';

interface EventDetailProps {
  event: SGEvent;
  todayISO: string;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold tracking-widest text-faint uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-cream">{value}</dd>
    </div>
  );
}

/**
 * The body of an event page.
 *
 * Rendered by BOTH the intercepted modal and the standalone `/events/[slug]`
 * page, so the two can never drift apart.
 */
export function EventDetail({ event, todayISO }: EventDetailProps) {
  const tags = tagsOf(event);

  return (
    <article>
      <div className="relative">
        <Artwork
          title={event.title}
          palette={event.palette}
          variant="hero"
          className="aspect-16/10 w-full sm:aspect-21/9"
        />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={event.status} />
            <span className="rounded-full bg-black/45 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-white/90 uppercase backdrop-blur-sm">
              {countdownLabel(todayISO, event.startDate)}
            </span>
          </div>

          <h1 className="font-display text-4xl leading-[0.95] font-bold tracking-tighter text-balance text-white drop-shadow-lg sm:text-6xl">
            {event.title}
          </h1>
          {event.subtitle ? (
            <p className="mt-2 text-base text-white/75 italic sm:text-lg">
              {event.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <p className="mt-6 text-base leading-relaxed text-pretty text-cream/90 sm:text-lg">
          {event.summary}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hairline pt-6 sm:grid-cols-3">
          <Field label="Date" value={formatDateRange(event.startDate, event.endDate)} />
          {event.time ? <Field label="Doors" value={event.time} /> : null}
          <Field label="Venue" value={event.venue} />
          <Field
            label="Location"
            value={
              event.scope === 'regional'
                ? `${event.area}, ${event.city}, ${event.country}`
                : `${event.area}, Singapore`
            }
          />
          {event.priceFrom ? <Field label="Tickets from" value={event.priceFrom} /> : null}
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {event.ticketUrl ? (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber via-coral to-violet px-7 py-3.5 text-sm font-bold tracking-wide text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              Tickets &amp; info
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
                <path d="M5 1h8v8h-2V4.4L3.4 12 2 10.6 9.6 3H5z" />
              </svg>
            </a>
          ) : null}

          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-6 py-3.5 text-sm font-semibold text-muted transition-colors duration-300 hover:border-white/25 hover:text-cream"
          >
            Verify this listing
          </a>
        </div>

        {event.status === 'tbc' ? (
          <p className="mt-6 rounded-xl border border-white/12 bg-white/4 p-4 text-sm leading-relaxed text-muted">
            <strong className="font-semibold text-cream">Heads up —</strong> the date or venue
            for this event has not been formally confirmed. It is listed on the strength of a
            previous edition or an early announcement. Check the source before booking travel.
          </p>
        ) : null}
      </div>
    </article>
  );
}
