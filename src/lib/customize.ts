import type { Accent } from "./accents";
import { DETAILS } from "./giftDetails";
import type { GiftId } from "./gifts";

export interface ChoiceOption {
  id: string;
  label: string;
  /** Utility class for a material swatch (e.g. "wood", "brass"). */
  swatch?: string;
  /** Inline CSS background for swatches that aren't utilities. */
  swatchStyle?: string;
  delta?: number;
}

interface FieldBase {
  key: string;
  label: string;
  help?: string;
  /** Only show (and price) the field when this returns true. */
  when?: (v: Values) => boolean;
}

export type Field =
  | (FieldBase & { kind: "photo"; count?: number })
  | (FieldBase & { kind: "choice"; options: ChoiceOption[]; swatches?: boolean })
  | (FieldBase & { kind: "text"; max: number; placeholder: string; suggestions?: string[] })
  | (FieldBase & { kind: "size" });

export type Values = Record<string, string>;

export interface NameInfo {
  hasName: boolean;
  upper: string;
  lower: string;
  initial: string;
  /** "24·03" */
  date: string;
}

export interface GiftConfig {
  intro: string;
  fields: Field[];
  defaults: (n: NameInfo) => Values;
}

export const PALETTES: Record<string, Accent[]> = {
  rainbow: ["cherry", "blue", "acid", "tangerine", "bubble"],
  pinks: ["bubble", "cherry", "tangerine"],
  cool: ["blue", "acid"],
};

const MIRRORS = {
  gold: "linear-gradient(120deg, #8a6a1f, #f7e08b 35%, #b8892c 55%, #fff3b8 75%, #a87a22)",
  silver: "linear-gradient(120deg, #7d8389, #f4f6f8 35%, #a9aeb4 55%, #ffffff 75%, #6f757b)",
  pink: "linear-gradient(120deg, #b4497c, #ffd0e6 35%, #e2679f 55%, #ffe3f0 75%, #a03c6c)",
};

const size: Field = { kind: "size", key: "size", label: "Size" };

