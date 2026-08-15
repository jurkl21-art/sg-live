import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EventDetail } from '@/components/EventDetail';
import { Footer } from '@/components/Footer';
import { LAST_UPDATED, events, getEventById } from '@/data/events';
import { formatDateRange, todayInSingapore } from '@/lib/dates';

export const revalidate = 86_400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Prerender a page per event so direct links and crawlers get static HTML. */
export function generateStaticParams() {
  return events.map((event) => ({ slug: event.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventById(slug);

  if (!event) return { title: 'Event not found' };

  const description = `${formatDateRange(event.startDate, event.endDate)} · ${event.venue}, ${
    event.city
  }. ${event.summary}`;

  return {
    title: event.title,
    description,
    openGraph: {
      title: `${event.title} — SG Live`,
      description,
      type: 'article',
    },
  };
}

/**
 * Standalone event page.
 *
 * Reached on a direct visit, a refresh, or a shared link. In-app clicks are
 * intercepted by `app/@modal/(.)events/[slug]` and shown as a modal instead —
 * both render the same `EventDetail`.
 */
export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventById(slug);

  if (!event) notFound();

  return (
    <>
      <main id="main" className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-300 hover:text-cream"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current" aria-hidden="true">
            <path d="M7.5 1.5 3 6l4.5 4.5 1-1L5 6l3.5-3.5z" />
          </svg>
          All events
        </Link>

        <div className="overflow-hidden rounded-3xl border border-hairline bg-ink-raised">
          <EventDetail event={event} todayISO={todayInSingapore()} />
        </div>
      </main>

      <Footer lastUpdated={LAST_UPDATED} />
    </>
  );
}
