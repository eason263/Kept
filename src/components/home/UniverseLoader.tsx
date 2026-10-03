"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MagnetWord } from "@/components/ui/MagnetWord";
import { formatDate, useBirthday, useNames } from "@/lib/birthday";
import { scrollToId } from "@/lib/scroll";
import { EASE_OUT } from "@/lib/cn";

const STEP_MS = 420;

function LoaderContent() {
  const { day, month, closeLoader } = useBirthday();
  const n = useNames();
  const [step, setStep] = useState(0);
  const steps = [
    "Finding the good photos",
    "Lighting candles (we won’t count)",
    `Engraving “${n.upper}” into walnut`,
    "Hiding the receipt",
  ];

  useEffect(() => {
    const timers = steps.map((_, i) => window.setTimeout(() => setStep(i + 1), 500 + i * STEP_MS));
    const end = 500 + steps.length * STEP_MS;
    timers.push(window.setTimeout(() => scrollToId("universe", { immediate: true }), end + 250));
    timers.push(window.setTimeout(closeLoader, end + 420));
    return () => timers.forEach(window.clearTimeout);
    // Runs once per mount; the overlay remounts for every build.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-ink px-4 text-paper"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.75, ease: EASE_OUT }}
    >
      <p className="label text-paper/50">Building a birthday universe</p>
      <motion.div
        className="mt-6 text-[clamp(4rem,15vw,13rem)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 160, damping: 16 }}
      >
        <MagnetWord text={n.name || "?"} />
      </motion.div>
      <p className="display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] text-bubble">{formatDate(day, month)}</p>
      <p className="hand mt-6 text-[2.2rem] text-paper/85">{n.possessive} birthday story is loading…</p>

      <ul className="mt-8 w-full max-w-[24rem] space-y-2.5 font-mono text-[0.8rem] uppercase tracking-wide">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 transition-opacity duration-300" style={{ opacity: step > i ? 1 : 0.28 }}>
            <span className="grid size-5 place-items-center rounded-full border border-paper/40">
              {step > i && (
                <motion.svg viewBox="0 0 12 12" className="size-3 text-bubble" aria-hidden>
                  <motion.path
                    d="M2 6.5 5 9.2 10 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.svg>
              )}
            </span>
            {s}
          </li>
        ))}
      </ul>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-paper/10">
        <motion.div
          className="h-full origin-left bg-bubble"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: step / steps.length }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        />
      </div>
    </motion.div>
  );
}

/** Full-screen "your birthday story is loading…" moment between the form and the universe. */
export function UniverseLoader() {
  const { loaderOpen } = useBirthday();
  return <AnimatePresence>{loaderOpen && <LoaderContent />}</AnimatePresence>;
}
