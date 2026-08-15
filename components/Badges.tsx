import { type EventStatus, type EventTag, STATUS_LABELS, TAG_LABELS } from '@/lib/types';

const STATUS_STYLES: Record<EventStatus, string> = {
  confirmed: 'border-mint/35 bg-mint/12 text-mint',
  'on-sale-soon': 'border-amber/40 bg-amber/12 text-amber',
  tbc: 'border-white/20 bg-white/8 text-muted',
};

/**
 * Listing confidence. `tbc` is deliberately visible — the dataset includes
 * events whose dates are projected rather than confirmed, and the badge is what
 * keeps that honest.
 */
export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide uppercase ${STATUS_STYLES[status]}`}
    >
      {status === 'tbc' ? null : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}

export function TagBadge({ tag }: { tag: EventTag }) {
  return (
    <span className="inline-flex rounded-full border border-hairline bg-white/6 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-cream/85 uppercase">
      {TAG_LABELS[tag]}
    </span>
  );
}
