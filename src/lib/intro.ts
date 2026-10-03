"use client";

import { useSyncExternalStore } from "react";

/** Tiny store so sections can wait for the candle intro before entering. */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

export function useIntroDone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => done,
    () => false,
  );
}
