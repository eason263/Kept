"use client";

import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { useNames } from "@/lib/birthday";
import { DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";

/** A paper swing tag on a string — the price, and the way into the workbench. */
export function PriceTag({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  const n = useNames();
  return (
    <div className="flex origin-top flex-col items-center [animation:tag-swing_5.5s_ease-in-out_infinite]">
      <span aria-hidden className="h-36 w-px bg-ink/45" />
      <Link
        href={`/custom/${id}`}
        data-cursor="cta"
        aria-label={`Make yours — ${gift.name}, from $${gift.from}`}
        className="group -mt-2 block w-[196px] drop-shadow-[0_20px_22px_rgb(27_24_22/0.32)] transition-transform duration-500 ease-[var(--ease-out)] hover:-rotate-6"
      >
        <div className="relative bg-paper px-6 pb-6 pt-11 text-center [clip-path:polygon(24%_0,76%_0,100%_15%,100%_100%,0_100%,0_15%)]">
          <span aria-hidden className="absolute left-1/2 top-3.5 size-4 -translate-x-1/2 rounded-full bg-frosting ring-2 ring-ink/25" />
          <p className="label text-smudge">From</p>
          <p className="display mt-1 text-[4.4rem] leading-[0.85]">${gift.from}</p>
          {n.hasName && <p className="hand mt-2 text-[1.9rem] leading-none text-ink/80">for {n.lower}</p>}
          <p className="label mt-3 text-smudge">Made in {DETAILS[id].days} days</p>
          <span className="label mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-paper transition-colors group-hover:bg-accent group-hover:text-accent-ink">
            Make yours <Arrow />
          </span>
        </div>
      </Link>
    </div>
  );
}
