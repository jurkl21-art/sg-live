'use client';

import { type ViewMode, VIEW_MODE_LABELS } from '@/lib/types';

const ORDER: ViewMode[] = ['list', 'small', 'large'];

function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <rect x="1" y="2" width="14" height="2.3" rx="1.15" />
      <rect x="1" y="6.85" width="14" height="2.3" rx="1.15" />
      <rect x="1" y="11.7" width="14" height="2.3" rx="1.15" />
    </svg>
  );
}

function SmallGridIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <rect x="1" y="1" width="3.6" height="3.6" rx="0.8" />
      <rect x="6.2" y="1" width="3.6" height="3.6" rx="0.8" />
      <rect x="11.4" y="1" width="3.6" height="3.6" rx="0.8" />
      <rect x="1" y="6.2" width="3.6" height="3.6" rx="0.8" />
      <rect x="6.2" y="6.2" width="3.6" height="3.6" rx="0.8" />
      <rect x="11.4" y="6.2" width="3.6" height="3.6" rx="0.8" />
      <rect x="1" y="11.4" width="3.6" height="3.6" rx="0.8" />
      <rect x="6.2" y="11.4" width="3.6" height="3.6" rx="0.8" />
      <rect x="11.4" y="11.4" width="3.6" height="3.6" rx="0.8" />
    </svg>
  );
}

function LargeGridIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <rect x="1" y="1" width="6.5" height="6.5" rx="1.1" />
      <rect x="8.5" y="1" width="6.5" height="6.5" rx="1.1" />
      <rect x="1" y="8.5" width="6.5" height="6.5" rx="1.1" />
      <rect x="8.5" y="8.5" width="6.5" height="6.5" rx="1.1" />
    </svg>
  );
}

const ICONS: Record<ViewMode, React.ComponentType> = {
  list: ListIcon,
  small: SmallGridIcon,
  large: LargeGridIcon,
};

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/** List / small-grid / large-grid density switch for the event listings. */
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Event list layout"
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-hairline bg-white/4 p-1"
    >
      {ORDER.map((mode) => {
        const Icon = ICONS[mode];
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={active}
            title={VIEW_MODE_LABELS[mode]}
            onClick={() => onChange(mode)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
              active
                ? 'bg-gradient-to-r from-amber via-coral to-violet text-white'
                : 'text-faint hover:text-cream'
            }`}
          >
            <span className="sr-only">{VIEW_MODE_LABELS[mode]}</span>
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
