"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Candle } from "@/components/objects/Candle";
import { markIntroDone } from "@/lib/intro";
import { EASE_OUT } from "@/lib/cn";

/**
 * First visit per session: a candle, a wish, a puff of smoke, curtain up (~1.9s).
 * Skipped by an inline <head> script when already seen or reduced motion is on;
 * any key or tap skips it too.
 */
export function Intro() {
  const [phase, setPhase] = useState<"lit" | "out" | "gone">("lit");

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      markIntroDone();
      return;
    }
    try {
      sessionStorage.setItem("kept:intro", "1");
    } catch {}

    const finish = () => {
      setPhase("gone");
      markIntroDone();
    };
    const t1 = window.setTimeout(() => setPhase("out"), 1150);
    const t2 = window.setTimeout(finish, 1900);
    const skip = () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      finish();
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "gone" && (
        <motion.div
          className="intro fixed inset-0 z-[95] flex flex-col items-center justify-center bg-ink text-paper"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          aria-hidden
        >
          <Candle lit={phase === "lit"} height={150} />
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              className="hand mt-10 text-[2.75rem]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {phase === "lit" ? "make a wish…" : "okay. let’s go."}
            </motion.p>
          </AnimatePresence>
          <p className="label absolute bottom-6 text-paper/45">kept. — birthday objects, made to keep</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
