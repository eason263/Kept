"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { useState, type CSSProperties } from "react";
import { GiftThumb } from "./GiftScenes";
import { Polaroid } from "@/components/objects/Polaroid";
import { Arrow } from "@/components/ui/Arrow";
import { MotionLink } from "@/components/ui/MotionLink";
import { RevealLines } from "@/components/ui/RevealLines";
import { ACCENTS } from "@/lib/accents";
import { useBirthday, useNames, type Relationship } from "@/lib/birthday";
import { AUDIENCES, GIFTS } from "@/lib/gifts";
import { useFinePointer } from "@/lib/hooks";
import { cn, EASE_OUT } from "@/lib/cn";

/**
 * Category navigation by *person*, not product. Desktop rows reveal a photo that
 * follows the cursor; every row opens into three recommendations.
 */
export function GiftFor() {
  const { relationship, built } = useBirthday();
  const n = useNames();
  const fine = useFinePointer();
  const [open, setOpen] = useState<Relationship | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });
  const vx = useVelocity(sx);
  const tilt = useTransform(vx, [-1400, 0, 1400], [-14, 0, 14], { clamp: true });

  return (
    <section id="for" data-accent="bubble" className="relative bg-frosting py-[16vh]">
      <div className="px-4 md:px-10">
        <p className="label text-smudge">Who’s it for?</p>
        <h2 className="mt-5">
          <RevealLines
            className="display block text-[clamp(3.4rem,7.6vw,8rem)]"
            lines={["What kind of person", <span key="2" className="text-accent">are you gifting?</span>]}
          />
        </h2>
        <p className="mt-6 max-w-[30rem] text-[1.1rem] leading-relaxed text-ink/75">
          Pick a person, not a product. We’ll do the rest.
        </p>
      </div>

      <ul
        className="mt-14 border-t border-ink/15"
        onPointerMove={(e) => {
          mx.set(e.clientX);
          my.set(e.clientY);
        }}
      >
        {AUDIENCES.map((a, i) => {
          const isOpen = open === a.id;
          const mine = built && n.hasName && relationship === a.id;
          const accent = ACCENTS[a.accent];
          return (
            <li key={a.id} className="border-b border-ink/15">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`for-${a.id}`}
                onClick={() => setOpen(isOpen ? null : a.id)}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                data-cursor={isOpen ? "close" : "open"}
                className="group relative flex w-full items-end justify-between gap-4 overflow-hidden px-4 py-5 text-left md:px-10"
                style={{ color: isOpen ? accent.ink : undefined }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 origin-left transition-transform duration-500 ease-[var(--ease-out)]",
                    isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                  style={{ background: accent.color }}
                />
                <span
                  className={cn(
                    "relative transition-[translate,color] duration-500 ease-[var(--ease-out)] group-hover:translate-x-4 md:group-hover:translate-x-8",
                    !isOpen && "group-hover:text-[var(--row-ink)]",
                  )}
                  style={{ "--row-ink": accent.ink } as CSSProperties}
                >
                  <span className="label block">{a.lead}</span>
                  <span className="display mt-1 block text-[clamp(2.8rem,8.4vw,9rem)]">{a.who}</span>
                </span>
                <span
                  className={cn(
                    "hand relative hidden max-w-[16rem] pb-3 text-right text-[1.9rem] leading-none transition-colors duration-500 md:block",
                    !isOpen && "group-hover:text-[var(--row-ink)]",
                  )}
                  style={{ "--row-ink": accent.ink } as CSSProperties}
                >
                  {a.note}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative mb-3 grid size-11 shrink-0 place-items-center rounded-full border-2 border-current text-[1.6rem] leading-none transition-transform duration-500",
                    isOpen && "rotate-45",
                  )}
                >
                  +
                </span>
                {mine && (
                  <span className="hand absolute right-4 top-3 rotate-[-4deg] rounded-md bg-ink px-3 py-0.5 text-[1.5rem] text-paper md:right-28">
                    ← {n.name}
                  </span>
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`for-${a.id}`}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.55, ease: EASE_OUT }}
                    className="overflow-hidden"
                    style={{ background: accent.color }}
                  >
                    <div className="grid gap-4 px-4 pb-10 pt-2 md:px-10 lg:grid-cols-3">
                      <div className="flex justify-center py-2 lg:hidden">
                        <Polaroid src={a.photo} caption={a.note} width={220} className="-rotate-2" />
                      </div>
                      {a.gifts.map((id, gi) => (
                        <MotionLink
                          key={id}
                          href={`/gift/${id}`}
                          data-cursor="view"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.15 + gi * 0.07, duration: 0.6, ease: EASE_OUT }}
                          className="group flex items-center gap-5 rounded-[22px] bg-paper p-5 text-ink shadow-obj transition-transform hover:-translate-y-1"
                        >
                          <span className="grid h-32 w-28 shrink-0 place-items-center">
                            <GiftThumb id={id} />
                          </span>
                          <span className="min-w-0">
                            <span className="label block text-smudge">{gi === 0 ? "Start here" : "Also good"}</span>
                            <span className="mt-1 block text-[1.2rem] font-semibold leading-tight">{GIFTS[id].name}</span>
                            <span className="mt-1 block text-[0.95rem] leading-snug text-ink/70">{GIFTS[id].headline.join(" ")}</span>
                            <span className="mt-3 inline-flex items-center gap-2 font-mono text-[0.75rem]">
                              from ${GIFTS[id].from} <Arrow className="transition-transform group-hover:translate-x-1" />
                            </span>
                          </span>
                        </MotionLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {fine && (
        <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30" style={{ x: sx, y: sy, rotate: tilt }}>
          <AnimatePresence>
            {hover !== null && open !== AUDIENCES[hover].id && (
              <motion.div
                key={hover}
                className="absolute left-10 top-0 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <Polaroid src={AUDIENCES[hover].photo} width={240} sizes="260px" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
