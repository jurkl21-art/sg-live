import { bloomFor, gradientFor, initialsFor } from '@/lib/gradients';
import type { PaletteKey } from '@/lib/types';

interface ArtworkProps {
  title: string;
  palette: PaletteKey;
  /** `card` for the grid, `hero` for the detail view's larger banner. */
  variant?: 'card' | 'hero';
  className?: string;
}

/**
 * Generated event artwork.
 *
 * Promotional photography for these events is copyrighted and can't be
 * hotlinked, so every event gets a CSS gradient plus a typographic mark built
 * from its own name. Decorative only — the accessible name always comes from
 * the surrounding heading, so this is hidden from assistive tech.
 */
export function Artwork({ title, palette, variant = 'card', className = '' }: ArtworkProps) {
  const initials = initialsFor(title);

  return (
    <div
      aria-hidden="true"
      className={`grain relative overflow-hidden ${className}`}
      style={{ background: gradientFor(palette) }}
    >
      <div
        className="animate-drift absolute inset-0"
        style={{ background: bloomFor(palette) }}
      />

      {/* Oversized initials, cropped by the frame — reads as art direction
          rather than as a placeholder avatar. */}
      <span
        className={`font-display absolute font-bold text-white/85 mix-blend-soft-light select-none ${
          variant === 'hero'
            ? '-bottom-[14%] -left-[3%] text-[13rem] sm:text-[19rem]'
            : '-bottom-[16%] -left-[4%] text-[9rem] sm:text-[11rem]'
        } leading-none tracking-tighter`}
      >
        {initials}
      </span>

      {/* Grounds the bottom edge so overlaid text stays legible. */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}
