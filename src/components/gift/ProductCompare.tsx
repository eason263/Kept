"use client";

import { HABITAT, ObjectVisual, SourceVisual } from "./GiftVisuals";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { FitFrame } from "@/components/ui/FitFrame";
import { RevealLines } from "@/components/ui/RevealLines";
import { DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";
import { cn } from "@/lib/cn";

/** What's on your phone vs what ends up on their shelf, on one draggable frame. */
export function ProductCompare({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  const d = DETAILS[id];
  return (
    <section data-accent={gift.accent} className="relative overflow-hidden px-4 py-[14vh] md:px-10">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[minmax(0,540px)_1fr] lg:gap-24">
        <div className="lg:order-2">
          <p className="label text-smudge">Before → after</p>
          <h2 className="mt-5">
            <RevealLines
              className="display block text-[clamp(3.2rem,6.6vw,7rem)]"
              lines={["What you send.", <span key="2" className="text-accent">What they get.</span>]}
            />
          </h2>
          <dl className="mt-10 max-w-[30rem] divide-y divide-ink/15 border-y border-ink/15">
            <div className="flex items-baseline justify-between gap-6 py-4">
              <dt className="label text-smudge">You send</dt>
              <dd className="text-right text-[1.15rem] font-medium">{d.sends}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 py-4">
              <dt className="label text-smudge">They get</dt>
              <dd className="text-right text-[1.15rem] font-medium">{d.gets}</dd>
            </div>
          </dl>
          <p className="hand mt-8 -rotate-2 text-[2rem] text-ink/70">← drag the line across</p>
        </div>

        <CompareSlider
          beforeLabel="What you send"
          afterLabel="What they get"
          before={
            <div className="absolute inset-0 bg-[#ece4d8]">
              <FitFrame className="h-full" design={500}>
                <SourceVisual id={id} />
              </FitFrame>
            </div>
          }
          after={
            <div className={cn("absolute inset-0", HABITAT[id])}>
              <FitFrame className="h-full" design={500}>
                <ObjectVisual id={id} />
              </FitFrame>
            </div>
          }
        />
      </div>
    </section>
  );
}
