"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { ACCENTS } from "@/lib/accents";
import { DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";
import { EASE_OUT } from "@/lib/cn";

/** Floating capsule that keeps "Make yours" in reach once the hero button scrolls away. */
export function BuyBar({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  const accent = ACCENTS[gift.accent];
  const [pastHero, setPastHero] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const cta = document.getElementById("hero-cta");
    const footer = document.getElementById("site-footer");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === cta) setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === footer) setAtFooter(e.isIntersecting);
      }
    });
    if (cta) io.observe(cta);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {pastHero && !atFooter && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-[560px] items-center gap-4 rounded-full bg-ink p-2 pl-6 text-paper shadow-lift"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{gift.name}</span>
            <span className="label block truncate text-paper/60">
              From ${gift.from} · made in {DETAILS[id].days} days
            </span>
          </span>
          <Link
            href={`/custom/${id}`}
            data-cursor="cta"
            className="display flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-[1.2rem]"
            style={{ background: accent.color, color: accent.ink }}
          >
            Make yours <Arrow />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
