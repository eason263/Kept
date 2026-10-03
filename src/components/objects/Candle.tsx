"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId } from "react";

interface CandleProps {
  lit?: boolean;
  /** Rendered height in px. */
  height?: number;
  stripe?: string;
  body?: string;
  className?: string;
}

/** Striped birthday candle. Blowing it out (`lit=false`) leaves a curl of smoke. */
export function Candle({ lit = true, height = 160, stripe = "var(--cherry)", body = "var(--paper)", className }: CandleProps) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 40 160"
      height={height}
      width={(height * 40) / 160}
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <defs>
        <pattern id={`s${id}`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <rect width="12" height="12" fill={body} />
          <rect width="5" height="12" fill={stripe} />
        </pattern>
        <radialGradient id={`g${id}`}>
          <stop offset="0%" stopColor="#ffc46b" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`h${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <rect x="11" y="52" width="18" height="106" rx="3" fill={`url(#s${id})`} />
      <rect x="11" y="52" width="18" height="106" rx="3" fill={`url(#h${id})`} />
      <path d="M11 56 q 3 7 6 1 q 3 9 6 0 q 3 6 6 -1 V52 H11 Z" fill={body} opacity="0.9" />
      <line x1="20" y1="52" x2="20" y2="41" stroke="#1b1816" strokeWidth="1.6" strokeLinecap="round" />

      <AnimatePresence initial={false}>
        {lit && (
          <motion.g
            key="flame"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.18 } }}
            style={{ originX: 0.5, originY: 0.8 }}
          >
            <circle cx="20" cy="28" r="24" fill={`url(#g${id})`} />
            <g className="flicker">
              <path d="M20 6 C 28 18, 29 30, 20 42 C 11 30, 12 18, 20 6 Z" fill="#ff7a1f" />
              <path d="M20 18 C 24 25, 24 33, 20 40 C 16 33, 16 25, 20 18 Z" fill="#ffe08a" />
            </g>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!lit && (
          <motion.path
            key="smoke"
            d="M20 40 C 13 31, 27 24, 20 14 C 14 6, 25 -2, 19 -14 C 15 -22, 22 -28, 20 -36"
            fill="none"
            stroke="#8a847b"
            strokeWidth="2.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.9 }}
            animate={{ pathLength: 1, opacity: [0.9, 0.7, 0] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </svg>
  );
}
