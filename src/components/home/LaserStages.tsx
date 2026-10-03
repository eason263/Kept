"use client";

/* eslint-disable @next/next/no-img-element -- engraving uses blob URLs and CORS images that next/image can't serve */

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useEngraving } from "@/lib/engrave";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const STAGES = ["Photo", "Line", "Burn", "Kept"] as const;
const WIPE = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };

/**
 * Photo → line drawing → laser burn → finished object.
 * Desktop: hover runs the sequence. Touch: loops while in view; tap a stage to jump.
 * Each step is wiped in by a glowing scan line, like the machine does it.
 */
export function LaserStages({ src, className }: { src: string; className?: string }) {
  const engraving = useEngraving(src);
  const fine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.55 });
  const [hovering, setHovering] = useState(false);
  const [stage, setStage] = useState(0);
  const running = fine ? hovering : inView;

  useEffect(() => {
    if (!running) {
      const t = window.setTimeout(() => setStage(0), fine ? 200 : 0);
      return () => window.clearTimeout(t);
    }
    const id = window.setInterval(
      () => setStage((s) => (fine ? Math.min(STAGES.length - 1, s + 1) : (s + 1) % STAGES.length)),
      fine ? 1000 : 1600,
    );
    return () => window.clearInterval(id);
  }, [running, fine]);

  const layer = (i: number) => ({
    initial: false as const,
    animate: { clipPath: stage >= i ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
    transition: WIPE,
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={ref}
        data-cursor="view"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-ink/10 shadow-obj"
      >
        <img src={src} alt="The original photo" crossOrigin="anonymous" loading="lazy" className="absolute inset-0 size-full object-cover" />

        <motion.div className="absolute inset-0 bg-[#f6f0e4]" {...layer(1)}>
          <img
            src={engraving?.line ?? src}
            alt=""
            crossOrigin="anonymous"
            className={cn("size-full object-cover", !engraving && "[filter:grayscale(1)_contrast(3)_brightness(1.25)]")}
          />
        </motion.div>

        <motion.div className="wood absolute inset-0" {...layer(2)}>
          <img
            src={engraving?.burn ?? src}
            alt=""
            crossOrigin="anonymous"
            className={cn("size-full object-cover mix-blend-multiply", !engraving && "opacity-60 [filter:grayscale(1)_contrast(1.6)_sepia(0.7)]")}
          />
        </motion.div>

        <motion.div className="absolute inset-0 flex items-center justify-center bg-[#e7dccb]" {...layer(3)}>
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[26%] bg-[#d6c7b0] shadow-[inset_0_6px_10px_-6px_rgb(27_24_22/0.35)]" />
          <div
            className="wood relative mb-[14%] w-[58%] -rotate-[4deg] rounded-[8px] p-[5%] shadow-lift"
            style={{ boxShadow: "inset 0 -5px 0 rgb(0 0 0 / 0.15), var(--shadow-lift)" }}
          >
            <img src={engraving?.burn ?? src} alt="" crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover mix-blend-multiply" />
          </div>
          <p className="hand absolute bottom-[8%] text-[clamp(1.4rem,2vw,2rem)] text-ink/75">on the shelf, ten years later</p>
        </motion.div>

        <AnimatePresence>
          {stage > 0 && (
            <motion.span
              key={stage}
              aria-hidden
              className="absolute inset-x-0 h-[3px] bg-[#ffb36b] shadow-[0_0_14px_4px_rgb(255_107_28/0.85)]"
              initial={{ top: "0%", opacity: 1 }}
              animate={{ top: "100%", opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={WIPE}
            />
          )}
        </AnimatePresence>
      </div>

      <ol className="mt-4 grid grid-cols-4 gap-1.5" aria-label="Making stages">
        {STAGES.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setStage(i)}
              aria-pressed={stage === i}
              className={cn(
                "label w-full rounded-full border px-2 py-2 transition-colors duration-300",
                stage === i ? "border-ink bg-ink text-paper" : stage > i ? "border-ink/40 text-ink" : "border-ink/15 text-ink/45",
              )}
            >
              {String(i + 1).padStart(2, "0")} {s}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
