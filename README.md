# SG Live

A curated guide to international music and marquee sport in Singapore over the next 12 months, plus the major music festivals elsewhere in Southeast Asia.

Built as a static Next.js app with hand-researched local data — no backend, no database, no scraping.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (prerenders a page per event) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` — catches malformed event data |

Requires Node 20 or newer.

---

## Tech stack

- **Next.js 16** (App Router) · React 19 · TypeScript (strict)
- **Tailwind CSS v4** — configured in CSS via `@theme` in `app/globals.css`; there is no `tailwind.config.js`
- **Fonts** — Space Grotesk (display) and Inter (body), self-hosted at build time by `next/font`
- **No runtime dependencies beyond the framework.** No animation library, no UI kit, no image CDN.

---

## Deploying to Vercel

The project is zero-config on Vercel — there is no `vercel.json` and nothing to set up.

**Option A — Git import (recommended)**

1. Push this directory to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Accept the detected defaults (Framework: Next.js, Build: `next build`, Output: `.next`).
4. Deploy. Every push to the default branch redeploys; pull requests get preview URLs.

**Option B — CLI**

```bash
npx vercel deploy
```

Add `--prod` to promote straight to production.

No environment variables are required.

### One thing to change after deploying

`app/layout.tsx` sets `metadataBase` to `https://sg-live.vercel.app`. Point it at your real domain so Open Graph and canonical URLs resolve correctly.

---

## Updating the event data

All event data lives in **[`data/events.ts`](data/events.ts)** — one array, one file, heavily commented. This is a manually curated dataset, not a live feed, so it needs a periodic refresh.

### The refresh routine

1. Open `data/events.ts`.
2. Add, amend or remove entries in the `events` array.
3. **Bump `LAST_UPDATED`** to the date you did the research. This drives the "Last updated" indicator in the header and footer.
4. Run `npm run typecheck` — the schema is a discriminated union, so it will reject a music genre applied to a sports event, an unknown palette, or a missing required field.
5. Run `npm run build` to confirm, then deploy.

**You do not need to delete events that have passed.** `getUpcoming()` in `lib/filters.ts` prunes anything that has finished and anything beyond a rolling 12-month horizon, both measured from the current date. The homepage revalidates every 24 hours, so the listing stays current between refreshes.

### Where the data comes from

Every entry carries a required `sourceUrl` — the page where its date was verified. That is what makes the dataset auditable months later, and it is surfaced in the UI as a "Verify this listing" link.

Sources used for the current dataset:

