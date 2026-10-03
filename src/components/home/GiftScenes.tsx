"use client";

import { CakeTopper } from "@/components/objects/CakeTopper";
import { FilmStrip } from "@/components/objects/FilmStrip";
import { HandTag } from "@/components/objects/HandTag";
import { Keychain } from "@/components/objects/Keychain";
import { LaserPlaque } from "@/components/objects/LaserPlaque";
import { Note } from "@/components/objects/Note";
import { PhotoMagnet } from "@/components/objects/PhotoMagnet";
import { Polaroid } from "@/components/objects/Polaroid";
import { Arrow } from "@/components/ui/Arrow";
import { MagnetWord } from "@/components/ui/MagnetWord";
import { LaserStages } from "./LaserStages";
import { useNames } from "@/lib/birthday";
import type { GiftId } from "@/lib/gifts";
import { photo } from "@/lib/photos";
import Image from "next/image";

/** The big editorial visual for each gift story. */
export function GiftScene({ id }: { id: GiftId }) {
  const n = useNames();

  switch (id) {
    case "laser-portrait":
      return <LaserStages src={photo("laugh", 520, 650)} className="max-w-[min(420px,72vw)] lg:max-w-[min(420px,30vw)]" />;

    case "magnet-set":
      return (
        <div className="steel relative aspect-[4/5] w-[min(440px,82vw)] rounded-[26px] shadow-lift lg:w-[min(440px,32vw)]">
          <span aria-hidden className="absolute inset-y-[18%] right-[5%] w-[3%] rounded-full bg-gradient-to-r from-[#bdbbb5] to-[#efeeea] shadow-inner" />
          <div className="absolute left-[8%] top-[7%] text-[clamp(2.6rem,4.6vw,4.4rem)]">
            <MagnetWord text={n.hasName ? n.name.slice(0, 7) : "hello"} seed={1} />
          </div>
          <PhotoMagnet src="lick" size={128} className="absolute left-[9%] top-[38%] -rotate-6" />
          <PhotoMagnet src="hearts" shape="heart" size={120} className="absolute right-[14%] top-[34%] rotate-6" />
          <div className="absolute bottom-[8%] left-[12%] rotate-[-4deg]">
            <span aria-hidden className="absolute -top-2 left-1/2 z-10 size-5 -translate-x-1/2 rounded-full bg-cherry shadow-md" />
            <Polaroid src="beagle" caption="best boy" width={130} />
          </div>
          <div className="absolute bottom-[12%] right-[12%] rotate-[5deg]">
            <span aria-hidden className="absolute -top-2 left-1/2 z-10 size-5 -translate-x-1/2 rounded-full bg-blue shadow-md" />
            <Note width={140}>milk, eggs, cake!!</Note>
          </div>
        </div>
      );

    case "photo-keychain":
      return (
        <div className="relative flex h-[min(520px,70vh)] w-[min(440px,82vw)] items-start justify-center gap-8 pt-6">
          <span aria-hidden className="absolute inset-x-[10%] top-6 h-2 rounded-full bg-gradient-to-b from-[#cfcdc7] to-[#9c9b96] shadow" />
          <div className="origin-top animate-[swing_4.2s_ease-in-out_infinite]">
            <Keychain src="friendsHug" letter={n.initial} width={150} />
          </div>
          <div className="origin-top animate-[swing_4.8s_ease-in-out_-1.6s_infinite]">
            <Keychain src="curls" letter="+" width={150} tint="acid" />
          </div>
          <p className="hand absolute bottom-0 left-1/2 w-max -translate-x-1/2 -rotate-2 text-[2rem]">one for you, one for them</p>
        </div>
      );

    case "cake-topper":
      return (
        <div className="relative w-[min(420px,80vw)] lg:w-[min(420px,30vw)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full shadow-lift">
            <Image src={photo("pinkCake", 800, 1000)} alt="" fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover object-bottom" />
          </div>
          <div className="absolute left-1/2 top-[6%] -translate-x-1/2">
            <CakeTopper name={n.hasName ? n.lower : "maya"} line="happy 30th" width={230} />
          </div>
        </div>
      );

    case "film-strip":
      return (
        <div className="relative flex h-[min(520px,66vh)] w-[min(520px,86vw)] flex-col items-center justify-center lg:w-[min(520px,36vw)]">
          <div className="-rotate-[8deg]">
            <FilmStrip photos={["kid", "cafe", "beach"]} frame={118} />
          </div>
          <div className="-mt-4 rotate-[5deg]">
            <FilmStrip photos={["balloons", "friendsBench", "confetti"]} frame={118} />
          </div>
          <div className="relative mt-8 h-10 w-[78%] rounded-[8px] bg-gradient-to-b from-[#d9b88f] to-[#a77b4f] shadow-obj">
            <span aria-hidden className="absolute inset-x-[6%] -top-1 h-2 rounded-full bg-[#fff6d8] shadow-[0_0_24px_8px_rgb(255_230_160/0.7)]" />
          </div>
          <p className="label mt-3 text-smudge">oak lightbox · lights the year up</p>
        </div>
      );

    case "handwriting":
      return (
        <div className="flex w-[min(520px,86vw)] flex-col items-center gap-6 lg:w-[min(520px,36vw)]">
          <div className="w-[82%] rotate-[-3deg] bg-paper px-7 py-6 shadow-obj">
            <p className="label text-smudge">The original — fridge, 2009</p>
            <p className="hand mt-3 text-[2.4rem] leading-[0.95] text-[#1f2a8a]">
              love you more than <span className="line-through decoration-2">chocolate</span> cake
              <br />— mum x
            </p>
          </div>
          <Arrow direction="down" className="size-8 text-ink/50" />
          <HandTag lines={["love you more", "than cake"]} sign="mum x" width="min(360px, 76vw)" />
        </div>
      );
  }
}

/** Small representation of a gift for lists and results. */
export function GiftThumb({ id }: { id: GiftId }) {
  const n = useNames();
  switch (id) {
    case "laser-portrait":
      return <LaserPlaque src="laugh" name={n.hasName ? n.upper : "YOU"} width={92} />;
    case "magnet-set":
      return <MagnetWord text={(n.hasName ? n.name : "hey").slice(0, 4)} className="text-[2.3rem]" />;
    case "photo-keychain":
      return <Keychain src="friendsHug" letter={n.initial} width={70} />;
    case "cake-topper":
      return <CakeTopper name={n.hasName ? n.lower.slice(0, 8) : "you"} width={124} />;
    case "film-strip":
      return <FilmStrip photos={["kid", "beach"]} frame={52} className="-rotate-6" />;
    case "handwriting":
      return <HandTag lines={["love you", "more"]} width={128} />;
  }
}
