/* eslint-disable @next/next/no-img-element -- uploaded notes are object URLs */
import { cn } from "@/lib/cn";

export type TagMaterial = "brass" | "walnut" | "steel";

const SURFACE: Record<TagMaterial, { className: string; ink: string; emboss: string; image: string }> = {
  brass: {
    className: "brass",
    ink: "text-[#5a3d12]",
    emboss: "0 1px 0 rgb(255 240 200 / 0.6), 0 -1px 0 rgb(60 40 10 / 0.35)",
    image: "mix-blend-multiply [filter:sepia(1)_saturate(2.2)_brightness(0.6)]",
  },
  walnut: {
    className: "wood-dark",
    ink: "text-[#f3dcb9]",
    emboss: "0 1px 0 rgb(0 0 0 / 0.45)",
    image: "[filter:invert(1)_sepia(0.7)_brightness(0.95)]",
  },
  steel: {
    className: "steel",
    ink: "text-[#2b2f33]",
    emboss: "0 1px 0 rgb(255 255 255 / 0.7), 0 -1px 0 rgb(0 0 0 / 0.25)",
    image: "mix-blend-multiply [filter:grayscale(1)_contrast(1.3)]",
  },
};

/** Metal (or walnut) tag with handwriting engraved exactly as written. */
export function HandTag({
  lines,
  sign,
  material = "brass",
  image,
  width = 240,
  className,
}: {
  lines: string[];
  sign?: string;
  material?: TagMaterial;
  /** Line art of an uploaded note, engraved instead of the typed lines. */
  image?: string;
  width?: number | string;
  className?: string;
}) {
  const s = SURFACE[material];
  return (
    <div
      className={cn(s.className, "relative rounded-[14px] py-[9%] pl-[17%] pr-[8%] shadow-obj [container-type:inline-size]", className)}
      style={{
        width,
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.5), inset 0 -3px 0 rgb(40 25 5 / 0.3), var(--shadow-obj)",
      }}
    >
      <span
        aria-hidden
        className="absolute left-[6%] top-1/2 size-[6%] -translate-y-1/2 rounded-full bg-frosting"
        style={{ boxShadow: "inset 0 2px 3px rgb(0 0 0 / 0.35)" }}
      />
      {image ? (
        <img src={image} alt="" className={cn("aspect-[3/2] w-full rounded-[4px] object-cover", s.image)} />
      ) : (
        lines.map((l, i) => (
          <p key={i} className={cn("hand leading-[0.95]", s.ink)} style={{ fontSize: "12cqw", textShadow: s.emboss }}>
            {l}
          </p>
        ))
      )}
      {sign && !image && (
        <p className={cn("hand mt-[3%] text-right opacity-90", s.ink)} style={{ fontSize: "10cqw", textShadow: s.emboss }}>
          — {sign}
        </p>
      )}
    </div>
  );
}
