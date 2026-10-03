# kept. — Birthday Gift Universe

> Some gifts get opened. Some gifts get kept.

Working brand name: **kept.** (placeholder — swap freely). A studio that turns a person's
memories into objects you can hand over: laser portraits, fridge magnets, photo keychains,
cake toppers, film strips, handwriting keepsakes.

---

## 1. Creative analysis

**Who** — 18–35, buying for a specific person, usually on a phone, usually a little late.
They don't start from "I need a keychain"; they start from "it's Maya's birthday and she's impossible".

**The page's single job** — make the visitor feel the site is *helping them find a gift for
someone*, not selling them inventory. Products are the last thing they see, not the first.

**The insight** — the most personal part of a custom gift is the *name on it*. So the very first
interaction asks for a name, and from that keystroke onward the whole site rebuilds itself
around that person: magnets spell it, the plaque engraves it, the polaroid captions it,
the manifesto shouts it, the footer counts down to it.

**Signature element** — **the fridge‑magnet name**. The hero's input *is* a row of chunky
alphabet magnets. Every letter you type drops onto the page as a glossy magnet in one of the
five accent colours — and simultaneously appears on every object on the desk around it.
It's playful, it is literally one of the products, and it's the screenshot moment.

Mix target: **70% brand experience · 20% discovery · 10% commerce.**

---

## 2. Design system

### Colour

| Token        | Hex       | Role                                    |
| ------------ | --------- | --------------------------------------- |
| `frosting`   | `#F1E8DA` | Base background (warm cream, cake icing) |
| `paper`      | `#FBF7F0` | Polaroids, notes, cards                 |
| `ink`        | `#1B1816` | Text, night sky, footer                 |
| `smudge`     | `#8A847B` | Secondary text                          |
| `rule`       | `#D9CFC0` | Hairlines                               |
| `blue`       | `#2747FF` | Accent — Electric Blue                  |
| `cherry`     | `#E3282F` | Accent — Cherry Red                     |
| `acid`       | `#C9F23D` | Accent — Acid Green                     |
| `bubble`     | `#FF9ACB` | Accent — Bubblegum Pink                 |
| `tangerine`  | `#FF6B1C` | Accent — Orange                         |

Material tokens for laser products: `maple #E2C29A`, `walnut #8A5A36`, `burn #3A2416`.

**One accent per section.** `--accent` is a registered CSS property (`@property`) so it
*transitions*; an observer swaps it as each section crosses the viewport centre.
The only place all five appear together is the magnets — that's the point.

### Type

| Role     | Face                  | Use                                                    |
| -------- | --------------------- | ------------------------------------------------------ |
| Display  | Bricolage Grotesque   | 800 / width 75 / uppercase / leading .82 — giant, cropped, overflowing |
| Body     | Bricolage Grotesque   | 400 / width 100 / optical size auto — one family, two voices |
| Utility  | Martian Mono          | Labels, prices, dates, specs — the "label maker"       |
| Hand     | Reenie Beanie         | Notes, captions, asides — the human on the desk        |
| Magnet   | Fredoka               | 700 / width 112 — only for fridge‑magnet letters       |

Scale (fluid): `mega` 19vw · `xxl` 10vw · `xl` 6vw · `lg` 2.6vw · body 1.0625rem · label 0.6875rem.

### Layout

No container-first thinking. Each section picks its own geometry:

```
HERO (desk)            UNIVERSE (pinned)        MANIFESTO (poster)
┌──────────────────┐   ┌──────────────────┐     ┌──────────────────┐
│▣      WHOSE    ◧ │   │ ·  ◫     ·    ✦  │     │MAKE──────────►   │
│   BIRTHDAY  ✎   │   │    M A Y A       │     │ ◄────MAYA─[▣]──  │
│ ✎  [M][A][Y][A] ▣│   │  ◧   24·03    ·  │     │REMEMBER─────►    │
│ ▣  born on 24 03 │   │ ✦  ·     ▣       │     │        the idea… │
│  (BUILD →)    ◧  │   │ some gifts get…  │     └──────────────────┘
└──────────────────┘   └──────────────────┘
STORIES (horizontal)   GIFT FOR (list)          QUIZ (game)
┌─────┬─────┬────►    ┌──────────────────┐     ┌──────────────────┐
│▣ TXT│TXT ▣│ ...     │FOR YOUR BEST FRI…│     │ 🕯🕯🕯 Q1/3       │
│     │     │         │FOR YOUR PARTNER ▣│     │ [card][card][..] │
└─────┴─────┴────►    │FOR YOUR MOM      │     │ → GIFT PROFILE   │
                      └──────────────────┘     └──────────────────┘
```

Mobile is re-composed, not shrunk: desk objects → swipeable strip; horizontal stories →
vertical story stack; cursor-follow previews → inline images; drag wall → marquee.

---

## 3. Home page structure

