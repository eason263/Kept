"use client";

import Link from "next/link";
import { PriceTag } from "./PriceTag";
import { GiftScene } from "@/components/home/GiftScenes";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealLines } from "@/components/ui/RevealLines";
import { SmartLink } from "@/components/ui/SmartLink";
import { ACCENTS } from "@/lib/accents";
import { DETAILS } from "@/lib/giftDetails";
import { GIFT_ORDER, GIFTS, type GiftId } from "@/lib/gifts";

const pad = (n: number) => String(n).padStart(2, "0");

/** Opening spread: the headline, the object, and a swing tag instead of a buy box. */
export function ProductHero({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  const accent = ACCENTS[gift.accent];
  const index = GIFT_ORDER.indexOf(id);

  return (
    <section id="top" data-accent={gift.accent} className="relative overflow-hidden px-4 pb-20 pt-28 md:px-10 lg:min-h-[100svh] lg:pb-12">
      <nav aria-label="Breadcrumb" className="label relative z-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-smudge">
        <SmartLink href="/#explore" className="transition-colors hover:text-ink">
          ← All gifts
        </SmartLink>
        <span aria-hidden>/</span>
        <span aria-current="page">
          Gift {pad(index + 1)}/{pad(GIFT_ORDER.length)} — {gift.name}
        </span>
      </nav>

      <div className="mt-8 grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
        <div className="relative z-10">
          <h1>
            <RevealLines className="display block text-[clamp(3.6rem,8.4vw,10rem)]" lines={gift.headline} />
          </h1>
          <p className="mt-7 max-w-[32rem] text-[1.15rem] leading-relaxed text-ink/80">{gift.story}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Magnetic>
              <Link
                id="hero-cta"
                href={`/custom/${id}`}
                data-cursor="cta"
                className="display group inline-flex items-center gap-3 rounded-full px-8 py-5 text-[clamp(1.4rem,2vw,1.75rem)] transition-transform hover:scale-[1.03]"
                style={{ background: accent.color, color: accent.ink }}
              >
                Make yours
                <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <a
              href="#process"
              className="group inline-flex items-center gap-2 underline decoration-ink/30 decoration-2 underline-offset-[6px] hover:decoration-accent"
            >
              How it’s made <Arrow direction="down" />
            </a>
          </div>

          <dl className="mt-12 grid max-w-[36rem] grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/15 pt-6 sm:grid-cols-4">
            {[
              ["Material", gift.material],
              ["Size", gift.size],
              ["Made in", `${DETAILS[id].days} days`],
              ["From", `$${gift.from}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label text-smudge">{k}</dt>
                <dd className="mt-1 text-[0.98rem] font-medium leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex min-h-[460px] items-center justify-center lg:min-h-[640px]">
          <span
            aria-hidden
            className="absolute aspect-square w-[min(94vw,640px)] rounded-full"
            style={{ background: accent.color }}
          />
          <div className="relative">
            <GiftScene id={id} />
          </div>
          <div className="absolute -top-44 right-[2%] hidden xl:block">
            <PriceTag id={id} />
          </div>
        </div>
      </div>
    </section>
  );
}
