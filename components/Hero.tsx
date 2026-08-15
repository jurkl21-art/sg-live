import Link from 'next/link';
import { Artwork } from './Artwork';
import { StatusBadge } from './Badges';
import { countdownLabel, formatDateRange, formatMonthYear } from '@/lib/dates';
import type { SGEvent } from '@/lib/types';

interface HeroProps {
  nextUp: SGEvent | undefined;
  /** Marquee ticker content — the featured events across the whole window. */
  headliners: SGEvent[];
  totalEvents: number;
  lastUpdated: string;
  todayISO: string;
}

export function Hero({
  nextUp,
  headliners,
  totalEvents,
  lastUpdated,
  todayISO,
}: HeroProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Sunset wash. Two drifting radial blooms over near-black, plus grain. */}
      <div aria-hidden="true" className="grain absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ink" />
        <div className="animate-drift absolute -top-1/3 -left-1/4 h-[85vh] w-[85vw] rounded-full bg-[radial-gradient(circle,rgba(255,61,119,0.42)_0%,transparent_62%)] blur-3xl" />
        <div
          className="animate-drift absolute -right-1/4 -bottom-1/4 h-[80vh] w-[80vw] rounded-full bg-[radial-gradient(circle,rgba(123,47,255,0.38)_0%,transparent_62%)] blur-3xl"
          style={{ animationDelay: '-11s' }}
        />
        <div className="absolute top-1/4 left-1/3 h-[45vh] w-[45vw] rounded-full bg-[radial-gradient(circle,rgba(255,138,61,0.22)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 sm:pt-14 sm:pb-24">
        {/* Brand */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            SG<span className="text-sunset">LIVE</span>
          </Link>
          <p className="text-xs font-medium text-faint">
            Updated{' '}
            <time dateTime={lastUpdated} className="text-muted">
              {formatDateRange(lastUpdated)}
            </time>
          </p>
        </div>

        {/* Headline */}
        <h1 className="font-display mt-14 text-[length:var(--text-hero)] leading-[0.85] font-bold tracking-tighter text-balance sm:mt-20">
          The next twelve
          <br />
          months, <span className="text-sunset">after dark</span>.
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          Every international artist, marquee sporting fixture and Southeast Asian festival
          worth crossing the island — or the region — for.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-faint">
          <span>
            <strong className="font-display text-2xl font-bold text-cream">
              {totalEvents}
            </strong>{' '}
            events tracked
          </span>
          <span className="hidden h-4 w-px bg-hairline sm:block" />
          <span>Singapore · Thailand · Indonesia</span>
        </div>

        {/* Next up */}
        {nextUp ? (
          <div className="mt-14 sm:mt-20">
            <div className="mb-4 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
              </span>
              <h2 className="text-[0.7rem] font-semibold tracking-[0.2em] text-cream uppercase">
                Next up
              </h2>
            </div>

            <Link
              href={`/events/${nextUp.id}`}
              scroll={false}
              className="group block overflow-hidden rounded-3xl border border-hairline bg-ink-card/70 backdrop-blur-sm transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-white/25"
            >
              <div className="grid md:grid-cols-[1.15fr_1fr]">
                <Artwork
                  title={nextUp.title}
                  palette={nextUp.palette}
                  variant="hero"
                  className="aspect-16/10 w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] md:aspect-auto md:min-h-[22rem]"
                />

                <div className="flex flex-col justify-center p-6 sm:p-9">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={nextUp.status} />
                    <span className="rounded-full border border-hairline bg-white/6 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-cream/85 uppercase">
                      {countdownLabel(todayISO, nextUp.startDate)}
                    </span>
                  </div>

                  <h3 className="font-display mt-4 text-4xl leading-[0.95] font-bold tracking-tighter text-balance text-cream sm:text-5xl">
                    {nextUp.title}
                  </h3>
                  {nextUp.subtitle ? (
                    <p className="mt-2 text-base text-faint italic">{nextUp.subtitle}</p>
                  ) : null}

                  <p className="mt-5 text-base font-medium text-cream">
                    {formatDateRange(nextUp.startDate, nextUp.endDate)}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {nextUp.venue} · {nextUp.area}
                  </p>

                  <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-muted/85">
                    {nextUp.summary}
                  </p>

                  <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-amber via-coral to-violet px-6 py-3 text-sm font-bold text-white transition-transform duration-300 group-hover:scale-[1.03]">
                    See the details
                    <svg
                      viewBox="0 0 12 12"
                      className="h-3 w-3 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M4.5 1.5 9 6l-4.5 4.5-1-1L7 6 3.5 2.5z" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ) : null}
      </div>

      {/* Headliner ticker */}
      {headliners.length > 0 ? (
        <div
          aria-hidden="true"
          className="flex overflow-hidden border-y border-hairline bg-ink-raised/60 py-4 select-none"
        >
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
            {[...headliners, ...headliners].map((event, index) => (
              <span
                key={`${event.id}-${index}`}
                className="font-display flex shrink-0 items-center gap-8 text-sm font-semibold tracking-tight whitespace-nowrap text-muted"
              >
                {event.title}
                <span className="text-xs font-normal text-faint">
                  {formatMonthYear(event.startDate)}
                </span>
                <span className="h-1 w-1 rounded-full bg-coral" />
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
