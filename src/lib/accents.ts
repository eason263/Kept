export type Accent = "blue" | "cherry" | "acid" | "bubble" | "tangerine";

export const ACCENTS: Record<Accent, { color: string; ink: string; shade: string }> = {
  blue: { color: "#2747ff", ink: "#fbf7f0", shade: "#1426a8" },
  cherry: { color: "#e3282f", ink: "#fbf7f0", shade: "#9a1218" },
  acid: { color: "#c9f23d", ink: "#1b1816", shade: "#86a61a" },
  bubble: { color: "#ff9acb", ink: "#1b1816", shade: "#d2559a" },
  tangerine: { color: "#ff6b1c", ink: "#1b1816", shade: "#b8430a" },
};

/** Set the page accent directly (for scenes that don't move vertically, e.g. horizontal scroll). */
export function setPageAccent(accent: Accent) {
  const root = document.documentElement;
  root.style.setProperty("--accent", ACCENTS[accent].color);
  root.style.setProperty("--accent-ink", ACCENTS[accent].ink);
}

/** Order the magnets cycle through. */
export const MAGNET_ORDER: Accent[] = ["cherry", "blue", "acid", "tangerine", "bubble"];
