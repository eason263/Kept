import type { Accent } from "./accents";
import type { GiftId } from "./gifts";

export type ProfileId = "memory-collector" | "chaos-agent" | "quiet-keeper" | "main-character" | "impossible-one";

export interface QuizOption {
  title: string;
  aside: string;
  score: Partial<Record<ProfileId, number>>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "personality",
    prompt: "What’s their personality?",
    options: [
      { title: "The sentimental one", aside: "cries at weddings. all of them.", score: { "memory-collector": 3 } },
      { title: "The funny one", aside: "renames the group chat weekly", score: { "chaos-agent": 2, "main-character": 1 } },
      { title: "The chaotic one", aside: "47 tabs open, all important", score: { "chaos-agent": 3 } },
      { title: "The minimalist", aside: "owns one mug. loves it.", score: { "quiet-keeper": 3 } },
      { title: "The main character", aside: "has a ring light, isn’t sorry", score: { "main-character": 3 } },
      { title: "The one who has everything", aside: "returns gifts. with the receipt.", score: { "impossible-one": 3 } },
    ],
  },
  {
    id: "camera-roll",
    prompt: "Their camera roll is mostly…",
    options: [
      { title: "Photos of you two", aside: "receipts of a friendship", score: { "memory-collector": 2 } },
      { title: "Their pet", aside: "from four hundred angles", score: { "memory-collector": 1, "chaos-agent": 1 } },
      { title: "Memes & screenshots", aside: "an archive of chaos", score: { "chaos-agent": 2 } },
      { title: "Sunsets & coffee", aside: "nice light, no people", score: { "quiet-keeper": 2 } },
      { title: "Selfies", aside: "so many selfies", score: { "main-character": 2 } },
      { title: "Honestly? Empty", aside: "they delete everything", score: { "impossible-one": 2, "quiet-keeper": 1 } },
    ],
  },
  {
    id: "home",
    prompt: "Where should the gift end up?",
    options: [
      { title: "On the fridge", aside: "seen fifty times a day", score: { "chaos-agent": 1, "memory-collector": 1 } },
      { title: "On their keys", aside: "goes everywhere they go", score: { "memory-collector": 1, "main-character": 1 } },
      { title: "On a shelf", aside: "displayed, obviously", score: { "main-character": 1, "impossible-one": 1 } },
      { title: "In a box of treasures", aside: "with the ticket stubs", score: { "memory-collector": 2 } },
      { title: "Somewhere quiet", aside: "just for them", score: { "quiet-keeper": 2, "impossible-one": 1 } },
      { title: "On the cake", aside: "then everywhere else", score: { "main-character": 2, "chaos-agent": 1 } },
    ],
  },
];

export interface Profile {
  id: ProfileId;
  name: string;
  line: string;
  accent: Accent;
  gifts: GiftId[];
}

export const PROFILES: Record<ProfileId, Profile> = {
  "memory-collector": {
    id: "memory-collector",
    name: "The Memory Collector",
    line: "Keeps ticket stubs. Remembers what you wore. Give them something that holds a moment still.",
    accent: "tangerine",
    gifts: ["laser-portrait", "magnet-set", "photo-keychain"],
  },
  "chaos-agent": {
    id: "chaos-agent",
    name: "The Professional Chaos Agent",
    line: "Their love language is a cursed photo. Lean in — put it on the fridge, the cake and their keys.",
    accent: "acid",
    gifts: ["magnet-set", "cake-topper", "photo-keychain"],
  },
  "quiet-keeper": {
    id: "quiet-keeper",
    name: "The Quiet Keeper",
    line: "Doesn’t want stuff. Wants one thing that means something, in a material that lasts.",
    accent: "blue",
    gifts: ["handwriting", "laser-portrait", "film-strip"],
  },
  "main-character": {
    id: "main-character",
    name: "The Main Character",
    line: "Their birthday is a season, not a day. Give them a prop worthy of the plot.",
    accent: "bubble",
    gifts: ["cake-topper", "laser-portrait", "film-strip"],
  },
  "impossible-one": {
    id: "impossible-one",
    name: "The Impossible One",
    line: "Has everything — except the thing only you could have made. That’s the loophole.",
    accent: "cherry",
    gifts: ["handwriting", "laser-portrait", "film-strip"],
  },
};

const ORDER: ProfileId[] = ["memory-collector", "chaos-agent", "quiet-keeper", "main-character", "impossible-one"];

export function scoreProfile(answers: number[]): Profile {
  const totals = new Map<ProfileId, number>(ORDER.map((id) => [id, 0]));
  answers.forEach((optionIndex, q) => {
    const score = QUESTIONS[q]?.options[optionIndex]?.score ?? {};
    for (const [id, pts] of Object.entries(score) as Array<[ProfileId, number]>) totals.set(id, (totals.get(id) ?? 0) + pts);
  });
  let best = ORDER[0];
  for (const id of ORDER) if ((totals.get(id) ?? 0) > (totals.get(best) ?? 0)) best = id;
  return PROFILES[best];
}
