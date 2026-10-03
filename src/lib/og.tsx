import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { ACCENTS } from "./accents";
import { DETAILS } from "./giftDetails";
import { GIFT_ORDER, GIFTS, type GiftId } from "./gifts";
import { PHOTOS, type PhotoKey } from "./photos";
import type { Profile } from "./quiz";

/*
 * Share images (Open Graph / iMessage / WhatsApp previews), rendered by next/og.
 * The renderer only understands inline styles and flexbox, and every element with
 * more than one child needs display:flex — hence the verbose markup below.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const C = {
  frosting: "#f1e8da",
  paper: "#fbf7f0",
  ink: "#1b1816",
  smudge: "#8a847b",
};

const FONT_DIR = join(process.cwd(), "src/assets/fonts");
let fontsPromise: Promise<Array<{ name: string; data: Buffer; weight: 400 | 500 | 700 | 800; style: "normal" }>> | null = null;

export function ogFonts() {
  fontsPromise ??= Promise.all(
    (["display", "body", "mono", "hand", "magnet"] as const).map((f) => readFile(join(FONT_DIR, `${f}.ttf`))),
  ).then(([display, body, mono, hand, magnet]) => [
    { name: "Display", data: display, weight: 800, style: "normal" },
    { name: "Body", data: body, weight: 500, style: "normal" },
    { name: "Mono", data: mono, weight: 400, style: "normal" },
    { name: "Hand", data: hand, weight: 400, style: "normal" },
    { name: "Magnet", data: magnet, weight: 700, style: "normal" },
  ]);
  return fontsPromise;
}

/** JPEG explicitly — the renderer can't decode AVIF/WebP. */
const jpg = (key: PhotoKey, w: number, h: number) =>
  `https://images.unsplash.com/photo-${PHOTOS[key]}?fm=jpg&fit=crop&w=${w}&h=${h}&q=72`;

/** Font size that fits the longest line into `width` (condensed display ≈ 0.5em per character). */
const fit = (lines: string[], width: number, max: number) =>
  Math.min(max, Math.floor(width / (Math.max(...lines.map((l) => l.length)) * 0.5)));

const pad = (n: number) => String(n).padStart(2, "0");

function Label({ children, color = C.smudge, size = 20 }: { children: ReactNode; color?: string; size?: number }) {
  return (
    <div style={{ display: "flex", fontFamily: "Mono", fontSize: size, letterSpacing: 1.5, textTransform: "uppercase", color }}>
      {children}
    </div>
  );
}

function Wordmark({ accent, color = C.ink, size = 60 }: { accent: string; color?: string; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", fontFamily: "Display", fontSize: size, lineHeight: 0.8, color }}>
      kept
      <div style={{ width: size * 0.26, height: size * 0.26, borderRadius: size, background: accent, marginLeft: 4, marginBottom: 2 }} />
    </div>
  );
}

function Polaroid({ photo, caption, width, rotate }: { photo: PhotoKey; caption: string; width: number; rotate: number }) {
  const inner = width - 40;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: C.paper,
        padding: "20px 20px 18px",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 30px 60px rgba(27, 24, 22, 0.35)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
      <img src={jpg(photo, inner * 2, Math.round(inner * 1.12) * 2)} width={inner} height={Math.round(inner * 1.12)} alt="" style={{ objectFit: "cover" }} />
      <div style={{ display: "flex", fontFamily: "Hand", fontSize: 44, lineHeight: 1, marginTop: 12, color: C.ink }}>{caption}</div>
    </div>
  );
}

const MAGNETS: Array<[string, string, string, number]> = [
  ["K", "#e3282f", "#9a1218", -8],
  ["E", "#2747ff", "#1426a8", 5],
  ["P", "#c9f23d", "#86a61a", -4],
  ["T", "#ff6b1c", "#b8430a", 7],
];

/** Site-wide default: the brand line and a fridge door. */
export function HomeCard() {
  const accent = ACCENTS.tangerine.color;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.frosting, color: C.ink }}>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 64,
          width: 430,
          height: 500,
          display: "flex",
          flexDirection: "column",
          borderRadius: 30,
          backgroundImage: "linear-gradient(160deg, #f1f0ec, #cfcdc7)",
          boxShadow: "0 30px 60px rgba(27, 24, 22, 0.3)",
          transform: "rotate(3deg)",
          padding: "36px 34px",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {MAGNETS.map(([ch, face, shade, r]) => (
            <div
              key={ch}
              style={{
                display: "flex",
                fontFamily: "Magnet",
                fontSize: 128,
                lineHeight: 1,
                color: face,
                textShadow: `0 7px 0 ${shade}, 0 16px 18px rgba(27, 24, 22, 0.25)`,
                transform: `rotate(${r}deg)`,
              }}
            >
              {ch}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", position: "absolute", left: 48, bottom: 40 }}>
          <Polaroid photo="beagle" caption="best boy" width={220} rotate={-7} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 146,
            bottom: 300,
            width: 26,
            height: 26,
            borderRadius: 13,
            background: "#e3282f",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 660, height: "100%", padding: "56px 0 52px 64px" }}>
        <Label>Birthday gifts they’ll actually keep</Label>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontSize: 108, lineHeight: 0.84, textTransform: "uppercase" }}>
          <div style={{ display: "flex" }}>Some gifts</div>
          <div style={{ display: "flex" }}>get opened.</div>
          <div style={{ display: "flex", color: accent }}>Some get kept.</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
          <Wordmark accent={accent} />
          <Label>Made from your photos</Label>
        </div>
      </div>
    </div>
  );
}

