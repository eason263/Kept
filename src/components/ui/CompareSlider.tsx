"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CompareSliderProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
}

/**
 * Drag (or arrow-key) the divider: left shows `before`, right shows `after`.
 * Both layers fill the frame; `after` is clipped from the divider rightwards.
 */
export function CompareSlider({ before, after, beforeLabel, afterLabel, className }: CompareSliderProps) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const stop = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={frameRef}
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      className={cn("relative aspect-[4/5] w-full touch-pan-y select-none overflow-hidden rounded-[22px] bg-ink/10 shadow-lift", className)}
    >
      <div className="absolute inset-0">{before}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0% 0% 0% ${pos}%)` }}>
        {after}
      </div>

      <span className="label absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 transition-opacity" style={{ opacity: pos > 18 ? 1 : 0 }}>
        {beforeLabel}
      </span>
      <span
        className="label absolute right-4 top-4 rounded-full bg-ink px-3 py-1.5 text-paper transition-opacity"
        style={{ opacity: pos < 82 ? 1 : 0 }}
      >
        {afterLabel}
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(100 - pos)}% after`}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 w-0 focus-visible:outline-none [&:focus-visible>span:last-child]:ring-4 [&:focus-visible>span:last-child]:ring-accent"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute inset-y-0 -left-px w-[2px] bg-paper shadow-[0_0_0_1px_rgb(27_24_22/0.15)]" />
        <span className="absolute left-0 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lift">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </div>
  );
}
