# kept. — birthday gift universe

A brand-first site for custom birthday gifts (laser portraits, fridge magnets, photo keychains,
cake toppers, film strips, handwriting keepsakes). The design rationale, tokens, motion language
and page plan live in [DESIGN.md](DESIGN.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (home is statically prerendered)
```

## What's built

The home page, end to end:

| Section | File |
| --- | --- |
| Candle intro (once per session) | `src/components/layout/Intro.tsx` |
| Hero desk — fridge-magnet name input, live-personalised draggable objects | `src/components/home/Hero.tsx`, `DeskObjects.tsx` |
| "Birthday story is loading…" overlay | `src/components/home/UniverseLoader.tsx` |
| Pinned 3D-ish fly-through universe | `src/components/home/GiftUniverse.tsx` |
| MAKE / {NAME} / REMEMBER manifesto | `src/components/home/Manifesto.tsx` |
| Six gift stories (horizontal on desktop) + laser stages | `GiftStories.tsx`, `GiftScenes.tsx`, `LaserStages.tsx` |
| Before → after slider, "use your own photo" (processed locally) | `src/components/home/BeforeAfter.tsx` |
| "What kind of person are you gifting?" | `src/components/home/GiftFor.tsx` |
| Gift quiz → shareable profile card | `src/components/home/GiftQuiz.tsx`, `src/lib/quiz.ts` |
| Gift-message wall (drag / copy) | `src/components/home/KeepWall.tsx` |
| Footer with birthday reminder | `src/components/layout/Footer.tsx` |

Global pieces: floating capsule nav, custom cursor (`data-cursor="view|drag|cta|…"`), magnetic
buttons, Lenis smooth scroll, per-section accent colour (`data-accent`).

Personalisation state (name, birthday, relationship) lives in `src/lib/birthday.tsx` and is
saved to `localStorage`. The laser engraving is computed client-side in `src/lib/engrave.ts`.

## Product detail — `/gift/[slug]`

Six statically generated pages (`src/app/gift/[slug]/page.tsx`), sections in `src/components/gift/`:

| Section | What it does |
| --- | --- |
| `ProductHero` | Headline, live object, specs, and a swinging paper price tag that opens the workbench |
| `MakingProcess` | Four steps; the visual is pinned and swaps as you scroll — your photo → blueprint proof → laser scan → gift box |
| `ProductCompare` | "What you send / what they get" on a drag slider |
| `ProductDetails` | Material swatches, sizes drawn to scale on a ruler, ship date + "arrives before their birthday?" check, price list as a receipt |
| `MakeItTheirs` | Every option the workbench offers, listed like a menu |
| `ProductFaq`, `PairsWith`, `BuyBar` | Questions, related gifts, floating "Make yours" capsule |

Content per gift (process steps, sizes, FAQ, pairings) lives in `src/lib/giftDetails.ts`.

## Customizer — `/custom/[slug]`

The workbench (`src/components/custom/`): live preview that tilts toward the pointer and scales
with the chosen size; numbered options per gift (photo, style, material, words, size); live price;
delivery check against the birthday; add to bag. Upload once and the photo carries across gifts.
Option definitions, pricing and bag summaries are in `src/lib/customize.ts`. `/custom` redirects
to the laser portrait.

The bag (`src/lib/bag.tsx`) persists in localStorage and shows in the navbar. Client navigations
play a title-card curtain (`PageCurtain`); same-page hash links stay smooth-scrolled (`SmartLink`).

## Deploy

Vercel runs Next.js with zero config — no `vercel.json` and no environment variables needed.
Node 20.9+ is required (pinned in `package.json` `engines` and `.nvmrc`).

**Option A — from GitHub (recommended: every push gets a preview link)**

1. Create an empty repo on GitHub, then in this folder:
   `git remote add origin <repo-url>` and `git push -u origin main`.
2. Go to vercel.com/new, import the repo. Framework preset: Next.js. Leave everything else as is.
3. Deploy. The URL works on any phone — use it to test on real devices (especially iPhone Safari).

**Option B — straight from this machine**

1. `npx vercel` — log in, accept the defaults. This creates a preview deployment.
2. `npx vercel --prod` when you're happy with it.

Before a public launch: replace the Unsplash demo photos, and note that checkout isn't wired to a
backend yet (see below).

## Placeholders to replace before launch

- **Photos** come from Unsplash (`src/lib/photos.ts`) — swap for real product and customer photos.
- **Brand name** "kept." is a working name.
- **Prices, sizes, making times** in `src/lib/gifts.ts` / `giftDetails.ts` are illustrative.
- **Checkout and the reminder form** aren’t wired to a backend. Uploaded photos stay in the browser;
  checkout would need to upload them.

## Next pages

`/explore`, `/quiz`, `/about`.
