"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GIFTS, type GiftId } from "@/lib/gifts";
import { useReducedMotionSafe } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/cn";

function titleFor(path: string) {
  if (path.startsWith("/gift/")) return GIFTS[path.split("/")[2] as GiftId]?.name ?? "kept.";
  if (path.startsWith("/custom")) return "The workbench";
  return "kept.";
}

/**
 * On every client navigation: cut to an ink title card naming the destination,
 * then wipe it up to reveal the new page. Skipped on first load (the candle intro
 * covers that), between workbench tabs, and for reduced motion.
 */
export function PageCurtain() {
  const pathname = usePathname();
  const reduce = useReducedMotionSafe();
  const [prev, setPrev] = useState(pathname);
  const [run, setRun] = useState(0);

  if (pathname !== prev) {
    setPrev(pathname);
    const betweenTabs = prev.startsWith("/custom") && pathname.startsWith("/custom");
    if (!betweenTabs && !reduce) setRun((r) => r + 1);
  }

  if (!run) return null;

  return (
    <motion.div
      key={run}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center bg-ink px-4 text-center text-paper"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.8, delay: 0.35, ease: EASE_OUT }}
    >
      <motion.p
        className="display text-[clamp(3.4rem,10vw,10rem)]"
        initial={{ y: "40%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        {titleFor(pathname)}
      </motion.p>
    </motion.div>
  );
}