| Type | Sources |
| --- | --- |
| Concerts | [Songkick Singapore](https://www.songkick.com/metro-areas/32258-singapore-singapore), [Ticketmaster SG](https://ticketmaster.sg/), AsiaOne concert calendars, Harper's Bazaar SG, Bandwagon Asia |
| Venues | Singapore Indoor Stadium, National Stadium, The Star Theatre, Capitol Theatre, Esplanade |
| Sport | [singaporegp.sg](https://singaporegp.sg/en/), [LIV Golf](https://www.livgolf.com/), [SVNS](https://www.svns.com/en/events/singapore), [WTA](https://www.wtatennis.com/), LPGA, SportSG |
| Clubs | [Zouk Group](https://zoukgroup.com/singapore/events/), Marquee Singapore, CÉ LA VI, [RA](https://ra.co/) |
| Regional festivals | Official sites for Tomorrowland Thailand, Wonderfruit, Djakarta Warehouse Project, CircoLoco, Siam Songkran, Maho Rasop |

### The data schema

```ts
{
  id: string;          // kebab-case slug — also the /events/[slug] URL. Must be unique.
  kind: 'music' | 'sports';
  scope: 'singapore' | 'regional';
  title: string;       // artist, band, DJ or event name
  subtitle?: string;   // tour or edition name
  genres: MusicGenre[];      // music events only
  categories: SportCategory[]; // sports events only
  venue: string;
  area: string;        // district — "Kallang", "Marina Bay", "Sentosa"
  city: string;
  country: string;
  startDate: string;   // ISO YYYY-MM-DD
  endDate?: string;    // multi-day runs only
  time?: string;       // 24h HH:MM, when published
  status: 'confirmed' | 'on-sale-soon' | 'tbc';
  ticketUrl?: string;
  sourceUrl: string;   // REQUIRED — where the date was verified
  summary: string;     // 1–3 sentences: vibe, why it matters, notable details
  featured?: boolean;  // drives the hero and the headline ticker
  palette: PaletteKey; // named gradient, see lib/gradients.ts
  priceFrom?: string;  // display string, e.g. "S$138"
}
```

Available genres: `house-techno-edm`, `hip-hop-rnb`, `pop`, `rock-alternative`, `jazz-soul`, `festival`. (K-pop and Mandopop/C-pop are deliberately excluded — see "Assumptions and decisions" below.)
Available sport categories: `motorsport`, `golf`, `rugby`, `tennis`, `running`, `other`.
Available palettes: `sunset`, `neon`, `violet`, `ember`, `ocean`, `acid`, `noir`, `gold`.

---

## Project structure

```
app/
  layout.tsx                    fonts, metadata, dark shell, modal slot
  globals.css                   design tokens, grain, reduced-motion kill switch
  page.tsx                      hero + explorer + regional block
  not-found.tsx
  events/[slug]/page.tsx        standalone event page (prerendered per event)
  @modal/
    default.tsx
    (.)events/[slug]/page.tsx   same route, intercepted as a modal
components/
  Hero · EventExplorer · SectionTabs · FilterBar · EventGrid
  EventCard · EventDetail · Modal · Artwork · Badges · RegionalSection · Footer
lib/
  types.ts       schema + label maps
  filters.ts     pure filter/search/sort helpers
  dates.ts       Singapore-time date handling and formatting
  gradients.ts   generated artwork palettes
  useReveal.ts   scroll-reveal hook
data/
  events.ts      ← the only file you need to edit to update listings
```

### How the event detail view works

Clicking a card soft-navigates to a real `/events/[slug]` URL and renders the detail in a **modal**, with the filtered grid still mounted underneath — so filters and scroll position survive opening and closing an event. A direct visit, a refresh or a shared link falls through to the **standalone page** at the same URL, with its own Open Graph metadata.

Both render the same `EventDetail` component, so the two views can't drift apart. This uses Next.js parallel + intercepting routes (`app/@modal/(.)events/[slug]`).

---

## Assumptions and decisions

These were judgement calls made during the build. All are easy to reverse.

**Generated artwork, not photographs.** Promotional images for these events are copyrighted and shouldn't be hotlinked, so every card and detail hero renders a CSS gradient plus a typographic mark built from the event's own name. Palettes are assigned per event, loosely by genre, so the grid reads as one designed set. To switch to real imagery later, add an `image` field to the schema and swap `components/Artwork.tsx`.

**Club nights are thin in the back half of the window.** Zouk, Marquee and CÉ LA VI announce bookings roughly 4–6 weeks out, so House/Techno listings beyond the next couple of months are festivals rather than club nights. This is the category that needs the most frequent refresh.

**Unconfirmed events are included, and labelled.** Recurring events whose next edition hasn't been formally announced (LIV Golf Singapore 2027, ZoukOut, the HSBC Women's World Championship) are listed with dates projected from the previous edition and a visible **Date TBC** badge, plus an explicit warning in the detail view. The alternative — omitting them — would leave large gaps in a calendar that people use for planning.

**Local Singaporean artists are out of scope.** The brief asked for international touring acts, so homegrown headliners aren't listed even when they're playing the same venues.

**K-pop, Mandopop and C-pop are out of scope.** A deliberate later decision, not an oversight — these genres previously made up a large share of the calendar. `MusicGenre` in `lib/types.ts` no longer has a `'k-pop'` or `'mandopop'` member, so `npm run typecheck` will reject any entry tagged with either; that's intentional friction against silently reintroducing them. To bring them back, restore the two genre values (and their labels) in `lib/types.ts`, remove the exclusion notes in that file and at the top of `data/events.ts`, and re-run a research pass.

**Filter state is React state, not URL state.** Because opening an event is a soft navigation, filters survive it. The trade-off is that a filtered view isn't shareable as a URL. If that matters, lift the state in `components/EventExplorer.tsx` into `useSearchParams`.

**The site is dark-only.** It commits to the nightlife treatment rather than offering a light theme, and declares `color-scheme: dark` so form controls and scrollbars match.

**Motion fails open.** Scroll reveals are a progressive enhancement: cards are visible by default and the hidden-then-reveal state is only applied once `useReveal` has an observer running, with a timeout that reveals everything if no observer callback ever arrives. `prefers-reduced-motion: reduce` disables all animation via a single global block in `globals.css`.

---

## Out of scope for v1

No accounts or login, no ticket purchasing or checkout, no scraping backend or cron jobs, and no CMS or admin panel. Listings link out to official ticketing pages.

---

## Accuracy

Event data is compiled from public listings and official promoter pages and is accurate as at the `LAST_UPDATED` date shown in the app. Dates move. Always confirm with the official promoter or ticketing page before booking travel. This project is not affiliated with any artist, venue, promoter or rights holder.
