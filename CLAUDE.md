# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SG Live — a Next.js site listing international touring music events and marquee sports events in Singapore over a rolling 12-month window, plus Southeast Asia festival highlights. Statically rendered, no backend, no database. All content lives in one hand-curated TypeScript data file.

## Commands

```bash
npm run dev         # dev server (Turbopack)
npm run build        # production build — prerenders a page per event
npm run start         # serve the production build
npm run lint          # ESLint (flat config, next/core-web-vitals + next/typescript)
npm run typecheck     # tsc --noEmit
```

There is no test suite/framework in this repo (no test script, no Jest/Vitest/Playwright).

**Do not run `npm run build` while `npm run dev` is running against the same directory.** Both write to `.next` and will corrupt each other's state (symptoms: blank page, stale Turbopack chunk errors, a font-fetch `404`/`module-not-found` that has nothing to do with fonts). Stop the dev server first, or if it's already broken: `rm -rf .next` and restart.

## Deployment

Production deploys are **git-push driven**, not CLI-driven: the Vercel project is connected to the GitHub repo via Vercel's Git integration, so pushing to `main` auto-builds and auto-deploys to production. Don't run `vercel deploy` as part of a normal change — just `git push`. See the README for one-time setup details if the Git integration is ever reconnected from scratch.

## Architecture

### Single source of truth: `data/events.ts`

Every event — Singapore music, Singapore sports, regional SEA festivals — is one entry in one exported array (`events: SGEvent[]`), typed as a discriminated union on `kind` (`lib/types.ts`): a `music` event carries `genres: MusicGenre[]`, a `sports` event carries `categories: SportCategory[]`, and TypeScript rejects mixing them. Every entry requires a `sourceUrl` (where its date was verified) — this is what makes the hand-curated dataset auditable on refresh. `LAST_UPDATED` in that file drives the "Last updated" UI indicator and must be bumped whenever the data changes.

The file has no expiry logic itself — pruning is a runtime concern (see below), so past events are safe to leave in place rather than deleted.

### Date handling is Singapore-anchored and string-based

`lib/dates.ts` treats dates as `YYYY-MM-DD` strings anchored to `Asia/Singapore`, not JS `Date` objects compared across timezones — this is deliberate, to avoid server/client hydration mismatches and off-by-one days for readers outside SGT. `todayInSingapore()` is the one place "now" is computed; almost everything else (`lib/filters.ts`) takes `todayISO` as a plain argument so it stays pure and testable. The rolling 12-month window and "this month / next 3 months / later" buckets are derived from that value, not hardcoded — the site ages itself between data refreshes rather than needing a code change.

### Event detail: parallel + intercepting routes

`app/events/[slug]/page.tsx` is the real, statically-generated, shareable page (`generateStaticParams` over every event, its own `generateMetadata`). `app/@modal/(.)events/[slug]/page.tsx` intercepts in-app navigation to that same URL and renders `EventDetail` inside `components/Modal.tsx` instead, on top of the still-mounted, still-filtered grid — so opening/closing an event preserves scroll position and filter state. Both routes render the exact same `EventDetail` component so the two views can't drift apart. A direct visit, hard refresh, or shared link always lands on the real page, never the modal.

### Filtering is pure functions + one stateful component

`lib/filters.ts` has no React in it — `filterEvents`, `getUpcoming`, `searchMatch`, `bucketOf`, `tagsOf`, etc. are plain functions over `SGEvent[]`. Most of the interactive state (selected tags, date bucket, search query, view mode) lives in `components/EventExplorer.tsx`, which is otherwise the only place that composes those pure helpers. Regional festivals are filtered separately and more simply in `components/RegionalSection.tsx` (own country filter, no tag/date filtering) — it deliberately never mixes with the Singapore sections.

Filter/view state is plain React state, not URL-synced. That's intentional: because opening an event is a soft navigation (see above), state survives it for free. The tradeoff is a filtered view isn't itself shareable as a URL.

### The Music/Sport tab lives above `EventExplorer`, because a sibling needs it

