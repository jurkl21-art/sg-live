'use client';

import { useState } from 'react';
import { EventExplorer } from './EventExplorer';
import { RegionalSection } from './RegionalSection';
import type { EventKind, SGEvent } from '@/lib/types';

interface SingaporeAndRegionalProps {
  singapore: SGEvent[];
  regional: SGEvent[];
  todayISO: string;
}

/**
 * Wraps the Singapore explorer and the regional festivals block together
 * because they aren't fully independent: the regional section only makes
 * sense alongside the Music tab (it's Southeast Asia's *music* festival
 * highlights, with nothing sports-related in it), so it's hidden whenever
 * the Sport tab is active. `page.tsx` itself is a server component and can't
 * hold that state, hence this thin client wrapper.
 */
export function SingaporeAndRegional({
  singapore,
  regional,
  todayISO,
}: SingaporeAndRegionalProps) {
  const [kind, setKind] = useState<EventKind>('music');

  return (
    <>
      <EventExplorer events={singapore} todayISO={todayISO} kind={kind} onKindChange={setKind} />

      {kind === 'music' ? (
        <>
          <hr className="my-24 border-hairline sm:my-32" />
          <RegionalSection events={regional} />
        </>
      ) : null}
    </>
  );
}
