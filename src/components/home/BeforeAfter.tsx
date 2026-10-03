"use client";

/* eslint-disable @next/next/no-img-element -- engraving uses blob URLs and CORS images that next/image can't serve */

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Keychain } from "@/components/objects/Keychain";
import { Arrow } from "@/components/ui/Arrow";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { RevealLines } from "@/components/ui/RevealLines";
import { useEngraving } from "@/lib/engrave";
import type { GiftId } from "@/lib/gifts";
import { photo } from "@/lib/photos";
import { cn } from "@/lib/cn";

type Mode = "laser" | "magnet" | "acrylic";

const MODES: Array<{ id: Mode; label: string; after: string; gift: GiftId }> = [
  { id: "laser", label: "Laser engraving", after: "Engraved in maple", gift: "laser-portrait" },
  { id: "magnet", label: "Fridge magnet", after: "Die-cut gloss magnet", gift: "magnet-set" },
  { id: "acrylic", label: "Acrylic keychain", after: "5 mm acrylic", gift: "photo-keychain" },
];

const DEFAULT_SRC = photo("curls", 900, 1125);

function After({ mode, src }: { mode: Mode; src: string }) {
  const engraving = useEngraving(src);

  if (mode === "laser") {
    return (
      <div className="wood absolute inset-0">
        <img
          src={engraving?.burn ?? src}
          alt=""
          crossOrigin="anonymous"
          className={cn("size-full object-cover mix-blend-multiply", !engraving && "opacity-60 [filter:grayscale(1)_contrast(1.6)_sepia(0.7)]")}
        />
      </div>
    );
  }

  if (mode === "magnet") {
    return (
      <div className="steel absolute inset-0 flex items-center justify-center">
        <div className="relative w-[64%] -rotate-[5deg] rounded-[22px] bg-paper p-[3.5%] shadow-lift">
          <div className="relative aspect-square overflow-hidden rounded-[16px]">
            <img src={src} alt="" crossOrigin="anonymous" className="size-full object-cover [filter:saturate(1.2)_contrast(1.06)]" />
            <span aria-hidden className="gloss absolute inset-0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#fde3ef,#f2b8d2)]">
      <Keychain src={{ url: src }} tint="clear" width={240} className="-rotate-[5deg] scale-[1.25]" />
    </div>
  );
}

/**
 * Drag the divider: left is the photo, right is the object.
 * "Use your own photo" processes the file in the browser — nothing is uploaded.
 */
export function BeforeAfter() {
  const [mode, setMode] = useState<Mode>("laser");
  const [userSrc, setUserSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const src = userSrc ?? DEFAULT_SRC;
  const current = MODES.find((m) => m.id === mode)!;

  useEffect(() => () => {
    if (userSrc) URL.revokeObjectURL(userSrc);
  }, [userSrc]);

  return (
    <section id="before-after" data-accent="tangerine" className="relative overflow-hidden bg-paper px-4 py-[16vh] md:px-10">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-20">
        <div>
          <p className="label text-smudge">Before → after</p>
          <h2 className="mt-5">
            <RevealLines
              className="display block text-[clamp(3.6rem,8.4vw,9rem)]"
              lines={["Drag it.", "Watch it", <span key="3" className="text-accent">become a gift.</span>]}
            />
          </h2>
          <p className="mt-8 max-w-[30rem] text-[1.1rem] leading-relaxed text-ink/75">
            Same photo, three ways to keep it. Slide across to see what our laser, printer and cutter do to a perfectly
            ordinary picture from the group chat.
          </p>

          <fieldset className="mt-10">
            <legend className="label text-smudge">Turn it into</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {MODES.map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    "cursor-pointer rounded-full border-2 px-5 py-2.5 font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4",
                    mode === m.id ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink/50",
                  )}
                >
                  <input type="radio" name="ba-mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="sr-only" />
                  {m.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              data-cursor="cta"
              className="display inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-[1.4rem] text-accent-ink transition-transform hover:scale-[1.03]"
            >
              {userSrc ? "Try another photo" : "Use your own photo"}
              <Arrow direction="up-right" />
            </button>
            {userSrc && (
              <button type="button" onClick={() => setUserSrc(null)} className="underline decoration-ink/30 decoration-2 underline-offset-[6px]">
                Back to the sample
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setUserSrc(URL.createObjectURL(file));
                e.target.value = "";
              }}
            />
            <Link
              href={`/custom/${current.gift}`}
              className="inline-flex items-center gap-2 underline decoration-ink/30 decoration-2 underline-offset-[6px] hover:decoration-accent"
            >
              Make it for real <Arrow />
            </Link>
            <p className="w-full text-[0.9rem] text-smudge">Processed right here in your browser. Nothing gets uploaded.</p>
          </div>
        </div>

        <div className="relative">
          <CompareSlider
            beforeLabel="Before"
            afterLabel={`After — ${current.after}`}
            before={<img src={src} alt="Your photo, before" crossOrigin="anonymous" draggable={false} className="size-full object-cover" />}
            after={
              <motion.div key={`${mode}-${src}`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <After mode={mode} src={src} />
              </motion.div>
            }
          />
          <p className="hand absolute -bottom-12 right-2 rotate-[-3deg] text-[1.9rem] text-ink/70">← drag me, i don’t bite</p>
        </div>
      </div>
    </section>
  );
}
