import { ObjectImage } from "./ObjectImage";
import type { PhotoSrc } from "@/lib/photos";
import { cn } from "@/lib/cn";

const SPROCKETS = "linear-gradient(90deg, rgb(251 247 240 / 0.88) 0 9px, transparent 9px)";

/** A short strip of film negatives (well — positives). */
export function FilmStrip({
  photos,
  frame = 96,
  caption = "KEPT 400 ▸ 12A",
  className,
}: {
  photos: PhotoSrc[];
  frame?: number;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-flex flex-col bg-ink px-2 shadow-obj", className)} style={{ paddingBlock: frame * 0.2 }}>
      <span
        aria-hidden
        className="absolute inset-x-1 top-[5px] h-[7px] rounded-[2px]"
        style={{ backgroundImage: SPROCKETS, backgroundSize: "17px 7px" }}
      />
      <span
        aria-hidden
        className="absolute inset-x-1 bottom-[5px] h-[7px] rounded-[2px]"
        style={{ backgroundImage: SPROCKETS, backgroundSize: "17px 7px" }}
      />
      <div className="flex gap-1.5">
        {photos.map((p, i) => (
          <div key={i} className="relative overflow-hidden rounded-[2px]" style={{ width: frame, height: frame * 0.72 }}>
            <ObjectImage
              src={p}
              w={360}
              h={260}
              sizes={`${frame * 2}px`}
              className="[filter:saturate(1.15)_contrast(1.05)_sepia(0.12)]"
            />
          </div>
        ))}
      </div>
      <span aria-hidden className="absolute bottom-[13px] left-3 whitespace-nowrap font-mono text-[7px] uppercase tracking-widest text-[#e8b33a]/80">
        {caption}
      </span>
    </div>
  );
}
