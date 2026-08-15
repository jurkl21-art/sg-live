import type { PaletteKey } from './types';

/**
 * Event artwork is generated, not photographed.
 *
 * Real promotional images are copyrighted and must not be hotlinked, so every
 * card and detail hero renders a three-stop CSS gradient plus a typographic
 * treatment of the act's name. Palettes are chosen per event (loosely by genre)
 * so the grid reads as one designed set rather than random colour.
 */
export interface Palette {
  /** Three gradient stops, dark → vivid. */
  stops: [string, string, string];
  /** Colour of the radial bloom layered over the gradient. */
  bloom: string;
  /** Glow used on card hover. */
  glow: string;
}

export const PALETTES: Record<PaletteKey, Palette> = {
  // Warm Ibiza sunset — pop, big arena shows.
  sunset: {
    stops: ['#2A0A18', '#B3315C', '#FF8A3D'],
    bloom: 'rgba(255, 168, 92, 0.55)',
    glow: 'rgba(255, 138, 61, 0.45)',
  },
  // Hot neon pink — festivals, headline moments.
  neon: {
    stops: ['#1E0620', '#8E1A6B', '#FF3D77'],
    bloom: 'rgba(255, 92, 148, 0.5)',
    glow: 'rgba(255, 61, 119, 0.45)',
  },
  // Deep violet — house, techno, late-night electronic.
  violet: {
    stops: ['#120726', '#3D1B8C', '#7B2FFF'],
    bloom: 'rgba(148, 108, 255, 0.5)',
    glow: 'rgba(123, 47, 255, 0.45)',
  },
  // Ember red — rock, metal, alternative.
  ember: {
    stops: ['#210A08', '#8E2B1B', '#FF5A33'],
    bloom: 'rgba(255, 122, 82, 0.5)',
    glow: 'rgba(255, 90, 51, 0.42)',
  },
  // Cool teal — jazz, soul, indie, daytime.
  ocean: {
    stops: ['#04141C', '#116273', '#2FD9C5'],
    bloom: 'rgba(76, 226, 208, 0.45)',
    glow: 'rgba(47, 217, 197, 0.4)',
  },
  // Electric lime — K-pop, hyperpop, high-energy.
  acid: {
    stops: ['#0B1A06', '#3F7A17', '#9BE83A'],
    bloom: 'rgba(178, 240, 106, 0.42)',
    glow: 'rgba(155, 232, 58, 0.38)',
  },
  // Near-monochrome — moody, classical, cinematic.
  noir: {
    stops: ['#0A0A0F', '#2C2C3D', '#6E6E8C'],
    bloom: 'rgba(160, 160, 200, 0.35)',
    glow: 'rgba(140, 140, 180, 0.35)',
  },
  // Champagne gold — sport, premium, marquee.
  gold: {
    stops: ['#1E1405', '#8A5E12', '#FFC94A'],
    bloom: 'rgba(255, 213, 120, 0.5)',
    glow: 'rgba(255, 201, 74, 0.42)',
  },
};

/** `linear-gradient` string for an event's artwork block. */
export function gradientFor(key: PaletteKey): string {
  const { stops } = PALETTES[key];
  return `linear-gradient(155deg, ${stops[0]} 0%, ${stops[1]} 52%, ${stops[2]} 100%)`;
}

/** Soft off-centre radial bloom layered above the gradient. */
export function bloomFor(key: PaletteKey): string {
  const { bloom } = PALETTES[key];
  return `radial-gradient(120% 90% at 78% 8%, ${bloom} 0%, transparent 58%)`;
}

export function glowFor(key: PaletteKey): string {
  return PALETTES[key].glow;
}

/**
 * Up to two initials for the artwork's typographic mark.
 * Strips leading articles so "The Weeknd" reads as "TW", not "TT".
 */
export function initialsFor(title: string): string {
  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0 && !/^(the|a|an|and)$/i.test(w));

  const source = words.length > 0 ? words : title.split(/\s+/).filter(Boolean);
  if (source.length === 0) return '?';
  if (source.length === 1) return source[0].slice(0, 2).toUpperCase();
  return (source[0][0] + source[1][0]).toUpperCase();
}
