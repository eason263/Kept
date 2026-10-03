"use client";

import type { ReactNode } from "react";
import { CakeTopper } from "@/components/objects/CakeTopper";
import { FilmStrip } from "@/components/objects/FilmStrip";
import { HandTag } from "@/components/objects/HandTag";
import { Keychain } from "@/components/objects/Keychain";
import { LaserPlaque } from "@/components/objects/LaserPlaque";
import { Note } from "@/components/objects/Note";
import { ObjectImage } from "@/components/objects/ObjectImage";
import { PhotoMagnet } from "@/components/objects/PhotoMagnet";
import { Polaroid } from "@/components/objects/Polaroid";
import { MagnetWord } from "@/components/ui/MagnetWord";
import { formatDate, useBirthday, useNames } from "@/lib/birthday";
import { GIFTS, type GiftId } from "@/lib/gifts";
import type { PhotoKey } from "@/lib/photos";
import { cn } from "@/lib/cn";

/* All visuals here are composed for a 420 × 525 canvas — wrap them in <FitFrame>. */

function PhoneShot({ src, file, time, className }: { src: PhotoKey; file: string; time: string; className?: string }) {
  return (
    <figure className={cn("relative aspect-[4/5] w-[330px] overflow-hidden rounded-[26px] shadow-lift", className)}>
      <ObjectImage src={src} w={700} h={875} sizes="360px" />
      <figcaption className="label absolute inset-x-3 bottom-3 flex justify-between rounded-full bg-ink/70 px-3 py-1.5 text-paper backdrop-blur">
        <span>{file}</span>
        <span>{time}</span>
      </figcaption>
    </figure>
  );
}

const ROLL: PhotoKey[] = ["kid", "beach", "cafe", "balloons", "friendsBench", "confetti", "beagle", "pinkCake", "hearts", "friendsHug", "rainbowCake", "family"];

