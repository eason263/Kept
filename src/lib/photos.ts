/**
 * Demo photography (Unsplash, free to use). Replace with real product and
 * customer-approved photos before launch.
 */
export const PHOTOS = {
  laugh: "1494790108377-be9c29b29330",
  smile: "1507003211169-0a1dd7228f2d",
  curls: "1539571696357-5a69c17a67c6",
  ginger: "1438761681033-6461ffad8d80",
  friendsHug: "1511632765486-a01980e01a18",
  friendsBench: "1529156069898-49953e39b3ac",
  hearts: "1516589178581-6cd7833ae3b2",
  family: "1511895426328-dc8714191300",
  beagle: "1543466835-00a7907e9de1",
  lick: "1518717758536-85ae29035b6d",
  beach: "1507525428034-b723cf961d3e",
  balloons: "1530103862676-de8c9debad1d",
  confetti: "1513151233558-d860c5398176",
  rainbowCake: "1464349095431-e9a21285b5f3",
  pinkCake: "1558301211-0d8c8ddee6ec",
  cafe: "1543269865-cbf427effbad",
  kid: "1472162072942-cd5147eb3902",
} as const;

export type PhotoKey = keyof typeof PHOTOS;

/** A built-in demo photo, or one the visitor uploaded (object URL). */
export type PhotoSrc = PhotoKey | { url: string };

/** Resolve any photo source to a URL usable by <img> and the engraver. */
export function photoUrl(src: PhotoSrc, w = 900, h?: number) {
  return typeof src === "string" ? photo(src, w, h) : src.url;
}

/** Cropped Unsplash URL. `h` omitted keeps the original aspect. */
export function photo(key: PhotoKey, w = 900, h?: number) {
  const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(w), q: "70" });
  if (h) params.set("h", String(h));
  return `https://images.unsplash.com/photo-${PHOTOS[key]}?${params}`;
}
