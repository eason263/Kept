import type { Accent } from "./accents";
import type { Relationship } from "./birthday";
import type { PhotoKey } from "./photos";

export type GiftId = "laser-portrait" | "magnet-set" | "photo-keychain" | "cake-topper" | "film-strip" | "handwriting";

export interface Gift {
  id: GiftId;
  name: string;
  /** Display headline, one array item per line. */
  headline: string[];
  story: string;
  from: number;
  material: string;
  size: string;
  makingDays: string;
  accent: Accent;
  photo: PhotoKey;
}

export const GIFTS: Record<GiftId, Gift> = {
  "laser-portrait": {
    id: "laser-portrait",
    name: "Laser portrait",
    headline: ["Turn a photo", "into a memory"],
    story:
      "Send us the photo where they’re mid-laugh. We trace every line of it, then burn it into solid wood, one pass at a time.",
    from: 68,
    material: "Walnut or maple",
    size: "15 × 20 cm",
    makingDays: "4 days",
    accent: "tangerine",
    photo: "laugh",
  },
  "magnet-set": {
    id: "magnet-set",
    name: "Fridge magnets",
    headline: ["The fridge is", "a gallery"],
    story:
      "The most-looked-at wall in any home. Put their face on it — photo magnets die-cut to any shape, plus their name in big chunky letters.",
    from: 24,
    material: "Gloss photo + flexible magnet",
    size: "Letters 6 cm · photos 7 cm",
    makingDays: "3 days",
    accent: "blue",
    photo: "lick",
  },
  "photo-keychain": {
    id: "photo-keychain",
    name: "Photo keychain",
    headline: ["Carry them", "everywhere"],
    story:
      "Double-sided acrylic, a photo on each side. Lives on keys, bags, and the zip of the jacket they never wash. Comes in pairs, if you’re that kind of friend.",
    from: 19,
    material: "5 mm clear acrylic",
    size: "5 × 7 cm",
    makingDays: "3 days",
    accent: "bubble",
    photo: "friendsHug",
  },
  "cake-topper": {
    id: "cake-topper",
    name: "Cake topper",
    headline: ["Make the cake", "jealous"],
    story:
      "Laser-cut mirror acrylic with their name and age. It goes on the cake, then on the shelf, then in the drawer of things they’ll never throw away.",
    from: 22,
    material: "Gold, silver or pink mirror acrylic",
    size: "Up to 18 cm wide",
    makingDays: "2 days",
    accent: "cherry",
    photo: "pinkCake",
  },
  "film-strip": {
    id: "film-strip",
    name: "Film strip",
    headline: ["A year in", "twelve frames"],
    story:
      "Pick twelve photos from the year. We print them on a real-feel film strip and stand it in a little lightbox, so the year glows on their desk.",
    from: 32,
    material: "Printed film + oak lightbox",
    size: "24 cm strip",
    makingDays: "4 days",
    accent: "acid",
    photo: "cafe",
  },
  handwriting: {
    id: "handwriting",
    name: "Handwriting keepsake",
    headline: ["Their handwriting,", "forever"],
    story:
      "Photograph a note, a recipe, a signature. We engrave it exactly as it was written — every wobble, every crossed-out word.",
    from: 45,
    material: "Brass or walnut",
    size: "8 × 12 cm",
    makingDays: "5 days",
    accent: "blue",
    photo: "family",
  },
};

export const GIFT_ORDER: GiftId[] = [
  "laser-portrait",
  "magnet-set",
  "photo-keychain",
  "cake-topper",
  "film-strip",
  "handwriting",
];

export interface Audience {
  id: Relationship;
  lead: string;
  who: string;
  note: string;
  photo: PhotoKey;
  accent: Accent;
  gifts: GiftId[];
}

export const AUDIENCES: Audience[] = [
  {
    id: "best-friend",
    lead: "For your",
    who: "Best friend",
    note: "the one who knows the whole story",
    photo: "friendsHug",
    accent: "tangerine",
    gifts: ["photo-keychain", "magnet-set", "film-strip"],
  },
  {
    id: "partner",
    lead: "For your",
    who: "Partner",
    note: "for the person who gets the last fry",
    photo: "hearts",
    accent: "cherry",
    gifts: ["laser-portrait", "handwriting", "film-strip"],
  },
  {
    id: "mom",
    lead: "For your",
    who: "Mom",
    note: "she kept your macaroni art. return the favour",
    photo: "family",
    accent: "bubble",
    gifts: ["handwriting", "laser-portrait", "magnet-set"],
  },
  {
    id: "dad",
    lead: "For your",
    who: "Dad",
    note: "he said he doesn’t want anything. he does",
    photo: "smile",
    accent: "blue",
    gifts: ["photo-keychain", "laser-portrait", "handwriting"],
  },
  {
    id: "chaotic-friend",
    lead: "For your",
    who: "Chaotic friend",
    note: "the cursed photo is the gift",
    photo: "lick",
    accent: "acid",
    gifts: ["magnet-set", "cake-topper", "photo-keychain"],
  },
  {
    id: "has-everything",
    lead: "For someone who",
    who: "Has everything",
    note: "they don’t have one of these",
    photo: "rainbowCake",
    accent: "tangerine",
    gifts: ["laser-portrait", "handwriting", "film-strip"],
  },
];
