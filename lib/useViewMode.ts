'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { ViewMode } from './types';

/** Remembers the reader's preferred card density (list / small / large) across visits. */
const STORAGE_KEY = 'sg-live:view-mode';
const CHANGE_EVENT = 'sg-live:view-mode-change';
const DEFAULT_MODE: ViewMode = 'large';

function isViewMode(value: string | null): value is ViewMode {
  return value === 'large' || value === 'small' || value === 'list';
}

function readStored(): ViewMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isViewMode(saved) ? saved : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

function subscribe(callback: () => void) {
  // 'storage' fires only for changes made from OTHER tabs — the browser
  // deliberately doesn't fire it on the tab that made the write — so this
  // tab's own changes are broadcast via the custom event instead.
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

/**
 * The event grid's card density, persisted to localStorage and kept in sync
 * across tabs of this site.
 *
 * Built on `useSyncExternalStore` rather than a `useState` + `useEffect` pair:
 * the server (and the very first client render, pre-hydration) has no notion
 * of a saved preference, so both always resolve to 'large' — hydration can
 * never mismatch — and any stored preference is picked up immediately after
 * via the normal external-store subscription, not a manual effect.
 */
export function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const viewMode = useSyncExternalStore(subscribe, readStored, () => DEFAULT_MODE);

  const setViewMode = useCallback((mode: ViewMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage may be unavailable (private browsing, disabled cookies) — the
      // change event below still applies the mode for the rest of this session.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [viewMode, setViewMode];
}
