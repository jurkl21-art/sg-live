'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

/** `useLayoutEffect` on the client, `useEffect` on the server, without the warning. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** If no observer callback has arrived by now, assume it never will. */
const SAFETY_TIMEOUT_MS = 1200;

/**
 * Fade-and-lift elements in as they scroll into view.
 *
 * Attach the returned ref to a container; every descendant carrying
 * `[data-reveal]` is observed and gets `data-revealed="true"` once.
 *
 * This fails OPEN, deliberately. Content is visible by default; the hidden
 * starting state is only applied once this hook has set `data-reveal-ready` on
 * the container and has an observer running. So if JavaScript is disabled, the
 * bundle fails, or `IntersectionObserver` is unavailable, every card still
 * renders — an events listing that hides itself when a progressive enhancement
 * fails is far worse than one that simply doesn't animate.
 *
 * A safety sweep covers the remaining case: an observer that is constructed but
 * never delivers a callback (a background tab, or a non-compositing embedded
 * view). If nothing has been reported by `SAFETY_TIMEOUT_MS`, everything is
 * revealed and the observer is dropped.
 *
 * `key` should change whenever the observed children change, so newly rendered
 * cards get picked up.
 */
export function useReveal<T extends HTMLElement>(key?: unknown) {
  const containerRef = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect the user's motion preference — no hiding, no animation at all.
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') return;

    const targets = [
      ...container.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'),
    ];
    if (targets.length === 0) return;

    // Opting in before paint is what prevents a flash of visible content.
    container.setAttribute('data-reveal-ready', 'true');

    let acknowledged = false;

    const observer = new IntersectionObserver(
      (entries) => {
        acknowledged = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));

    const safety = window.setTimeout(() => {
      if (acknowledged) return;
      observer.disconnect();
      container
        .querySelectorAll<HTMLElement>('[data-reveal]')
        .forEach((el) => el.setAttribute('data-revealed', 'true'));
    }, SAFETY_TIMEOUT_MS);

    return () => {
      window.clearTimeout(safety);
      observer.disconnect();
    };
  }, [key]);

  return containerRef;
}
