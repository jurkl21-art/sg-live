import { EventExplorer } from '@/components/EventExplorer';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { RegionalSection } from '@/components/RegionalSection';
import { LAST_UPDATED, events } from '@/data/events';
import { todayInSingapore } from '@/lib/dates';
import { getUpcoming, nextUpEvent } from '@/lib/filters';

/**
 * Rebuild once a day.
 *
 * The page is statically rendered, but "today" drives the 12-month window, the
 * "next up" hero and the date buckets — so it needs to be regenerated daily or
 * it would keep serving a snapshot of whenever it was built.
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
        nextUp={nextUpEvent(upcoming)}
        headliners={headliners}
        totalEvents={upcoming.length}
        lastUpdated={LAST_UPDATED}
        todayISO={todayISO}
      />

      <main id="main" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <EventExplorer events={singapore} todayISO={todayISO} />

        <hr className="my-24 border-hairline sm:my-32" />

        <RegionalSection events={regional} />
      </main>

      <Footer lastUpdated={LAST_UPDATED} />
    </>
  );
}
