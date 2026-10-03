"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { GiftId } from "./gifts";

export interface BagItem {
  key: string;
  giftId: GiftId;
  title: string;
  /** Human-readable choices, e.g. "Walnut", "“MAYA”". */
  details: string[];
  price: number;
}

interface BagValue {
  items: BagItem[];
  count: number;
  total: number;
  add: (item: Omit<BagItem, "key">) => void;
  remove: (key: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const STORAGE_KEY = "kept:bag";
const BagContext = createContext<BagValue | null>(null);

/**
 * Prototype bag: kept in localStorage on this device. Uploaded photos aren't stored —
 * they're object URLs that die with the tab; checkout would upload them.
 */
export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let saved: BagItem[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {}
    if (saved.length) queueMicrotask(() => setItems(saved));
  }, []);

  const persist = useCallback((next: BagItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    return next;
  }, []);

  const add = useCallback(
    (item: Omit<BagItem, "key">) =>
      setItems((prev) => persist([...prev, { ...item, key: `${item.giftId}-${Date.now().toString(36)}` }])),
    [persist],
  );
  const remove = useCallback((key: string) => setItems((prev) => persist(prev.filter((i) => i.key !== key))), [persist]);

  const value = useMemo<BagValue>(
    () => ({
      items,
      count: items.length,
      total: items.reduce((sum, i) => sum + i.price, 0),
      add,
      remove,
      open,
      setOpen,
    }),
    [items, add, remove, open],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside <BagProvider>");
  return ctx;
}
