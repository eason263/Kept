import type { GiftId } from "./gifts";

export interface SizeOption {
  id: string;
  label: string;
  dims: string;
  price: number;
  /** Preview scale relative to the default size. */
  scale: number;
  /** Width × height in cm, for the ruler. */
  cm: [number, number];
}

export interface GiftDetail {
  /** Days in the studio before it ships. */
  days: number;
  sizes: SizeOption[];
  /** Exactly four steps: what you send → proof → making → finished. */
  process: Array<{ title: string; body: string }>;
  /** Caption for the "before" side: what the customer already has. */
  sends: string;
  /** Caption for the "after" side. */
  gets: string;
  /** Something everyone has held, for scale. */
  analogy: string;
  faq: Array<{ q: string; a: string }>;
  pairs: GiftId[];
}

export const DETAILS: Record<GiftId, GiftDetail> = {
  "laser-portrait": {
    days: 4,
    sizes: [
      { id: "m", label: "Standard", dims: "15 × 20 cm", price: 68, scale: 1, cm: [15, 20] },
      { id: "l", label: "Large", dims: "20 × 27 cm", price: 92, scale: 1.14, cm: [20, 27] },
      { id: "xl", label: "Statement", dims: "30 × 40 cm", price: 138, scale: 1.28, cm: [30, 40] },
    ],
    process: [
      { title: "You send the photo", body: "Any phone photo works. Faces close up, in good light, eyes visible — that’s the whole brief." },
      { title: "We trace it by hand", body: "A designer redraws the lines that matter: laugh lines, the hair that never behaves. You get the proof by email." },
      { title: "The laser burns it", body: "About ninety minutes of a laser going back and forth, one line at a time, a tenth of a millimetre deep." },
      { title: "Sanded, oiled, wrapped", body: "Every piece is sanded and oiled by hand, then wrapped in tissue with a card written in your words." },
    ],
    sends: "One photo from your phone",
    gets: "Engraved maple, 15 × 20 cm",
    analogy: "Standard is about the size of a paperback.",
    faq: [
      { q: "Will it fade?", a: "No. The portrait is burned into the wood, not printed on it. It will outlast the shelf it sits on." },
      { q: "Which photos work best?", a: "Close-ups with the face lit from the front. Group photos work too — we’ll crop to whoever you choose." },
    ],
    pairs: ["handwriting", "film-strip", "photo-keychain"],
  },
  "magnet-set": {
    days: 3,
    sizes: [
      { id: "1", label: "Name + 1 photo", dims: "Letters 6 cm · photo 7 cm", price: 24, scale: 1, cm: [7, 7] },
      { id: "3", label: "Name + 3 photos", dims: "Letters 6 cm · photos 7 cm", price: 34, scale: 1, cm: [7, 7] },
      { id: "6", label: "Name + 6 photos", dims: "Letters 6 cm · photos 7 cm", price: 48, scale: 1, cm: [7, 7] },
    ],
    process: [
      { title: "You send the photos", body: "Pets, babies, bad haircuts, that one blurry night. If it’s on your phone, it can go on their fridge." },
      { title: "We lay them out", body: "We crop each photo to its shape and send a proof, so you can veto the double chin." },
      { title: "Printed, then die-cut", body: "Gloss printed, laminated against sticky fingers, then cut to shape and backed with a strong flexible magnet." },
      { title: "Packed in order", body: "The letters go in the box in spelling order, so the first thing they read when they open it is their name." },
    ],
    sends: "A few photos and a name",
    gets: "Letters and die-cut photo magnets",
    analogy: "Each photo magnet is about the size of a coaster.",
    faq: [
      { q: "Will they stick to my fridge?", a: "To any steel fridge, yes. Some stainless steel fridges aren’t magnetic — test with a magnet you already own." },
      { q: "Can I order extra letters?", a: "Yes — every set includes the name, and you can add any letters you like in the workbench." },
    ],
    pairs: ["photo-keychain", "cake-topper", "film-strip"],
  },
  "photo-keychain": {
    days: 3,
    sizes: [
      { id: "single", label: "Single", dims: "5 × 7 cm", price: 19, scale: 1, cm: [5, 7] },
      { id: "pair", label: "Pair (one for you)", dims: "2 × 5 × 7 cm", price: 34, scale: 1, cm: [5, 7] },
    ],
    process: [
      { title: "You send the photo", body: "One for the front. Write something for the back — a date, a joke, a threat." },
      { title: "We set the proof", body: "We crop the photo to the tag and set your words on the back, then email it over for a yes." },
      { title: "Printed under acrylic", body: "The photo is printed on the back of 5 mm acrylic, so the front protects it from keys, coins and life." },
      { title: "Polished, ringed, boxed", body: "Edges flame-polished until they shine, a steel split ring, and a little box that fits in a card." },
    ],
    sends: "One photo, a few words",
    gets: "Double-sided acrylic keychain",
    analogy: "About the size of a credit card, a bit taller.",
    faq: [
      { q: "Does the photo scratch off?", a: "It’s printed on the back of the acrylic, so 5 mm of clear plastic stands between it and your keys." },
      { q: "Can the pair have different photos?", a: "Yes. Upload one, and we’ll email you to ask for the second after you order." },
    ],
    pairs: ["magnet-set", "laser-portrait", "cake-topper"],
  },
  "cake-topper": {
    days: 2,
    sizes: [
      { id: "15", label: "Classic", dims: "15 cm wide", price: 22, scale: 1, cm: [15, 9] },
      { id: "18", label: "Big cake energy", dims: "18 cm wide", price: 26, scale: 1.12, cm: [18, 11] },
    ],
    process: [
      { title: "You tell us the words", body: "Their name, the age if they’re brave, or the joke the whole table will get." },
      { title: "We set the type", body: "Every letter has to touch the next so it’s one piece and doesn’t snap. We redraw it until it does." },
      { title: "Cut from mirror acrylic", body: "Laser-cut from 3 mm mirror acrylic in gold, silver or pink. Peel the film off on the day for the shine." },
      { title: "Ready for the cake", body: "Two long sticks, wrapped flat in a card sleeve that slides into a bag with the candles." },
    ],
    sends: "A message in the group chat",
    gets: "Mirror acrylic topper",
    analogy: "Classic fits a 20 cm round cake.",
    faq: [
      { q: "Is it food safe?", a: "It’s acrylic: fine to sit on top of a cake, not for eating. Wipe it clean and it’s ready for the shelf." },
      { q: "Can I use emoji or symbols?", a: "Hearts and stars, yes. Most emoji don’t survive being cut in one piece — we’ll tell you in the proof." },
    ],
    pairs: ["magnet-set", "photo-keychain", "film-strip"],
  },
  "film-strip": {
    days: 4,
    sizes: [
      { id: "6", label: "6 frames", dims: "12 cm strip", price: 32, scale: 1, cm: [12, 4] },
      { id: "12", label: "12 frames", dims: "24 cm strip", price: 44, scale: 1, cm: [24, 4] },
    ],
    process: [
      { title: "You pick the frames", body: "Twelve photos from the year — or six, if it was a quiet one. Any order, any phone." },
      { title: "We tone them like film", body: "A little grain, a little warmth, the edges burned in, so every photo matches the next." },
      { title: "Printed on clear film", body: "Printed on archival clear film with sprocket holes and your words running down the edge." },
      { title: "Set in an oak lightbox", body: "The strip slots into a small oak lightbox. Plug it in and the whole year glows on their desk." },
    ],
    sends: "A year of your camera roll",
    gets: "Film strip in a lightbox",
    analogy: "The 12-frame strip is about as long as a ruler.",
    faq: [
      { q: "Does the lightbox need batteries?", a: "It charges over USB-C (cable included). One charge lasts about a week of evenings." },
      { q: "Can I swap the strip later?", a: "Yes — order another strip any time and it slots into the same lightbox." },
    ],
    pairs: ["laser-portrait", "magnet-set", "handwriting"],
  },
  handwriting: {
    days: 5,
    sizes: [
      { id: "tag", label: "Tag", dims: "8 × 12 cm", price: 45, scale: 1, cm: [12, 8] },
      { id: "plaque", label: "Plaque", dims: "15 × 20 cm", price: 64, scale: 1.18, cm: [20, 15] },
    ],
    process: [
      { title: "You photograph the note", body: "A card, a recipe, a signature, a sticky note from the fridge. Flat, bright, straight on." },
      { title: "We clean it up — gently", body: "We lift the ink off the paper and leave every wobble alone. The proof shows it exactly as it’ll be." },
      { title: "Engraved into metal", body: "Deep-engraved into solid brass or steel, or burned into walnut, so it reads by touch as well as sight." },
      { title: "Polished and boxed", body: "Hand-polished, packed in a cloth pouch, with the original note returned if you posted it to us." },
    ],
    sends: "A note in their handwriting",
    gets: "Engraved brass tag",
    analogy: "The tag is about the size of a playing card.",
    faq: [
      { q: "What if the note is faded or tiny?", a: "We can work with nearly anything. We darken faint lines and send a proof so you can check it still looks like them." },
      { q: "Can I just type a message?", a: "Yes — we’ll set it in handwriting. But if you have the real thing, use the real thing." },
    ],
    pairs: ["laser-portrait", "film-strip", "photo-keychain"],
  },
};

/** Questions every product gets. */
export const COMMON_FAQ = (days: number) => [
  {
    q: "Do I see it before you make it?",
    a: "Yes. We email a digital proof within a day. Nothing gets made until you reply “looks great” — or ask for changes, as many times as you need.",
  },
  {
    q: "How fast can it get there?",
    a: `${days} days in the studio, then 2–4 days in the post. Express shipping at checkout takes a day off.`,
  },
  {
    q: "Can I add a card?",
    a: "Every order comes with one. Write your message at checkout and we’ll write it out by hand. Actually by hand.",
  },
];
