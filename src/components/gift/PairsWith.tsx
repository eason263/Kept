"use client";

import Link from "next/link";
import { GiftThumb } from "@/components/home/GiftScenes";
import { Arrow } from "@/components/ui/Arrow";
import { ACCENTS } from "@/lib/accents";
import { DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";

const TILT = [-2.5, 1.5, -1];

/** Three other gifts that go with this one. */
export function PairsWith({ id }: { id: GiftId }) {
  return (
    <section className="bg-paper px-4 py-[14vh] md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label text-smudge">Pairs well with</p>
          <p className="display mt-5 text-[clamp(3rem,6vw,6.4rem)]">Make it a set.</p>
        </div>
        <p className="max-w-[22rem] text-[1.05rem] text-ink/70">Same photo, same name, different object. They’re made in the same batch.</p>
      </div>
      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {DETAILS[id].pairs.map((pid, i) => {
          const g = GIFTS[pid];
          return (
            <li key={pid}>
              <Link
                href={`/gift/${pid}`}
                data-cursor="view"
                className="group flex h-full flex-col rounded-[28px] p-6 shadow-obj transition-[rotate,translate,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-2 hover:rotate-0 hover:shadow-lift"
                style={{ rotate: `${TILT[i]}deg`, background: `color-mix(in srgb, ${ACCENTS[g.accent].color} 22%, var(--paper))` }}
              >
                <span className="grid h-52 place-items-center">
                  <span className="scale-125">
                    <GiftThumb id={pid} />
                  </span>
                </span>
                <span className="label mt-4 text-smudge">{g.name}</span>
                <span className="display mt-2 text-[2.2rem]">{g.headline.join(" ")}</span>
                <span className="mt-auto flex items-center justify-between pt-6 font-mono text-[0.85rem]">
                  from ${g.from}
                  <Arrow className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
