'use client';

import { useState } from 'react';
import { EventExplorer } from './EventExplorer';
import { RegionalSection } from './RegionalSection';
import { SectionTabs } from './SectionTabs';
import type { SGEvent } from '@/lib/types';

interface SingaporeAndRegionalProps {
  singapore: SGEvent[];
  regional: SGEvent[];
  todayISO: string;
}

type SectionTab = 'music' | 'sports' | 'regional';

const TABS: { value: SectionTab; label: string; blurb: string }[] = [
  {
    value: 'music',
    label: 'Music',
    blurb: 'International artists, bands and DJs touring Singapore.',
  },
  {
    value: 'sports',
    label: 'Sport',
    blurb: 'The marquee fixtures on the Singapore sporting calendar.',
  },
  {
    value: 'regional',
    label: 'Regional',
    // RegionalSection carries its own heading and blurb — a shared one here
    // would just repeat it.
    blurb: '',
  },
];

/**
 * Owns the top-level Music / Sport / Regional tab. None of the three
 * sections it switches between can hold this state themselves: `page.tsx`
 * is a server component and can't hold state at all, `EventExplorer` only
 * ever renders Singapore music-or-sport events, and `RegionalSection` is a
 * sibling of it, not a child. Regional gets its own tab — rather than
 * always sitting below the Singapore sections — so it reads as a
 * first-class section instead of an appendix to Music.
 *
 * Switching tabs remounts `EventExplorer` via `key`, which resets its filter
 * state for free instead of needing an effect to clear stale selections.
 */
export function SingaporeAndRegional({
  singapore,
  regional,
  todayISO,
}: SingaporeAndRegionalProps) {
  const [tab, setTab] = useState<SectionTab>('music');
  const active = TABS.find((section) => section.value === tab)!;

  return (
    <section id="events" className="scroll-mt-24">
      <SectionTabs tabs={TABS} active={tab} onChange={setTab} />

      {active.blurb ? (
        <p className="mt-4 max-w-2xl text-base text-muted">{active.blurb}</p>
      ) : null}

      <div className="mt-8">
        {tab === 'regional' ? (
          <RegionalSection events={regional} />
        ) : (
          <EventExplorer key={tab} events={singapore} todayISO={todayISO} kind={tab} />
        )}
      </div>
    </section>
  );
}
