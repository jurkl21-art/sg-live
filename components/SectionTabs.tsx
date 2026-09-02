'use client';

interface SectionTabsProps<T extends string> {
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
}

/**
 * Shared pill tablist for the three top-level sections (Music / Sport /
 * Regional). Lives above `EventExplorer` and `RegionalSection` — in
 * `SingaporeAndRegional` — because it decides which of those two sibling
 * components is rendered, not something either of them can own itself.
 */
export function SectionTabs<T extends string>({ tabs, active, onChange }: SectionTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Event section"
      className="inline-flex rounded-full border border-hairline bg-white/4 p-1"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          type="button"
          aria-selected={active === tab.value}
          onClick={() => onChange(tab.value)}
          className={`font-display rounded-full px-6 py-2.5 text-base font-bold tracking-tight transition-all duration-300 sm:px-8 sm:text-lg ${
            active === tab.value
              ? 'bg-gradient-to-r from-amber via-coral to-violet text-white'
              : 'text-muted hover:text-cream'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
