"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/cn";

interface MagneticProps {
  children: ReactNode;
  /** How far toward the pointer the child travels (0–1 of the offset). */
  strength?: number;
  /** Extra px around the element where the pull starts. */
  radius?: number;
  className?: string;
}

/**
 * Pulls its child toward the pointer when it comes near, springs back when it leaves.
 * The outer box stays put (it's what we measure); the inner box moves.
 */
export function Magnetic({ children, strength = 0.32, radius = 80, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 200, damping: 15, mass: 0.5 });
  const y = useSpring(0, { stiffness: 200, damping: 15, mass: 0.5 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduce) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius;
      x.set(near ? dx * strength : 0);
      y.set(near ? dy * strength : 0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, reduce, radius, strength, x, y]);

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      <motion.span className="block" style={{ x, y }}>
        {children}
      </motion.span>
    </span>
  );
}