| # | Section          | Job                                                    | Accent     |
| - | ---------------- | ------------------------------------------------------ | ---------- |
| 0 | Intro            | Candle lit → blown out → page revealed (1.4s, once/session) | —     |
| 1 | Hero / desk      | "Whose birthday?" + magnet name + date + relationship; draggable desk objects that personalise live | tangerine |
| ↳ | Universe loader  | After submit: "Maya's birthday story is loading…" checklist | bubble |
| 2 | Gift universe    | Pinned fly-through of their personalised objects; cream → night | bubble |
| 3 | Manifesto        | MAKE / {MAYA} / REMEMBER — giant lines sliding across, plaque passing between them | cherry |
| 4 | Gift stories     | Six products as editorial spreads, horizontal scroll   | per story  |
| 5 | Before → after   | Drag a slider: photo → laser engraving / magnet / acrylic. Try your own photo (processed locally) | tangerine |
| 6 | Who are you gifting? | Relationship list with cursor-follow photos → recommendations | per row |
| 7 | Gift quiz        | 3 questions, candles as progress → shareable Gift Profile card | acid |
| 8 | Keep wall        | Draggable wall of things people had engraved           | blue       |
| 9 | Footer           | Process, birthday reminder, cropped wordmark           | bubble     |

Built: `/gift/[slug]` (product detail) and `/custom/[slug]` (workbench) — see README.
Next: `/explore`, `/quiz`, `/about`.

### Product detail — "the object's biography"

Not gallery-left / buy-box-right. An opening spread with a **paper swing tag** for the price,
then the making process as a pinned scroll story (photo → blueprint proof in brand blue →
laser scan → kraft gift box), a before/after of *what's on your phone* vs *what's on their shelf*,
then the practical details made physical: material swatches, sizes drawn to scale on a ruler,
a ship date checked against their birthday, prices as a studio receipt.

### Customizer — "the workbench"

Preview first: the object sits on a lit surface over the gift's accent disc, tilts toward the
pointer, grows with the size you pick. Choices are numbered because they are a sequence. Price,
delivery verdict and "Add to bag" stay pinned at the bottom. Phones get a sticky preview on top
and the controls scrolling beneath.

---

## 4. Motion language

- **Things have weight.** Objects use springs (stiffness ~300, damping ~22). Picking something up
  lifts it (scale 1.05, longer shadow); letting go settles it with a small overshoot.
- **Ink rises from a line.** Headlines reveal as masked lines sliding up
  (0.9s, `cubic-bezier(.16,1,.3,1)`, 60ms stagger). No fading paragraphs in from nowhere.
- **Scroll is the timeline.** Scenes are scrubbed, never autoplayed. Pinned scenes only where
  the story needs time (universe, stories).
- **The laser draws the reveal.** Transformations (photo → line → burn → product) are clip-path
  wipes led by a glowing scan line — the same motion the machine makes.
- **Ambient, not busy.** Idle float ±6px over 5–8s, staggered phases. Candle flames flicker. That's it.

Durations: micro 0.2s · UI 0.45s · reveal 0.9s · scenes scrubbed.

**Reduced motion** — no intro, no smooth scroll, no float/parallax, pinned scenes render as static
compositions, reveals become simple fades. **Touch** — no custom cursor, no drag on the desk,
no cursor-follow; tap replaces hover everywhere.

---

## 5. Core interactions

| Interaction        | Where                          | Detail                                          |
| ------------------ | ------------------------------ | ----------------------------------------------- |
| Live personalisation | Everywhere                   | Name/date/relationship in one context; every object reads it |
| Magnet typing      | Hero                           | Real `<input>` behind magnet glyphs; letters drop in with a spring |
| Drag the desk      | Hero, keep wall                | Pick up and throw objects; they stay where you leave them |
| Magnetic buttons   | All CTAs                       | Pull toward the pointer within ~80px, spring back |
| Custom cursor      | Desktop only                   | ● default · VIEW on gifts · DRAG on draggables · LET'S GO on CTAs |
| Laser stages       | Story card, before/after       | Canvas engraving computed client-side (Sobel line art + luminance hatching) |
| Before/after slider| Before/after                   | Pointer + keyboard; upload your own photo, never leaves the device |
| Relationship list  | Gift for                       | Cursor-follow photo + expanding recommendations |
| Quiz               | Quiz                           | Cards dealt in, candles light up, profile card result |

---

## 6. Tech

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Motion 14 · Lenis.
No WebGL — the "3D" universe is perspective math on 2D transforms (cheap, works on phones).
Images: `next/image` (lazy, responsive) from Unsplash for the demo; engraving uses the same
photos via CORS-enabled canvas.

```
src/
  app/            layout (fonts, providers) · page (composes sections) · globals.css (tokens)
  components/
    layout/       Navbar · Cursor · SmoothScroll · Intro · AccentObserver · Footer
    ui/           Magnetic · RevealText · MagnetWord · Button
    objects/      Polaroid · LaserPlaque · Keychain · Candle · Note · CakeTopper · FilmStrip · PhotoMagnet · HandTag
    home/         Hero · DeskObjects · UniverseLoader · GiftUniverse · Manifesto · GiftStories · LaserStages ·
                  BeforeAfter · GiftFor · GiftQuiz · KeepWall
  lib/            birthday (context + zodiac/countdown) · gifts (catalog) · photos · engrave (canvas) · hooks
```
