"use client";

import { useId } from "react";
import { ObjectImage } from "./ObjectImage";
import type { Accent } from "@/lib/accents";
import type { PhotoSrc } from "@/lib/photos";
import { cn } from "@/lib/cn";
import { MagnetLetter } from "@/components/ui/MagnetWord";

export type KeychainTint = Accent | "clear";

interface KeychainProps {
  src: PhotoSrc;
  letter?: string;
  tint?: KeychainTint;
  width?: number;
  /** Show the back: the printed message instead of the photo. */
  back?: string;
  className?: string;
}

const tintFill = (tint: KeychainTint) =>
  tint === "clear"
    ? "linear-gradient(160deg, rgb(255 255 255 / 0.7), rgb(220 235 240 / 0.45))"
    : `color-mix(in srgb, var(--${tint}) 55%, rgb(255 255 255 / 0.4))`;

/** Tinted acrylic photo keychain on a split ring, with an initial stuck on the corner. */
export function Keychain({ src, letter, tint = "bubble", width = 130, back, className }: KeychainProps) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={cn("relative flex flex-col items-center [container-type:inline-size]", className)} style={{ width }}>
      <svg viewBox="0 0 60 74" className="relative z-10 -mb-[9%] w-[44%]" aria-hidden>
        <defs>
          <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbfbf9" />
            <stop offset="0.45" stopColor="#9c9b96" />
            <stop offset="0.7" stopColor="#ecebe7" />
            <stop offset="1" stopColor="#8d8c87" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="22" r="18" fill="none" stroke={`url(#m${id})`} strokeWidth="4.5" />
        <rect x="26" y="38" width="8" height="20" rx="4" fill="none" stroke={`url(#m${id})`} strokeWidth="3" />
        <circle cx="30" cy="66" r="5" fill="none" stroke={`url(#m${id})`} strokeWidth="2.6" />
      </svg>
      <div
        className="relative w-full rounded-[18%/14%] p-[7%] pt-[16%] shadow-obj"
        style={{ background: tintFill(tint), border: "1px solid rgb(255 255 255 / 0.65)" }}
      >
        <span aria-hidden className="absolute left-1/2 top-[4%] size-[9%] -translate-x-1/2 rounded-full bg-frosting ring-1 ring-black/10" />
        <div className="relative aspect-[4/5] overflow-hidden rounded-[10%]">
          {back !== undefined ? (
            <div className="flex size-full items-center justify-center bg-paper/70 p-[10%] text-center">
              <p className="hand leading-[0.95] text-ink" style={{ fontSize: back.length > 18 ? "13cqw" : "17cqw" }}>
                {back || "…"}
              </p>
            </div>
          ) : (
            <ObjectImage src={src} w={400} h={500} sizes="200px" />
          )}
        </div>
        <span aria-hidden className="gloss pointer-events-none absolute inset-0 rounded-[inherit]" />
        {letter && back === undefined && (
          <MagnetLetter
            char={letter}
            accent="blue"
            rotate={12}
            className="absolute -bottom-[10%] -right-[12%]"
            style={{ fontSize: letter.length > 1 ? "26cqw" : "34cqw" }}
          />
        )}
      </div>
    </div>
  );
}
