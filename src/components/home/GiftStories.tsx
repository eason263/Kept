"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GiftScene } from "./GiftScenes";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealLines } from "@/components/ui/RevealLines";
import { ACCENTS, setPageAccent } from "@/lib/accents";
import { GIFT_ORDER, GIFTS, type Gift } from "@/lib/gifts";
import { useDesktop, useReducedMotionSafe } from "@/lib/hooks";
import { cn } from "@/lib/cn";

function StoryPanel({ gift, index, horizontal }: { gift: Gift; index: number; horizontal: boolean }) {
  const accent = ACCENTS[gift.accent];
  return (
    <article
      id={`story-${gift.id}`}
      data-accent={horizontal ? undefined : gift.accent}
      className={cn(
        "relative grid items-center gap-10 px-4 py-20 md:px-10",
        horizontal && "h-full w-[min(92vw,1500px)] shrink-0 grid-cols-2 gap-[5vw] px-[5vw] py-0",
      )}
    >
      <div className="relative flex items-center justify-center">
        <span
          aria-hidden
          className="absolute aspect-square w-[min(92vw,620px)] rounded-full opacity-90 lg:w-[min(44vw,640px)]"
          style={{ background: accent.color }}
        />
        <div className="relative">
          <GiftScene id={gift.id} />
        </div>
      </div>

      <div className="relative max-w-[34rem]">
        <p className="label text-smudge">
          Story {String(index + 1).padStart(2, "0")}/{String(GIFT_ORDER.length).padStart(2, "0")} — {gift.name}
        </p>
        <h3 className="mt-4">
          <RevealLines className="display block text-[clamp(3.2rem,6.4vw,7rem)]" lines={gift.headline} />
        </h3>
        <p className="mt-6 max-w-[30rem] text-[1.1rem] leading-relaxed text-ink/80">{gift.story}</p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/15 pt-6">
          {[
            ["Material", gift.material],
            ["Size", gift.size],
            ["Made in", gift.makingDays],
            ["From", `$${gift.from}`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label text-smudge">{k}</dt>
              <dd className="mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Magnetic>
            <Link
              href={`/custom/${gift.id}`}
              data-cursor="cta"
              className="display group inline-flex items-center gap-3 rounded-full px-7 py-4 text-[1.5rem] transition-transform hover:scale-[1.03]"
              style={{ background: accent.color, color: accent.ink }}
            >
              Make yours
              <Arrow className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Link
            href={`/gift/${gift.id}`}
            data-cursor="view"
            className="inline-flex items-center gap-2 underline decoration-ink/30 decoration-2 underline-offset-[6px] hover:decoration-accent"
          >
            The whole story <Arrow />
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Six gift stories. Desktop: a pinned horizontal track driven by vertical scroll.
 * Mobile / reduced motion: the same stories stacked vertically.
 */
export function GiftStories() {
  const desktop = useDesktop();
  const reduce = useReducedMotionSafe();
  const horizontal = desktop && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!horizontal || !track) return;
    const ro = new ResizeObserver(() => setDistance(Math.max(0, track.scrollWidth - window.innerWidth)));
    ro.observe(track);
    return () => ro.disconnect();
  }, [horizontal]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);

  // Horizontal panels don't cross the viewport centre vertically, so drive the accent from progress.
  const lastAccent = useRef<string | null>(null);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!horizontal) return;
    if (v <= 0 || v >= 1) {
      lastAccent.current = null;
      return;
    }
    const i = Math.min(GIFT_ORDER.length - 1, Math.max(0, Math.floor(v * (GIFT_ORDER.length + 1) - 0.3)));
    const accent = GIFTS[GIFT_ORDER[i]].accent;
    if (accent !== lastAccent.current) {
      lastAccent.current = accent;
      setPageAccent(accent);
    }
  });

  return (
    <section
      id="explore"
      ref={sectionRef}
      data-accent={horizontal ? undefined : "tangerine"}
      className="relative bg-frosting"
      style={horizontal ? { height: `calc(${distance}px + 100vh)` } : undefined}
    >
      <div className={cn(horizontal && "sticky top-0 h-screen overflow-hidden")}>
        <motion.div
          ref={trackRef}
          style={horizontal ? { x } : undefined}
          className={cn(horizontal ? "flex h-full w-max items-stretch" : "flex flex-col")}
        >
          <header
            className={cn(
              "relative flex flex-col justify-center px-4 pb-6 pt-28 md:px-10",
              horizontal && "h-full w-[min(64vw,1000px)] shrink-0 px-[5vw] pb-0 pt-0",
            )}
          >
            <p className="label text-smudge">Explore — six gift stories</p>
            <h2 className="mt-5">
              <RevealLines
                className="display block text-[clamp(4.5rem,11.5vw,12rem)]"
                lines={["Six", "things", "people", <span key="k" className="text-accent">keep.</span>]}
              />
            </h2>
            <p className="mt-8 max-w-[26rem] text-[1.1rem] leading-relaxed text-ink/75">
              Not a catalogue. Every one of these started as a photo on somebody’s phone.
            </p>
            {horizontal && (
              <p className="hand mt-8 flex items-center gap-3 text-[2.2rem]">
                keep scrolling <Arrow className="size-8" />
              </p>
            )}
          </header>

          {GIFT_ORDER.map((id, i) => (
            <StoryPanel key={id} gift={GIFTS[id]} index={i} horizontal={horizontal} />
          ))}

          <aside
            className={cn(
              "flex flex-col justify-center gap-6 px-4 pb-24 pt-10 md:px-10",
              horizontal && "h-full w-[min(56vw,860px)] shrink-0 px-[5vw] pb-0 pt-0",
            )}
          >
            <p className="label text-smudge">Still deciding?</p>
            <p className="display text-[clamp(3.6rem,8vw,8.5rem)]">
              Let them
              <br />
              decide.
            </p>
            <p className="max-w-[26rem] text-[1.1rem] leading-relaxed text-ink/75">
              Well — let their personality decide. Three questions, about thirty seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Magnetic>
                <a href="#quiz" data-cursor="cta" className="display inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[1.5rem] text-paper">
                  Take the quiz <Arrow />
                </a>
              </Magnetic>
              <a href="#for" className="self-center underline decoration-ink/30 decoration-2 underline-offset-[6px] hover:decoration-accent">
                or pick by who it’s for
              </a>
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
