import { notFound } from 'next/navigation';
import { EventDetail } from '@/components/EventDetail';
import { Modal } from '@/components/Modal';
import { getEventById } from '@/data/events';
import { todayInSingapore } from '@/lib/dates';

export const revalidate = 86_400;

/**
 * Intercepted event route.
 *
 * A click on an event card from within the app lands here and renders the
 * detail inside an overlay, leaving the filtered grid — and its React state —
 * mounted underneath. A refresh or a shared link falls through to the real page
 * at `app/events/[slug]`.
 */
export default async function InterceptedEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventById(slug);

  if (!event) notFound();

  return (
    <Modal>
      <EventDetail event={event} todayISO={todayInSingapore()} />
    </Modal>
  );
}