`page.tsx` is a server component, so it can't hold the active-tab state itself, but that state can't live inside `EventExplorer` either: the regional SEA festivals block (`components/RegionalSection.tsx`) is music-only content and must disappear when the Sport tab is active, and it renders as `EventExplorer`'s sibling, not its child. `components/SingaporeAndRegional.tsx` is the thin client wrapper that resolves this — it owns `kind` and passes it into `EventExplorer` as a controlled prop (`kind`/`onKindChange`), then conditionally renders `RegionalSection` alongside it. If you need to add another cross-section behavior gated on the active tab, it belongs in this wrapper, not in `EventExplorer`.

### View mode persistence uses `useSyncExternalStore`, not `useState`+`useEffect`

`lib/useViewMode.ts` persists the grid's card density (list/small/large) to `localStorage` and syncs it across tabs via a custom `window` event (native `storage` events don't fire on the tab that made the write). It's built on `useSyncExternalStore` specifically — an earlier `useState` + `useEffect(() => localStorage.getItem(...))` version got rejected by the `react-hooks/set-state-in-effect` lint rule and also risked a hydration mismatch. If you need another piece of state to persist similarly, follow this file's pattern rather than reaching for an effect.

### No images — all event artwork is generated

`lib/gradients.ts` defines ~8 named `PaletteKey` gradients; `components/Artwork.tsx` renders one per event (a gradient + the artist's own initials, cropped large) instead of a photo. This is a hard constraint, not a placeholder-until-real-images plan: promotional photography for these events is copyrighted and must never be hotlinked. `palette` is chosen per event loosely by genre so the grid reads as one designed system.

### Scroll-reveal fails open by design

`lib/useReveal.ts` drives the fade-up-on-scroll animation via `IntersectionObserver`, but the hidden starting CSS state (`app/globals.css`, scoped under `[data-reveal-ready]`) is only ever applied once the hook has an observer running — content is visible by default. A safety timeout (1200ms) reveals everything unconditionally if the observer never reports back. This means a JS failure, a disabled/unavailable `IntersectionObserver`, or (as seen when debugging in an automated/backgrounded browser tab where `document.hidden` stays `true`) a throttled compositor can never leave real content permanently invisible — worst case it just doesn't animate in. Don't "simplify" this by hiding content unconditionally in CSS.

### Styling: Tailwind v4, CSS-first, no config file

There is no `tailwind.config.js`. Design tokens (`--color-*`, `--font-*`, fluid type sizes) are declared in `app/globals.css` via `@theme`, and custom utilities (`grain`, `text-sunset`, `sr-only-focusable`) via `@utility`. `prefers-reduced-motion` is handled once, globally, at the bottom of that file — new animation should not need its own reduced-motion override.

### Content scope: genre/nationality exclusions are deliberate, not gaps

Two standing exclusions apply when adding or refreshing Singapore music entries — both explained in the `SCOPE` comment at the top of `data/events.ts`, and both binding on the weekly automated refresh routine as well as manual edits:

- **K-pop, Mandopop and C-pop are excluded, enforced at the type level.** `MusicGenre` in `lib/types.ts` has no `'k-pop'` or `'mandopop'` member, so tagging an entry with either fails `npm run typecheck`. Don't work around this by inventing an adjacent genre value — it's a deliberate site-scope decision, not an oversight.
- **Thai and Indonesian artists performing in Singapore are excluded too, but this one can't be type-checked** — an artist's nationality isn't a schema field (`country` on an event is the venue's country, not the performer's). It relies on judgment at research/curation time. This does **not** apply to the regional block: festivals actually hosted in Thailand or Indonesia (Wonderfruit, Tomorrowland Thailand, Djakarta Warehouse Project) stay in scope, since those are curated multi-artist events, not "a Thai/Indonesian artist" in the sense this exclusion targets.

### Data refresh workflow

A weekly scheduled cloud routine re-researches events and pushes directly to `main` (auto-deploying via the Git integration above). When refreshing data by hand instead: edit `data/events.ts`, bump `LAST_UPDATED`, run `npm run typecheck` (catches a genre/category mismatch or a missing required field), then `npm run build` before pushing. See the README's "Updating the event data" section for the source list and schema field reference.
