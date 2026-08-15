import { formatDateRange } from '@/lib/dates';

export function Footer({ lastUpdated }: { lastUpdated: string }) {
  return (
    <footer className="border-t border-hairline bg-ink-raised/50">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <p className="font-display text-lg font-bold tracking-tight">
              SG<span className="text-sunset">LIVE</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A hand-curated guide to international music and marquee sport in Singapore, plus
              the Southeast Asian festivals worth booking a flight for.
            </p>
          </div>

          <div className="text-sm text-muted sm:text-right">
            <p className="text-[0.7rem] font-semibold tracking-widest text-faint uppercase">
              Last updated
            </p>
            <p className="mt-1.5 font-medium text-cream">
              <time dateTime={lastUpdated}>{formatDateRange(lastUpdated)}</time>
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-faint sm:ml-auto">
              Listings are researched manually and are not a live feed. Always confirm dates
              with the official promoter or ticketing page before booking.
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-hairline pt-6 text-xs text-faint">
          Event data compiled from public listings and official promoter pages. All artwork on
          this site is generated — no promotional imagery is reproduced. Not affiliated with
          any artist, venue, promoter or rights holder.
        </p>
      </div>
    </footer>
  );
}
