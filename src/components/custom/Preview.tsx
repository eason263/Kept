"use client";

import { motion } from "motion/react";
import { CakeTopper, type TopperFont, type TopperTone } from "@/components/objects/CakeTopper";
import { FilmStrip } from "@/components/objects/FilmStrip";
import { HandTag, type TagMaterial } from "@/components/objects/HandTag";
import { Keychain, type KeychainTint } from "@/components/objects/Keychain";
import { LaserPlaque, type PlaqueMaterial, type PlaqueStyle } from "@/components/objects/LaserPlaque";
import { ObjectImage } from "@/components/objects/ObjectImage";
import { PhotoMagnet, type MagnetShape } from "@/components/objects/PhotoMagnet";
import { MagnetWord } from "@/components/ui/MagnetWord";
import { PALETTES, type Values } from "@/lib/customize";
import { useEngraving } from "@/lib/engrave";
import type { GiftId } from "@/lib/gifts";
import type { PhotoKey, PhotoSrc } from "@/lib/photos";

/* Composed for the 420 × 525 FitFrame canvas, like the product visuals. */

export type PhotosFor = (key: string, samples: PhotoKey[]) => PhotoSrc[];

function wrap(text: string, max = 15) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.trim().split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

const MAGNET_SPOTS: Record<number, Array<{ left: string; top: string; size: number; rotate: number }>> = {
  1: [{ left: "30%", top: "40%", size: 170, rotate: -5 }],
  3: [
    { left: "8%", top: "38%", size: 124, rotate: -6 },
    { left: "56%", top: "35%", size: 118, rotate: 5 },
    { left: "30%", top: "64%", size: 120, rotate: -2 },
  ],
  6: [
    { left: "6%", top: "36%", size: 100, rotate: -6 },
    { left: "37%", top: "34%", size: 96, rotate: 4 },
    { left: "67%", top: "37%", size: 98, rotate: -3 },
    { left: "8%", top: "62%", size: 96, rotate: 5 },
    { left: "38%", top: "63%", size: 100, rotate: -4 },
    { left: "68%", top: "61%", size: 94, rotate: 6 },
  ],
};

function NoteTag({ url, material }: { url: string; material: TagMaterial }) {
  const engraving = useEngraving(url);
  return <HandTag lines={["…"]} material={material} image={engraving?.ink ?? url} width={350} />;
}

export function Preview({ id, values: v, photos, side }: { id: GiftId; values: Values; photos: PhotosFor; side: "front" | "back" }) {
  switch (id) {
    case "laser-portrait":
      return (
        <LaserPlaque
          src={photos("photo", ["laugh"])[0]}
          name={v.line1 || "MAYA"}
          date={v.line2}
          material={v.material as PlaqueMaterial}
          style={v.style as PlaqueStyle}
          width={300}
        />
      );

    case "magnet-set": {
      const count = Number(v.size) || 1;
      const srcs = photos("photo", ["lick", "hearts", "beagle", "kid", "family", "confetti"]);
      return (
        <div className="steel relative h-[480px] w-[380px] rounded-[24px] shadow-lift">
          <span aria-hidden className="absolute inset-y-[16%] right-[4%] w-[3%] rounded-full bg-gradient-to-r from-[#bdbbb5] to-[#efeeea] shadow-inner" />
          <div className="absolute inset-x-[6%] top-[6%] flex justify-center" style={{ fontSize: (v.letters || "MAYA").length > 6 ? "2.6rem" : "3.6rem" }}>
            <MagnetWord text={v.letters || "MAYA"} palette={PALETTES[v.palette]} />
          </div>
          {MAGNET_SPOTS[count].map((s, i) => (
            <div key={i} className="absolute" style={{ left: s.left, top: s.top, rotate: `${s.rotate}deg` }}>
              <PhotoMagnet src={srcs[i % srcs.length]} shape={v.shape as MagnetShape} size={s.size} />
            </div>
          ))}
        </div>
      );
    }

    case "photo-keychain": {
      const src = photos("photo", ["friendsHug"])[0];
      const pair = v.size === "pair";
      const tint = v.tint as KeychainTint;
      return (
        <div className="relative flex items-start justify-center gap-6">
          <div style={{ perspective: 1100 }}>
            <motion.div
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: side === "back" ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 16 }}
            >
              <div style={{ backfaceVisibility: "hidden" }}>
                <Keychain src={src} letter={v.initial} tint={tint} width={pair ? 180 : 230} />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <Keychain src={src} back={v.back} tint={tint} width={pair ? 180 : 230} />
              </div>
            </motion.div>
          </div>
          {pair && (
            <div className="mt-10 rotate-[6deg]">
              <Keychain src={photos("photo", ["friendsHug"])[0]} letter={v.initial} tint={tint} width={180} />
            </div>
          )}
        </div>
      );
    }

    case "cake-topper":
      return (
        <div className="relative w-[340px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full shadow-lift">
            <ObjectImage src="pinkCake" w={800} h={1000} sizes="360px" className="object-bottom" />
          </div>
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2">
            <CakeTopper
              name={v.line2 || "maya"}
              line={v.line1 || "happy birthday"}
              tone={v.finish as TopperTone}
              font={v.font as TopperFont}
              width={v.size === "18" ? 250 : 222}
            />
          </div>
        </div>
      );

    case "film-strip": {
      const frames = photos("frames", ["kid", "cafe", "beach"]);
      const twelve = v.size === "12";
      return (
        <div className="flex flex-col items-center">
          <div className="-rotate-[6deg]">
            <FilmStrip photos={frames.slice(0, 3)} frame={112} caption={v.caption || "OUR YEAR"} />
          </div>
          {twelve && (
            <div className="-mt-3 rotate-[4deg]">
              <FilmStrip photos={["balloons", "friendsBench", "confetti"]} frame={112} caption="+ 9 MORE FRAMES" />
            </div>
          )}
          <div
            className={`${v.base === "walnut" ? "wood-dark" : "wood"} relative mt-7 h-11 w-[330px] rounded-[8px] shadow-obj`}
            style={{ boxShadow: "inset 0 -4px 0 rgb(0 0 0 / 0.18), var(--shadow-obj)" }}
          >
            <span aria-hidden className="absolute inset-x-[6%] -top-1 h-2 rounded-full bg-[#fff6d8] shadow-[0_0_24px_8px_rgb(255_230_160/0.7)]" />
          </div>
        </div>
      );
    }

    case "handwriting": {
      const material = v.material as TagMaterial;
      const width = v.size === "plaque" ? 370 : 330;
      if (v.source === "upload") {
        const note = photos("note", [])[0];
        if (note && typeof note !== "string") return <NoteTag url={note.url} material={material} />;
        return <HandTag lines={["your note", "goes here"]} material={material} width={width} />;
      }
      return <HandTag lines={wrap(v.message || "love you more than cake")} sign={v.sign} material={material} width={width} />;
    }
  }
}
