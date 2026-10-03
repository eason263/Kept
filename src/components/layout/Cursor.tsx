"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/hooks";

const LABELS: Record<string, string> = {
  view: "View",
  drag: "Drag",
  cta: "Let’s go",
  type: "Type",
  copy: "Copy",
};

/**
 * Desktop-only cursor. Elements opt in with `data-cursor="view|drag|cta|type|copy"`
 * (or any custom word). Touch devices never mount it.
 */
export function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      const key = target?.getAttribute("data-cursor") ?? null;
      setLabel(key ? (LABELS[key] ?? key) : null);
    };
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="absolute -left-[7px] -top-[7px] size-[14px] rounded-full bg-paper mix-blend-difference"
        animate={{ scale: label ? 0 : pressed ? 0.6 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <AnimatePresence>
        {label && (
          <motion.div
            key={label}
            className="label absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-accent-ink"
            style={{ fontSize: "0.72rem" }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: pressed ? 0.9 : 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 32 }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
