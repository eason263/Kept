"use client";

import { useSyncExternalStore } from "react";

/**
 * The last photo uploaded in the workbench, shared across gifts — upload once
 * for the laser portrait and the keychain already has it. Lives for the tab only.
 */
let shared: string | null = null;
const listeners = new Set<() => void>();

export function setSharedPhoto(url: string | null) {
  shared = url;
  listeners.forEach((l) => l());
}

export function useSharedPhoto() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => shared,
    () => null,
  );
}

export type PhotoQuality = "great" | "ok" | "small";

export function measureQuality(url: string): Promise<PhotoQuality> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const edge = Math.min(img.naturalWidth, img.naturalHeight);
      resolve(edge >= 1100 ? "great" : edge >= 650 ? "ok" : "small");
    };
    img.onerror = () => resolve("ok");
    img.src = url;
  });
}
