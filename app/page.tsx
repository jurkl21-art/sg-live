import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { SingaporeAndRegional } from '@/components/SingaporeAndRegional';
import { LAST_UPDATED, events } from '@/data/events';
import { todayInSingapore } from '@/lib/dates';
import { getUpcoming } from '@/lib/filters';

/**
 * Rebuild once a day.
 *
 * The page is statically rendered, but "today" drives the 12-month window and
 * the date buckets — so it needs to be regenerated daily or it would keep
 * serving a snapshot of whenever it was built.
 */
export const revalidate = 86_400;

export default function HomePage() {
  const todayISO = todayInSingapore();
  const upcoming = getUpcoming(events, todayISO);

  const singapore = upcoming.filter((event) => event.scope === 'singapore');
  const regional = upcoming.filter((event) => event.scope === 'regional');
  const headliners = upcoming.filter((event) => event.featured);

  return (
    <>
      <Hero
        headliners={headliners}
        totalEvents={upcoming.length}
        lastUpdated={LAST_UPDATED}
      />

      <main id="main" className="mx-auto max-w-7xl px-5 pt-10 pb-20 sm:px-8 sm:pt-14 sm:pb-28">
        <SingaporeAndRegional singapore={singapore} regional={regional} todayISO={todayISO} />
      </main>

      <Footer lastUpdated={LAST_UPDATED} />
    </>
  );
}
