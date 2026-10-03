"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProcessVisual } from "./GiftVisuals";
import { FitFrame } from "@/components/ui/FitFrame";
import { RevealLines } from "@/components/ui/RevealLines";
import { DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";
import { cn, EASE_OUT } from "@/lib/cn";

function Step({
  id,
  index,
  title,
  body,
  active,
  onActive,
}: {
  id: GiftId;
  index: number;
  title: string;
  body: string;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="flex flex-col justify-center border-t border-ink/15 py-12 lg:min-h-[78vh] lg:py-0">
      <div className="mb-8 w-full max-w-[420px] lg:hidden">
        <FitFrame>
          <ProcessVisual id={id} step={index} />
        </FitFrame>
      </div>
      <p className="label text-smudge">Step {index + 1} of 4</p>
      <p className="display mt-3 text-[clamp(2.4rem,4.4vw,4.8rem)]">
        <span className={cn("transition-colors duration-500", active && "lg:text-accent")}>{String(index + 1).padStart(2, "0")}</span>{" "}
        {title}
      </p>
      <p className="mt-5 max-w-[30rem] text-[1.15rem] leading-relaxed text-ink/75">{body}</p>
    </li>
  );
}

/**
 * Four steps from phone to shelf. Desktop: the visual is pinned and changes as each
 * step crosses the middle of the screen. Mobile: each step carries its own visual.
 */
export function MakingProcess({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  const steps = DETAILS[id].process;
  const [active, setActive] = useState(0);

  return (
    <section id="process" data-accent={gift.accent} className="relative bg-paper px-4 py-[14vh] md:px-10">
      <header className="max-w-4xl">
        <p className="label text-smudge">How it’s made</p>
        <h2 className="mt-5">
          <RevealLines
            className="display block text-[clamp(3.2rem,7vw,7.5rem)]"
            lines={["From your phone", <span key="2" className="text-accent">to their shelf.</span>]}
          />
        </h2>
      </header>

      <div className="mt-14 lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="hidden lg:block">
          <div className="sticky top-[11vh] flex h-[78vh] items-center justify-center">
            <div className="w-[min(100%,calc(78vh*0.8))]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 40, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -40, rotate: 2 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <FitFrame>
                    <ProcessVisual id={id} step={active} />
                  </FitFrame>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <ol>
          {steps.map((s, i) => (
            <Step key={s.title} id={id} index={i} title={s.title} body={s.body} active={active === i} onActive={setActive} />
          ))}
        </ol>
      </div>
    </section>
  );
}
