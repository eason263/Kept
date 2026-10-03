"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis, setLenis } from "@/lib/scroll";

/** Lenis on wheel input only; touch keeps native momentum. Off for reduced motion. */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: true });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, [reduce]);

  // New page: start at the top unless the URL points at a section.
  const pathname = usePathname();
  useEffect(() => {
    if (!window.location.hash) getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
