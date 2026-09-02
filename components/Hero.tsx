import Link from 'next/link';
import { formatDateRange, formatMonthYear } from '@/lib/dates';
import type { SGEvent } from '@/lib/types';

interface HeroProps {
  /** Marquee ticker content — the featured events across the whole window. */
  headliners: SGEvent[];
  totalEvents: number;
  lastUpdated: string;
}

export function Hero({ headliners, totalEvents, lastUpdated }: HeroProps) {
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