const CAPTIONS: Record<GiftId, string> = {
  "laser-portrait": "mid-laugh, 23:41",
  "magnet-set": "best boy",
  "photo-keychain": "the whole crew",
  "cake-topper": "happy 30th",
  "film-strip": "our year",
  handwriting: "love you more x",
};

/** One gift — the product page, or the workbench for it. */
export function GiftCard({ id, mode }: { id: GiftId; mode: "product" | "workbench" }) {
  const gift = GIFTS[id];
  const accent = ACCENTS[gift.accent];
  const lines = mode === "product" ? gift.headline : ["Make it", "theirs."];
  const size = fit(lines, 600, 120);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.frosting, color: C.ink }}>
      <div style={{ position: "absolute", right: -150, top: -100, width: 830, height: 830, borderRadius: 415, background: accent.color }} />
      <div style={{ display: "flex", position: "absolute", right: 110, top: 70 }}>
        <Polaroid photo={gift.photo} caption={CAPTIONS[id]} width={380} rotate={5} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 680, height: "100%", padding: "56px 0 52px 64px" }}>
        <Label>
          {mode === "product" ? `Gift ${pad(GIFT_ORDER.indexOf(id) + 1)}/${pad(GIFT_ORDER.length)} — ${gift.name}` : `The workbench — ${gift.name}`}
        </Label>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontSize: size, lineHeight: 0.86, textTransform: "uppercase" }}>
          {lines.map((l) => (
            <div key={l} style={{ display: "flex" }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Display",
              fontSize: 40,
              textTransform: "uppercase",
              background: C.ink,
              color: C.paper,
              borderRadius: 999,
              padding: "14px 30px 10px",
            }}
          >
            From ${gift.from}
          </div>
          <Label>{mode === "product" ? `Made in ${DETAILS[id].days} days` : "See it live first"}</Label>
        </div>
        <Wordmark accent={accent.color} />
      </div>
    </div>
  );
}

/** Split a profile name over two lines, as evenly as the words allow. */
function twoLines(text: string) {
  const words = text.split(" ");
  let best: [string, string] = [text, ""];
  let score = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const s = Math.max(a.length, b.length);
    if (s < score) {
      score = s;
      best = [a, b];
    }
  }
  return best.filter(Boolean);
}

/** The quiz result as a membership card — "Maya is The Memory Collector". */
export function ProfileCard({ profile, name }: { profile: Profile; name: string | null }) {
  const accent = ACCENTS[profile.accent];
  const lines = twoLines(profile.name);
  const size = fit(lines, 760, 132);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: accent.color }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          width: 1090,
          height: 530,
          borderRadius: 44,
          background: C.ink,
          color: C.paper,
          padding: "44px 56px 46px",
          transform: "rotate(-1.5deg)",
          boxShadow: "0 30px 60px rgba(27, 24, 22, 0.35)",
        }}
      >
        <div style={{ position: "absolute", left: 505, top: 18, width: 80, height: 14, borderRadius: 7, background: accent.color }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Label color="rgba(251, 247, 240, 0.55)">Gift profile{name ? ` — for ${name}` : ""}</Label>
          <Label color="rgba(251, 247, 240, 0.55)">kept. quiz</Label>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Label color={accent.color} size={26}>
            {name ? `${name} is` : "They’re"}
          </Label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Display",
              fontSize: size,
              lineHeight: 0.86,
              textTransform: "uppercase",
              color: accent.color,
              marginTop: 10,
            }}
          >
            {lines.map((l) => (
              <div key={l} style={{ display: "flex" }}>
                {l}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div style={{ display: "flex", fontFamily: "Body", fontSize: 25, lineHeight: 1.3, color: "rgba(251, 247, 240, 0.78)", maxWidth: 640 }}>
            {profile.line}
          </div>
          <Wordmark accent={accent.color} color={C.paper} size={56} />
        </div>

        <div
          style={{
            position: "absolute",
            right: 56,
            top: 78,
            width: 150,
            height: 150,
            borderRadius: 75,
            border: `3px dashed ${accent.color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-12deg)",
          }}
        >
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 40, color: accent.color }}>kept.</div>
          <Label color={accent.color} size={15}>
            Certified
          </Label>
        </div>
      </div>
    </div>
  );
}

/** Names come from the URL: keep letters, spaces, hyphens and apostrophes; cap the length. */
export function cleanName(raw: string) {
  let name = raw;
  try {
    name = decodeURIComponent(raw);
  } catch {}
  name = name.replace(/[^\p{L}\p{M}\s'’-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 18);
  if (!name || name.toLowerCase() === "them") return null;
  return name.charAt(0).toUpperCase() + name.slice(1);
}
