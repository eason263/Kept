import { ObjectImage } from "./ObjectImage";
import type { PhotoSrc } from "@/lib/photos";
import { cn } from "@/lib/cn";

const HEART =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 22'><path d='M12 21.4 10.5 20C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.5Z'/></svg>\")";

export type MagnetShape = "circle" | "heart" | "square";

/** Die-cut glossy photo magnet. */
export function PhotoMagnet({
  src,
  shape = "circle",
  size = 120,
  className,
}: {
  src: PhotoSrc;
  shape?: MagnetShape;
  size?: number;
  className?: string;
}) {
  if (shape === "heart") {
    const mask = { WebkitMaskImage: HEART, maskImage: HEART, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" };
    return (
      <div
        className={cn("relative", className)}
        style={{ width: size, height: size * 0.92, filter: "drop-shadow(0 10px 12px rgb(27 24 22 / 0.3))" }}
      >
        <div className="absolute inset-0 bg-paper" style={mask} />
        <div className="absolute inset-[7%]" style={mask}>
          <ObjectImage src={src} w={400} h={400} sizes={`${size}px`} />
          <span aria-hidden className="gloss absolute inset-0" />
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "relative overflow-hidden border-[5px] border-paper shadow-obj",
        shape === "circle" ? "rounded-full" : "rounded-[18%]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <ObjectImage src={src} w={400} h={400} sizes={`${size}px`} />
      <span aria-hidden className="gloss absolute inset-0" />
    </div>
  );
}
