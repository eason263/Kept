"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Scroll to a section by id — smooth through Lenis when it's running. */
export function scrollToId(id: string, opts: { immediate?: boolean; offset?: number } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { immediate: opts.immediate, offset: opts.offset ?? 0, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
    window.scrollTo({ top, behavior: opts.immediate ? "instant" : "smooth" });
  }
}
