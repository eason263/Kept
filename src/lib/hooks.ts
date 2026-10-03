"use client";

import { useMemo, useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

/** SSR-safe media query. Server snapshot is `false` (mobile-first). */
export function useMediaQuery(query: string) {
  const subscribe = useMemo(() => subscribeMedia(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const useDesktop = () => useMediaQuery("(min-width: 1024px)");

const noopSubscribe = () => () => {};

/** `true` only after hydration — for values that depend on the client clock. */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Hydration-safe reduced-motion flag for render branches (server snapshot: false). */
export const useReducedMotionSafe = () => useMediaQuery("(prefers-reduced-motion: reduce)");
