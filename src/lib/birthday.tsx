"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const RELATIONSHIPS = [
  { id: "best-friend", phrase: "best friend" },
  { id: "partner", phrase: "partner" },
  { id: "mom", phrase: "mom" },
  { id: "dad", phrase: "dad" },
  { id: "chaotic-friend", phrase: "most chaotic friend" },
  { id: "has-everything", phrase: "impossible-to-buy-for person" },
] as const;

export type Relationship = (typeof RELATIONSHIPS)[number]["id"];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface BirthdayState {
  name: string;
  day: number;
  month: number; // 1–12
  relationship: Relationship;
  /** True once they've pressed "Build their universe". */
  built: boolean;
}

interface BirthdayContextValue extends BirthdayState {
  set: (patch: Partial<BirthdayState>) => void;
  /** Universe loader overlay. */
  loaderOpen: boolean;
  openLoader: () => void;
  closeLoader: () => void;
}

const DEFAULTS: BirthdayState = { name: "", day: 24, month: 3, relationship: "best-friend", built: false };
const STORAGE_KEY = "kept:birthday";

const BirthdayContext = createContext<BirthdayContextValue | null>(null);

export function BirthdayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BirthdayState>(DEFAULTS);
  const [loaderOpen, setLoaderOpen] = useState(false);

  // Restore after hydration so server and client render the same first frame.
  useEffect(() => {
    let saved: Partial<BirthdayState> | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {}
    if (!saved) return;
    const restored = { ...DEFAULTS, ...saved };
    queueMicrotask(() => setState(restored));
  }, []);

  const set = useCallback((patch: Partial<BirthdayState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo<BirthdayContextValue>(
    () => ({
      ...state,
      set,
      loaderOpen,
      openLoader: () => setLoaderOpen(true),
      closeLoader: () => setLoaderOpen(false),
    }),
    [state, set, loaderOpen],
  );

  return <BirthdayContext.Provider value={value}>{children}</BirthdayContext.Provider>;
}

export function useBirthday() {
  const ctx = useContext(BirthdayContext);
  if (!ctx) throw new Error("useBirthday must be used inside <BirthdayProvider>");
  return ctx;
}

/** Name helpers with friendly fallbacks for when nothing's been typed yet. */
export function useNames() {
  const { name } = useBirthday();
  const clean = name.trim();
  return {
    hasName: clean.length > 0,
    name: clean,
    /** Upper-case for engraving, or a stand-in. */
    upper: clean ? clean.toUpperCase() : "YOUR PERSON",
    /** Lower-case for handwriting, or a stand-in. */
    lower: clean ? clean.toLowerCase() : "you know who",
    /** "Maya's" / "their" */
    possessive: clean ? `${clean}’s` : "their",
    initial: clean ? clean[0].toUpperCase() : "★",
  };
}

export function formatDate(day: number, month: number) {
  return `${String(day).padStart(2, "0")} · ${String(month).padStart(2, "0")}`;
}

export function daysInMonth(month: number) {
  return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/** Days until the next occurrence of day/month (0 = today). */
export function daysUntil(day: number, month: number, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(today.getFullYear(), month - 1, day);
  if (target < today) target = new Date(today.getFullYear() + 1, month - 1, day);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** Next birthday as a Date. */
export function nextBirthday(day: number, month: number, now = new Date()) {
  const d = daysUntil(day, month, now);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
}

export function countdownLine(days: number, possessive: string) {
  if (days === 0) return `It’s ${possessive} birthday today. Go, go, go.`;
  if (days <= 6) return `${days} day${days === 1 ? "" : "s"} to ${possessive} birthday. Express making is a thing.`;
  if (days <= 21) return `${days} days to ${possessive} birthday. Plenty of time if you start today.`;
  return `${days} days to ${possessive} birthday. Plenty of time. (Famous last words.)`;
}

const ZODIAC: Array<[string, number, number, string]> = [
  // sign, start month, start day, trait
  ["Capricorn", 12, 22, "pretends not to want anything"],
  ["Aquarius", 1, 20, "will love something a little weird"],
  ["Pisces", 2, 19, "will cry. The good kind."],
  ["Aries", 3, 21, "main-character energy"],
  ["Taurus", 4, 20, "will absolutely use the nice candle"],
  ["Gemini", 5, 21, "two moods, both want presents"],
  ["Cancer", 6, 21, "keeps every card you’ve ever written"],
  ["Leo", 7, 23, "would like a portrait, actually"],
  ["Virgo", 8, 23, "will notice the kerning"],
  ["Libra", 9, 23, "can’t choose, so we chose for you"],
  ["Scorpio", 10, 23, "remembers everything. Everything."],
  ["Sagittarius", 11, 22, "will take it everywhere"],
];

export function zodiac(day: number, month: number) {
  const md = month * 100 + day;
  let found = ZODIAC[0];
  for (const z of ZODIAC.slice(1)) {
    if (md >= z[1] * 100 + z[2]) found = z;
  }
  if (md >= 1222) found = ZODIAC[0];
  return { sign: found[0], trait: found[3] };
}