export const CONFIGS: Record<GiftId, GiftConfig> = {
  "laser-portrait": {
    intro: "Upload a photo and watch it turn into wood. A designer redraws it by hand before the laser goes anywhere near it.",
    fields: [
      { kind: "photo", key: "photo", label: "Their photo", help: "Close-up, good light, eyes visible." },
      {
        kind: "choice",
        key: "style",
        label: "Style",
        options: [
          { id: "engraved", label: "Engraved lines" },
          { id: "sketch", label: "Pencil sketch" },
        ],
      },
      {
        kind: "choice",
        key: "material",
        label: "Material",
        swatches: true,
        options: [
          { id: "maple", label: "Maple", swatch: "wood" },
          { id: "walnut", label: "Walnut", swatch: "wood-dark" },
          { id: "slate", label: "Slate", swatch: "slate", delta: 12 },
        ],
      },
      { kind: "text", key: "line1", label: "Name", max: 16, placeholder: "MAYA" },
      {
        kind: "text",
        key: "line2",
        label: "Small line",
        max: 22,
        placeholder: "24·03",
        suggestions: ["EST. 1996", "THE FUNNY ONE", "BEST DAD EVER", "STILL MY FAVOURITE"],
      },
      size,
    ],
    defaults: (n) => ({ style: "engraved", material: "maple", line1: n.hasName ? n.upper : "", line2: n.date, size: "m" }),
  },
  "magnet-set": {
    intro: "Their name in big glossy letters, plus photo magnets die-cut to any shape. For the most-looked-at wall in the house.",
    fields: [
      { kind: "text", key: "letters", label: "Letters", max: 10, placeholder: "MAYA" },
      {
        kind: "choice",
        key: "palette",
        label: "Letter colours",
        swatches: true,
        options: [
          { id: "rainbow", label: "Rainbow", swatchStyle: "conic-gradient(#e3282f, #ff6b1c, #c9f23d, #2747ff, #ff9acb, #e3282f)" },
          { id: "pinks", label: "Pink & red", swatchStyle: "conic-gradient(#ff9acb, #e3282f, #ff6b1c, #ff9acb)" },
          { id: "cool", label: "Blue & green", swatchStyle: "conic-gradient(#2747ff, #c9f23d, #2747ff)" },
        ],
      },
      size,
      { kind: "photo", key: "photo", label: "Photo magnet", help: "Pets, babies and bad haircuts welcome. We’ll ask for any extra photos after you order." },
      {
        kind: "choice",
        key: "shape",
        label: "Shape",
        options: [
          { id: "circle", label: "Circle" },
          { id: "heart", label: "Heart" },
          { id: "square", label: "Square" },
        ],
      },
    ],
    defaults: (n) => ({ letters: n.hasName ? n.upper : "", palette: "rainbow", size: "1", shape: "circle" }),
  },
  "photo-keychain": {
    intro: "A photo on the front, your words on the back, 5 mm of acrylic in between. Flip the preview to see both sides.",
    fields: [
      { kind: "photo", key: "photo", label: "Front photo", help: "Faces fill the tag best — crop in close." },
      {
        kind: "choice",
        key: "tint",
        label: "Acrylic",
        swatches: true,
        options: [
          { id: "clear", label: "Clear", swatchStyle: "linear-gradient(135deg, #ffffff, #dfeaee)" },
          { id: "bubble", label: "Pink", swatchStyle: "#ff9acb" },
          { id: "acid", label: "Lime", swatchStyle: "#c9f23d" },
          { id: "blue", label: "Blue", swatchStyle: "#2747ff" },
        ],
      },
      { kind: "text", key: "initial", label: "Corner sticker", max: 2, placeholder: "M" },
      {
        kind: "text",
        key: "back",
        label: "On the back",
        max: 32,
        placeholder: "same time next year",
        suggestions: ["same time next year", "you’re stuck with me", "call your mother", "day one, still here"],
      },
      size,
    ],
    defaults: (n) => ({
      tint: "bubble",
      initial: n.hasName ? n.initial : "",
      back: "same time next year",
      size: "single",
    }),
  },
  "cake-topper": {
    intro: "One connected piece of mirror acrylic, so it won’t snap when someone grabs the cake knife.",
    fields: [
      {
        kind: "text",
        key: "line1",
        label: "Top line",
        max: 16,
        placeholder: "happy birthday",
        suggestions: ["happy 30th", "finally legal", "still the baby", "old & gold"],
      },
      { kind: "text", key: "line2", label: "Big line", max: 10, placeholder: "maya" },
      {
        kind: "choice",
        key: "finish",
        label: "Finish",
        swatches: true,
        options: [
          { id: "gold", label: "Gold mirror", swatchStyle: MIRRORS.gold },
          { id: "silver", label: "Silver mirror", swatchStyle: MIRRORS.silver },
          { id: "pink", label: "Pink mirror", swatchStyle: MIRRORS.pink },
        ],
      },
      {
        kind: "choice",
        key: "font",
        label: "Lettering",
        options: [
          { id: "rounded", label: "Rounded" },
          { id: "chunky", label: "Chunky" },
        ],
      },
      size,
    ],
    defaults: (n) => ({ line1: "happy birthday", line2: n.hasName ? n.lower : "", finish: "gold", font: "rounded", size: "15" }),
  },
  "film-strip": {
    intro: "The year, toned like film and lit from behind. Start with three frames — we’ll ask for the rest after you order.",
    fields: [
      { kind: "photo", key: "frames", label: "First frames", count: 3, help: "Any order. We tone them so they match." },
      { kind: "text", key: "caption", label: "Edge text", max: 18, placeholder: "OUR YEAR ▸ 2026" },
      {
        kind: "choice",
        key: "base",
        label: "Lightbox",
        swatches: true,
        options: [
          { id: "oak", label: "Oak", swatch: "wood" },
          { id: "walnut", label: "Walnut", swatch: "wood-dark", delta: 6 },
        ],
      },
      size,
    ],
    defaults: (n) => ({ caption: `${n.hasName ? n.upper : "OUR YEAR"} ▸ ${new Date().getFullYear()}`, base: "oak", size: "12" }),
  },
  handwriting: {
    intro: "Use the real note if you have it — we keep every wobble. No note? Type it and we’ll set it in handwriting.",
    fields: [
      {
        kind: "choice",
        key: "source",
        label: "The words",
        options: [
          { id: "type", label: "Type it" },
          { id: "upload", label: "Upload the note" },
        ],
      },
      {
        kind: "text",
        key: "message",
        label: "Message",
        max: 48,
        placeholder: "love you more than cake",
        suggestions: ["proud of you, always", "you were right. don’t gloat.", "same table, same time"],
        when: (v) => v.source !== "upload",
      },
      { kind: "text", key: "sign", label: "Signed", max: 16, placeholder: "mum x", when: (v) => v.source !== "upload" },
      {
        kind: "photo",
        key: "note",
        label: "Photo of the note",
        help: "Flat, bright, straight on. Shadows are the enemy.",
        when: (v) => v.source === "upload",
      },
      {
        kind: "choice",
        key: "material",
        label: "Material",
        swatches: true,
        options: [
          { id: "brass", label: "Brass", swatch: "brass" },
          { id: "walnut", label: "Walnut", swatch: "wood-dark" },
          { id: "steel", label: "Steel", swatch: "steel" },
        ],
      },
      size,
    ],
    defaults: () => ({ source: "type", message: "love you more than cake", sign: "mum x", material: "brass", size: "tag" }),
  },
};

export function visibleFields(id: GiftId, values: Values) {
  return CONFIGS[id].fields.filter((f) => !f.when || f.when(values));
}

export function priceOf(id: GiftId, values: Values) {
  const sizes = DETAILS[id].sizes;
  const base = (sizes.find((s) => s.id === values.size) ?? sizes[0]).price;
  return visibleFields(id, values).reduce((sum, f) => {
    if (f.kind !== "choice") return sum;
    return sum + (f.options.find((o) => o.id === values[f.key])?.delta ?? 0);
  }, base);
}

/** Human-readable choices for the bag. */
export function summarise(id: GiftId, values: Values, uploaded: Record<string, number>) {
  const sizes = DETAILS[id].sizes;
  return visibleFields(id, values).flatMap((f): string[] => {
    if (f.kind === "size") {
      const s = sizes.find((o) => o.id === values.size) ?? sizes[0];
      return [`${s.label} · ${s.dims}`];
    }
    if (f.kind === "choice") return [f.options.find((o) => o.id === values[f.key])?.label ?? ""];
    if (f.kind === "text") return values[f.key] ? [`“${values[f.key]}”`] : [];
    return [uploaded[f.key] ? `${uploaded[f.key]} photo${uploaded[f.key] > 1 ? "s" : ""} added` : "Photo to follow"];
  });
}

/** The first choice group with swatches — the product's materials. */
export function materialField(id: GiftId) {
  return CONFIGS[id].fields.find((f): f is Extract<Field, { kind: "choice" }> => f.kind === "choice" && !!f.swatches);
}
