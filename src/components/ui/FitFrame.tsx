"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Lays out children on a fixed design canvas (default 420 × 525) and scales the
 * whole canvas to the frame's width — so object compositions keep their proportions
 * at any size. The scale is written straight to the style (ResizeObserver fires
 * before paint), so there's no flash at the wrong size.
 */
export function FitFrame({
  children,
  design = 420,
  className,
}: {
  children: ReactNode;
  design?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (canvas.current) {
        canvas.current.style.transform = `translate(-50%, -50%) scale(${entry.contentRect.width / design})`;
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [design]);

  return (
    <div ref={ref} className={cn("relative aspect-[4/5] w-full", className)}>
      <div
        ref={canvas}
        className="absolute left-1/2 top-1/2 flex items-center justify-center"
        style={{ width: design, height: design * 1.25, transform: "translate(-50%, -50%) scale(0.8)" }}
      >
        {children}
      </div>
    </div>
  );
}
