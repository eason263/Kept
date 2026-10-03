import { ObjectImage } from "./ObjectImage";
import type { PhotoSrc } from "@/lib/photos";
import { cn } from "@/lib/cn";

interface PolaroidProps {
  src: PhotoSrc;
  caption?: string;
  width?: number | string;
  tape?: boolean;
  eager?: boolean;
  sizes?: string;
  className?: string;
}

/** Instant photo with a handwritten caption. Caption scales with the frame (container units). */
export function Polaroid({ src, caption, width = 200, tape, eager, sizes = "220px", className }: PolaroidProps) {
  return (
    <figure
      className={cn("relative bg-paper p-[6%] pb-[22%] shadow-obj [container-type:inline-size]", className)}
      style={{ width }}
    >
      {tape && (
        <span
          aria-hidden
          className="absolute -top-[6%] left-1/2 h-[12%] w-[40%] -translate-x-1/2 -rotate-3 bg-[#f6eccd]/80 shadow-sm"
        />
      )}
      <div className="relative aspect-square overflow-hidden bg-ink/10">
        <ObjectImage src={src} w={600} h={600} sizes={sizes} eager={eager} />
        <span aria-hidden className="gloss absolute inset-0 opacity-40" />
      </div>
      {caption && (
        <figcaption className="hand absolute inset-x-[6%] bottom-[5%] truncate text-center text-[13cqw] text-ink/85">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
