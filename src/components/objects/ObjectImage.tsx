/* eslint-disable @next/next/no-img-element -- uploaded photos are object URLs, which next/image can't optimise */
import Image from "next/image";
import { photo, type PhotoSrc } from "@/lib/photos";
import { cn } from "@/lib/cn";

/** Fills its (relative) parent with a demo photo via next/image, or an uploaded one via <img>. */
export function ObjectImage({
  src,
  w,
  h,
  sizes,
  eager,
  className,
}: {
  src: PhotoSrc;
  w: number;
  h?: number;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  if (typeof src === "string") {
    return (
      <Image
        src={photo(src, w, h)}
        alt=""
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className={cn("object-cover", className)}
        draggable={false}
      />
    );
  }
  return <img src={src.url} alt="" draggable={false} className={cn("absolute inset-0 size-full object-cover", className)} />;
}
