"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/cn";

interface RevealLinesProps {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Controlled reveal (e.g. wait for the intro). Defaults to reveal-on-scroll. */
  show?: boolean;
}

/** Each line rises out of its own mask — "ink rises from a line". */
export function RevealLines({ lines, className, lineClassName, delay = 0, show }: RevealLinesProps) {
  const controlled = show !== undefined;
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
          <motion.span
            className={lineClassName ?? "block"}
            initial={{ y: "105%" }}
            {...(controlled
              ? { animate: show ? { y: "0%" } : { y: "105%" } }
              : { whileInView: { y: "0%" }, viewport: { once: true, margin: "0px 0px -12% 0px" } })}
            transition={{ duration: 0.95, ease: EASE_OUT, delay: delay + i * 0.07 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
