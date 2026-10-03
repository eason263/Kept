"use client";

import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { Magnetic } from "@/components/ui/Magnetic";
import { ACCENTS } from "@/lib/accents";
import { useNames } from "@/lib/birthday";
import { CONFIGS, type Field } from "@/lib/customize";
import { DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";

function describe(id: GiftId, f: Field) {
  if (f.kind === "photo") return f.help ?? "Any photo from your phone";
  if (f.kind === "text") return `Up to ${f.max} characters — “${f.placeholder}”`;
  if (f.kind === "size") return DETAILS[id].sizes.map((s) => s.label).join(" · ");
  const labels = f.options.map((o) => o.label);
  return labels.length > 1 ? `${labels.slice(0, -1).join(", ")} or ${labels.at(-1)}` : labels[0];
}

/** Every choice the workbench offers, listed like a menu — then the door to it. */
export function MakeItTheirs({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  const accent = ACCENTS[gift.accent];
  const n = useNames();
  const fields = CONFIGS[id].fields.filter((f) => !f.when);

  return (
    <section data-accent={gift.accent} className="relative overflow-hidden px-4 py-[14vh] md:px-10" style={{ background: accent.color, color: accent.ink }}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p className="label opacity-70">Personalise</p>
          <p className="display mt-5 text-[clamp(3.4rem,8vw,8.5rem)]">
            Make it
            <br />
            {n.hasName ? `${n.name}’s.` : "theirs."}
          </p>
          <div className="mt-10">
            <Magnetic>
              <Link
                href={`/custom/${id}`}
                data-cursor="cta"
                className="display inline-flex items-center gap-3 rounded-full bg-ink px-8 py-5 text-[1.6rem] text-paper"
              >
                Open the workbench <Arrow />
              </Link>
            </Magnetic>
          </div>
        </div>
        <ol className="self-end border-t border-current/25">
          {fields.map((f, i) => (
            <li key={f.key} className="grid grid-cols-[3rem_1fr] gap-2 border-b border-current/25 py-5 md:grid-cols-[3rem_12rem_1fr]">
              <span className="label opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[1.2rem] font-semibold">{f.label}</span>
              <span className="col-start-2 text-[1.02rem] opacity-80 md:col-start-auto">{describe(id, f)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
