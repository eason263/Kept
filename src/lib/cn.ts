export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Deterministic pseudo-random in [0, 1) — keeps SSR and client in sync. */
export function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
