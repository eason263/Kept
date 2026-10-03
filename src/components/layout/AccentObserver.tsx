"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ACCENTS, setPageAccent, type Accent } from "@/lib/accents";

/**
 * Swaps the page accent as each `[data-accent]` section crosses the viewport centre.
 * `--accent` is a registered property, so the change animates (globals.css).
 */
export function AccentObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const accent = (entry.target as HTMLElement).dataset.accent as Accent | undefined;
          if (accent && ACCENTS[accent]) setPageAccent(accent);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-accent]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