/** What the customer already has. */
export function SourceVisual({ id }: { id: GiftId }) {
  const n = useNames();
  const who = n.hasName ? n.lower : "maya";

  switch (id) {
    case "laser-portrait":
      return <PhoneShot src="laugh" file="IMG_4821.HEIC" time="Sat 23:41" />;
    case "photo-keychain":
      return <PhoneShot src="friendsHug" file="IMG_0207.HEIC" time="Aug, golden hour" />;
    case "magnet-set":
      return (
        <div className="relative h-[460px] w-[380px]">
          <PhoneShot src="hearts" file="IMG_1180.JPG" time="Feb 14" className="absolute right-0 top-0 w-[250px] rotate-[6deg]" />
          <PhoneShot src="lick" file="IMG_3312.HEIC" time="Tue 07:02" className="absolute bottom-0 left-0 w-[250px] -rotate-[5deg]" />
        </div>
      );
    case "cake-topper":
      return (
        <div className="w-[330px] rounded-[34px] bg-paper p-5 shadow-lift">
          <p className="label text-center text-smudge">The group chat</p>
          <div className="mt-5 space-y-2.5 text-[1.02rem] leading-snug">
            <p className="w-fit max-w-[80%] rounded-[20px] rounded-bl-[6px] bg-[#e6e1d9] px-4 py-2.5">what are we doing for {who}’s 30th</p>
            <p className="ml-auto w-fit max-w-[80%] rounded-[20px] rounded-br-[6px] bg-blue px-4 py-2.5 text-paper">cake. obviously</p>
            <p className="ml-auto w-fit max-w-[80%] rounded-[20px] rounded-br-[6px] bg-blue px-4 py-2.5 text-paper">
              with one of those toppers that says happy 30th {who}
            </p>
            <p className="w-fit max-w-[80%] rounded-[20px] rounded-bl-[6px] bg-[#e6e1d9] px-4 py-2.5">STOP that’s so cute</p>
          </div>
        </div>
      );
    case "film-strip":
      return (
        <div className="w-[340px] rounded-[30px] bg-ink p-4 shadow-lift">
          <p className="label flex justify-between px-1 pb-3 text-paper/70">
            <span>Recents</span>
            <span className="text-acid">12 selected</span>
          </p>
          <div className="grid grid-cols-3 gap-1">
            {ROLL.map((p, i) => (
              <div key={p} className="relative aspect-square overflow-hidden rounded-[4px]">
                <ObjectImage src={p} w={200} h={200} sizes="110px" />
                <span
                  className={cn(
                    "absolute bottom-1 right-1 grid size-5 place-items-center rounded-full border-2 border-paper text-[10px] font-bold",
                    i % 5 === 3 ? "bg-transparent" : "bg-blue text-paper",
                  )}
                >
                  {i % 5 === 3 ? "" : "✓"}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case "handwriting":
      return (
        <div className="w-[340px] rotate-[-3deg] bg-paper px-8 py-8 shadow-lift">
          <p className="label text-smudge">Stuck to the fridge since 2009</p>
          <p className="hand mt-4 text-[2.7rem] leading-[0.95] text-[#1f2a8a]">
            love you more than <span className="line-through decoration-2">chocolate</span> cake
            <br />— mum x
          </p>
        </div>
      );
  }
}

/** What they get. */
export function ObjectVisual({ id }: { id: GiftId }) {
  const { day, month } = useBirthday();
  const n = useNames();
  const date = formatDate(day, month).replace(/ /g, "");

  switch (id) {
    case "laser-portrait":
      return <LaserPlaque src="laugh" name={n.upper} date={date} width={300} />;
    case "magnet-set":
      return (
        <div className="steel relative h-[460px] w-[360px] rounded-[24px] shadow-lift">
          <div className="absolute left-[8%] top-[7%] text-[3.4rem]">
            <MagnetWord text={n.hasName ? n.name.slice(0, 6) : "hello"} seed={1} />
          </div>
          <PhotoMagnet src="lick" size={124} className="absolute left-[10%] top-[40%] -rotate-6" />
          <PhotoMagnet src="hearts" shape="heart" size={116} className="absolute right-[10%] top-[36%] rotate-6" />
          <div className="absolute bottom-[7%] left-[28%] rotate-[-3deg]">
            <span aria-hidden className="absolute -top-2 left-1/2 z-10 size-5 -translate-x-1/2 rounded-full bg-cherry shadow-md" />
            <Polaroid src="beagle" caption="best boy" width={120} />
          </div>
        </div>
      );
    case "photo-keychain":
      return <Keychain src="friendsHug" letter={n.initial} width={190} className="-rotate-[5deg]" />;
    case "cake-topper":
      return (
        <div className="relative w-[340px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full shadow-lift">
            <ObjectImage src="pinkCake" w={800} h={1000} sizes="360px" className="object-bottom" />
          </div>
          <div className="absolute left-1/2 top-[5%] -translate-x-1/2">
            <CakeTopper name={n.hasName ? n.lower : "maya"} line="happy 30th" width={220} />
          </div>
        </div>
      );
    case "film-strip":
      return (
        <div className="flex flex-col items-center">
          <div className="-rotate-[7deg]">
            <FilmStrip photos={["kid", "cafe", "beach"]} frame={112} caption={`${n.upper} ▸ 2026`} />
          </div>
          <div className="-mt-3 rotate-[4deg]">
            <FilmStrip photos={["balloons", "friendsBench", "confetti"]} frame={112} />
          </div>
          <div className="relative mt-7 h-10 w-[320px] rounded-[8px] bg-gradient-to-b from-[#d9b88f] to-[#a77b4f] shadow-obj">
            <span aria-hidden className="absolute inset-x-[6%] -top-1 h-2 rounded-full bg-[#fff6d8] shadow-[0_0_24px_8px_rgb(255_230_160/0.7)]" />
          </div>
        </div>
      );
    case "handwriting":
      return <HandTag lines={["love you more", "than cake"]} sign="mum x" width={360} />;
  }
}

/** Background for the "after" side of the comparison — the object's natural habitat. */
export const HABITAT: Record<GiftId, string> = {
  "laser-portrait": "bg-[radial-gradient(ellipse_at_50%_30%,#f3ebdf,#d9c9b2)]",
  "magnet-set": "bg-[radial-gradient(ellipse_at_50%_30%,#eef0f2,#c9cbcf)]",
  "photo-keychain": "bg-[radial-gradient(ellipse_at_50%_30%,#fde3ef,#f2b8d2)]",
  "cake-topper": "bg-[radial-gradient(ellipse_at_50%_30%,#fbe9ea,#efc4c6)]",
  "film-strip": "bg-[radial-gradient(ellipse_at_50%_30%,#f2f7da,#d3e29a)]",
  handwriting: "bg-[radial-gradient(ellipse_at_50%_30%,#e9edff,#b9c3f5)]",
};

function Blueprint({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  return (
    <div className="relative h-[500px] w-[400px] overflow-hidden rounded-[22px] bg-blue shadow-lift">
      <span
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute inset-0 flex scale-[0.78] items-center justify-center mix-blend-screen [filter:grayscale(1)_invert(1)_contrast(1.6)_brightness(1.05)]">
        <ObjectVisual id={id} />
      </div>
      <svg className="absolute inset-x-8 bottom-12 h-6 w-[calc(100%-4rem)] text-paper" aria-hidden>
        <line x1="0" y1="12" x2="100%" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="4" x2="0" y2="20" stroke="currentColor" strokeWidth="1" />
        <line x1="100%" y1="4" x2="100%" y2="20" stroke="currentColor" strokeWidth="1" />
      </svg>
      <p className="label absolute inset-x-0 bottom-6 text-center text-paper">{gift.size}</p>
      <p className="label absolute left-5 top-5 text-paper/90">Proof 01 — {gift.name}</p>
      <p className="label absolute right-5 top-5 -rotate-6 rounded-[6px] border-2 border-paper px-2 py-1 text-paper">Waiting for your OK</p>
      {(["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"] as const).map((pos) => (
        <span key={pos} aria-hidden className={cn("absolute size-4 border-paper/80", pos, pos.includes("left") ? "border-l" : "border-r", pos.includes("top") ? "border-t" : "border-b")} />
      ))}
    </div>
  );
}

function Making({ id }: { id: GiftId }) {
  return (
    <div className="relative flex h-[500px] w-[400px] items-center justify-center overflow-hidden rounded-[22px] bg-ink shadow-lift">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 [filter:grayscale(1)]">
        <ObjectVisual id={id} />
      </div>
      <div className="making-reveal absolute inset-0 flex items-center justify-center">
        <ObjectVisual id={id} />
      </div>
      <span aria-hidden className="making-scan absolute inset-x-0 h-[3px] bg-[#ffb36b] shadow-[0_0_16px_5px_rgb(255_107_28/0.85)]" />
      <p className="label absolute left-5 top-5 text-paper/70">In the studio</p>
    </div>
  );
}

function Boxed({ id }: { id: GiftId }) {
  const n = useNames();
  return (
    <div className="relative flex h-[500px] w-[400px] items-end justify-center">
      <div className="relative h-[330px] w-[380px] rounded-[14px] bg-gradient-to-b from-[#c99d6c] to-[#a97d50] shadow-lift">
        <span aria-hidden className="absolute inset-3 rounded-[10px] bg-gradient-to-b from-[#8f6740] to-[#b48759] shadow-[inset_0_10px_20px_rgb(0_0_0/0.35)]" />
        <span
          aria-hidden
          className="absolute -top-8 left-6 right-6 h-24 bg-paper/95"
          style={{ clipPath: "polygon(0 30%, 10% 0, 22% 35%, 36% 5%, 50% 32%, 63% 0, 77% 30%, 90% 4%, 100% 34%, 100% 100%, 0 100%)" }}
        />
      </div>
      <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 scale-[0.7]">
        <ObjectVisual id={id} />
      </div>
      <div className="absolute -right-8 top-2 rotate-[8deg]">
        <Note width={150}>for {n.hasName ? n.lower : "you"} — open me first</Note>
      </div>
    </div>
  );
}

/** One frame per making step: source → proof → making → boxed. */
export function ProcessVisual({ id, step }: { id: GiftId; step: number }): ReactNode {
  if (step === 0) return <SourceVisual id={id} />;
  if (step === 1) return <Blueprint id={id} />;
  if (step === 2) return <Making id={id} />;
  return <Boxed id={id} />;
}
