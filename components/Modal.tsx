'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Overlay wrapper for the intercepted `/events/[slug]` route.
 *
 * Closing calls `router.back()` so the URL and history stay in step with what
 * the user sees, and the filtered grid underneath keeps its React state.
 */
export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Lock the page behind the modal without letting the layout jump as the
    // scrollbar disappears.
    const { body } = document;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      // Trap focus inside the panel.
      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      previouslyFocused.current?.focus?.();
    };
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain p-0 sm:p-6"
      role="presentation"
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Event details"
        tabIndex={-1}
        className="relative z-10 my-0 w-full max-w-3xl overflow-hidden border-hairline bg-ink-raised shadow-2xl outline-none sm:my-4 sm:rounded-3xl sm:border"
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/80"
        >
          <span className="sr-only">Close</span>
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
            <path d="M13 1.4 11.6 0 7 4.6 2.4 0 1 1.4 5.6 6 1 10.6 2.4 12 7 7.4 11.6 12 13 10.6 8.4 6z" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
