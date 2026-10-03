"use client";

/* eslint-disable @next/next/no-img-element -- engraving uses blob URLs and CORS images that next/image can't serve */

import { useEngraving } from "@/lib/engrave";
import { photoUrl, type PhotoSrc } from "@/lib/photos";
import { cn } from "@/lib/cn";

export type PlaqueMaterial = "maple" | "walnut" | "slate";
export type PlaqueStyle = "engraved" | "sketch";

interface LaserPlaqueProps {
  src: PhotoSrc;
  name: string;
  date?: string;
  width?: number | string;
  /** Shorthand for material="walnut". */
  dark?: boolean;
  material?: PlaqueMaterial;
  style?: PlaqueStyle;
  className?: string;
}

const SURFACE: Record<PlaqueMaterial, string> = { maple: "wood", walnut: "wood-dark", slate: "slate" };
const VIGNETTE = "radial-gradient(ellipse 54% 56% at 50% 46%, #000 62%, transparent 100%)";

/**
 * Engraved plaque with a portrait and a name. Until the canvas engraving is ready,
 * a filtered photo stands in so the object never looks empty.
 */
export function LaserPlaque({ src, name, date, width = 210, dark, material, style = "engraved", className }: LaserPlaqueProps) {
  const url = photoUrl(src, 520, 650);
  const engraving = useEngraving(url);
  const mat = material ?? (dark ? "walnut" : "maple");
  const slate = mat === "slate";
  const sketch = style === "sketch";
  const art = engraving ? (sketch ? engraving.ink : engraving.burn) : null;
  const nameSize = Math.min(13, 130 / Math.max(6, name.length));
  const ink = slate ? "text-[#d4d7d9] [text-shadow:0_1px_0_rgb(0_0_0/0.5)]" : "engraved";

  return (
    <div
      className={cn(SURFACE[mat], "relative rounded-[10px] p-[9%] pb-[7%] shadow-obj [container-type:inline-size]", className)}
      style={{
        width,
        boxShadow: "inset 0 -5px 0 rgb(0 0 0 / 0.14), inset 0 1px 0 rgb(255 255 255 / 0.3), var(--shadow-obj)",
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
        {art ? (
          <img
            src={art}
            alt=""
            draggable={false}
            className={cn(
              "absolute inset-0 size-full object-cover",
              slate ? "mix-blend-screen [filter:invert(1)_brightness(0.86)]" : "mix-blend-multiply",
              sketch && !slate && "[filter:sepia(1)_saturate(2)_brightness(0.55)]",
            )}
            style={sketch ? { maskImage: VIGNETTE, WebkitMaskImage: VIGNETTE } : undefined}
          />
        ) : (
          <img
            src={url}
            alt=""
            draggable={false}
            crossOrigin="anonymous"
            loading="lazy"
            className={cn(
              "absolute inset-0 size-full object-cover opacity-60",
              slate
                ? "mix-blend-screen [filter:grayscale(1)_contrast(1.5)_invert(1)]"
                : "mix-blend-multiply [filter:grayscale(1)_contrast(1.6)_sepia(0.7)]",
            )}
          />
        )}
      </div>
      <p className={cn("display mt-[7%] text-center leading-none", ink)} style={{ fontSize: `${nameSize}cqw` }}>
        <span key={name} className={cn("inline-block", !slate && "burn-in")}>
          {name}
        </span>
      </p>
      {date && (
        <p className={cn("mt-[3%] text-center font-mono tracking-[0.12em]", ink)} style={{ fontSize: "4.6cqw" }}>
          {date}
        </p>
      )}
    </div>
  );
}
