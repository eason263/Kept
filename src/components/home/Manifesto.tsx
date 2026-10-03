"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { LaserPlaque } from "@/components/objects/LaserPlaque";
import { RevealLines } from "@/components/ui/RevealLines";
import { useNames } from "@/lib/birthday";

/**
 * MAKE / {NAME} / REMEMBER — three giant lines sliding against each other on scroll,
 * with an engraved plaque passing *between* the second and third line.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const n = useNames();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-6%", "22%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["6%", "-34%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-28%", "4%"]);
  const plaqueY = useTransform(scrollYProgress, [0, 1], ["40%", "-55%"]);
  const plaqueRotate = useTransform(scrollYProgress, [0, 1], [-16, 12]);
  const middle = n.hasName ? n.name : "Them";

  return (
    <section ref={ref} data-accent="cherry" className="relative overflow-hidden bg-cherry pb-[14vh] pt-[16vh] text-ink">
      <p
        aria-hidden
        className="label absolute right-3 top-[18vh] hidden rotate-180 text-ink/60 [writing-mode:vertical-rl] md:block"
      >
        No mugs were harmed in the making of this website
      </p>

      <div className="relative">
        <h2 className="display text-[clamp(6rem,25vw,27rem)] leading-[0.78]" aria-label={`Make ${middle} remember`}>
          <motion.span aria-hidden style={{ x: x1 }} className="relative z-0 block whitespace-nowrap pl-[4vw]">
            Make
          </motion.span>
          <motion.span aria-hidden style={{ x: x2 }} className="relative z-0 block whitespace-nowrap text-right text-paper">
            {middle}
          </motion.span>
          <motion.span aria-hidden style={{ x: x3 }} className="relative z-20 block whitespace-nowrap">
            Remember
          </motion.span>
        </h2>

        <motion.div
          aria-hidden
          className="relative z-10 mx-auto mt-10 w-max md:absolute md:left-[57%] md:top-[16%] md:mt-0"
          style={{ y: plaqueY, rotate: plaqueRotate }}
        >
          <p className="hand mb-3 -rotate-3 text-center text-[clamp(1.5rem,2.2vw,2.2rem)] text-paper">their face. on walnut. forever.</p>
          <LaserPlaque src="smile" name="DAD" date="SINCE 1971" width="clamp(150px, 19vw, 300px)" dark />
        </motion.div>
      </div>

      <div className="relative z-20 mt-[12vh] grid gap-6 px-4 md:grid-cols-12 md:px-10">
        <p className="label md:col-span-3">Why we exist</p>
        <p className="text-[clamp(1.45rem,2.5vw,2.4rem)] font-medium leading-[1.12] tracking-[-0.01em] md:col-span-8 md:col-start-5">
          Most birthday gifts get opened, smiled at, and forgotten by March. We make the other kind — objects built from a
          photo, a name, an inside joke. Things that end up on the fridge, the keys, the shelf.{" "}
          <span className="text-paper">For years.</span>
        </p>
      </div>

      <div className="relative z-20 mt-[10vh] px-4 md:px-10">
        <RevealLines
          className="display block text-[clamp(3rem,9vw,9rem)]"
          lines={[
            "You bring the memory.",
            <span key="2" className="text-paper">
              We make the thing.
            </span>,
          ]}
        />
      </div>
    </section>
  );
}
