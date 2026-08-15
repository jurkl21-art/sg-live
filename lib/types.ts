/**
 * Core domain types for SG Live.
 *
 * The event list is a discriminated union on `kind`, so a music event can only
 * carry `genres` and a sports event can only carry `categories`. That keeps
 * `data/events.ts` honest when it is edited by hand.
 */

/** Named gradient key — see `lib/gradients.ts`. All artwork is CSS, no bitmaps. */
export type PaletteKey =
  | 'sunset'
  | 'neon'
  | 'violet'
  | 'ember'
  | 'ocean'
  | 'acid'
  | 'noir'
  | 'gold';

/**
 * How solid is this listing?
 *  - `confirmed`    date + venue locked, tickets generally on sale
 *  - `on-sale-soon` announced with a date, but tickets not yet released
 *  - `tbc`          edition is expected but the date/venue/lineup is unconfirmed
 */
export type EventStatus = 'confirmed' | 'on-sale-soon' | 'tbc';

/** `singapore` events show in the main sections; `regional` in the SEA block. */
export type Scope = 'singapore' | 'regional';

export type EventKind = 'music' | 'sports';

export type MusicGenre =
  | 'house-techno-edm'
  | 'hip-hop-rnb'
  | 'pop'
  | 'rock-alternative'
  | 'k-pop'
  | 'mandopop'
  | 'jazz-soul'
  | 'festival';

export type SportCategory =
  | 'motorsport'
  | 'golf'
  | 'rugby'
  | 'tennis'
  | 'running'
  | 'other';

/** Union of every tag value, used by the generic filter machinery. */
export type EventTag = MusicGenre | SportCategory;

interface EventBase {
  /** kebab-case slug — also the `/events/[slug]` URL segment. Must be unique. */
  id: string;
  /** Artist, band, DJ, or event name. */
  title: string;
  /** Tour or edition name, e.g. "After Hours Til Dawn". */
  subtitle?: string;
  venue: string;
  /** City area / district, e.g. "Kallang", "Marina Bay", "Sentosa". */
  area: string;
  city: string;
  country: string;
  /** ISO `YYYY-MM-DD`. */
  startDate: string;
  /** ISO `YYYY-MM-DD`. Only set for multi-day or multi-night runs. */
  endDate?: string;
  /** 24h `HH:MM` local time, when published. */
  time?: string;
  status: EventStatus;
  /** Official ticketing page, when one exists. */
  ticketUrl?: string;
  /**
   * Where the date was verified. Required — it is what makes this hand-curated
   * dataset auditable when it is refreshed later.
   */
  sourceUrl: string;
  /** 1–3 sentences: the vibe, why it matters, notable details. */
  summary: string;
  /** Eligible for the hero rotation. Keep this to genuinely marquee events. */
  featured?: boolean;
  palette: PaletteKey;
  /** Display string, e.g. "S$138". */
  priceFrom?: string;
}

export type MusicEvent = EventBase & {
  kind: 'music';
  scope: Scope;
  genres: MusicGenre[];
};

export type SportsEvent = EventBase & {
  kind: 'sports';
  scope: 'singapore';
  categories: SportCategory[];
};

export type SGEvent = MusicEvent | SportsEvent;

/** Date buckets offered by the date filter. */
export type DateBucket = 'all' | 'this-month' | 'next-3-months' | 'later';

/** Every tag on an event, regardless of kind. */
export function tagsOf(event: SGEvent): EventTag[] {
  return event.kind === 'music' ? event.genres : event.categories;
}

export const MUSIC_GENRE_LABELS: Record<MusicGenre, string> = {
  'house-techno-edm': 'House / Techno / EDM',
  'hip-hop-rnb': 'Hip-Hop / R&B',
  pop: 'Pop',
  'rock-alternative': 'Rock / Alternative',
  'k-pop': 'K-Pop',
  mandopop: 'Mandopop / C-Pop',
  'jazz-soul': 'Jazz / Soul',
  festival: 'Festival',
};

export const SPORT_CATEGORY_LABELS: Record<SportCategory, string> = {
  motorsport: 'Motorsport',
  golf: 'Golf',
  rugby: 'Rugby',
  tennis: 'Tennis',
  running: 'Running',
  other: 'Other',
};

export const TAG_LABELS: Record<EventTag, string> = {
  ...MUSIC_GENRE_LABELS,
  ...SPORT_CATEGORY_LABELS,
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  confirmed: 'On sale',
  'on-sale-soon': 'On sale soon',
  tbc: 'Date TBC',
};

export const DATE_BUCKET_LABELS: Record<DateBucket, string> = {
  all: 'All dates',
  'this-month': 'This month',
  'next-3-months': 'Next 3 months',
  later: 'Later',
};
