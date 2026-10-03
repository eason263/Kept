"use client";

import { RevealLines } from "@/components/ui/RevealLines";
import { ACCENTS } from "@/lib/accents";
import { useBirthday, useNames } from "@/lib/birthday";
import { CONFIGS, materialField } from "@/lib/customize";
import { estimateDelivery, fmtDay } from "@/lib/delivery";
import { DETAILS } from "@/lib/giftDetails";
import { GIFTS, type GiftId } from "@/lib/gifts";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/cn";

function Materials({ id }: { id: GiftId }) {
  const field = materialField(id);
  if (!field) return null;
  return (
    <div>
      <p className="label text-smudge">{field.label}</p>
      <ul className="mt-8 flex flex-wrap gap-6">
        {field.options.map((o) => (
          <li key={o.id} className="flex flex-col items-center gap-3">
            <span
              aria-hidden
              className={cn("block size-20 rounded-[22px] shadow-obj ring-1 ring-black/5 md:size-28", o.swatch)}
              style={o.swatchStyle ? { background: o.swatchStyle } : undefined}
            />
            <span className="text-center text-[0.98rem] font-medium leading-tight">
              {o.label}
              {o.delta ? <span className="block font-mono text-[0.75rem] text-smudge">+${o.delta}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Ruler({ id }: { id: GiftId }) {
  const d = DETAILS[id];
  const accent = ACCENTS[GIFTS[id].accent].color;
  const unique = d.sizes.filter((s, i, all) => all.findIndex((o) => o.cm.join() === s.cm.join()) === i);
  const maxW = Math.max(...unique.map((s) => s.cm[0]));
  const maxH = Math.max(...unique.map((s) => s.cm[1]));
  const W = maxW + 2;
  const H = maxH + 3;
  const wide = W / H > 1.6;
  const marks = Array.from({ length: Math.floor(maxW / 5) + 1 }, (_, i) => i * 5);

  return (
    <div>
      <p className="label text-smudge">Actual proportions</p>
      <div
        className={cn("relative mt-8 max-w-full", wide ? "w-full" : "h-[280px]")}
        style={{ aspectRatio: `${W} / ${H}` }}
        role="img"
        aria-label={`Sizes: ${unique.map((s) => s.dims).join(", ")}`}
      >
        {[...unique].reverse().map((s, i, arr) => {
          const first = i === arr.length - 1;
          return (
            <div
              key={s.id}
              className="absolute rounded-[3px] border-2"
              style={{
                left: `${(1 / W) * 100}%`,
                bottom: `${(2.4 / H) * 100}%`,
                width: `${(s.cm[0] / W) * 100}%`,
                height: `${(s.cm[1] / H) * 100}%`,
                borderColor: first ? accent : "rgb(27 24 22 / 0.28)",
                background: first ? `color-mix(in srgb, ${accent} 14%, transparent)` : undefined,
              }}
            >
              <span className="label absolute right-1.5 top-1.5 whitespace-nowrap text-[0.62rem]">{s.dims}</span>
            </div>
          );
        })}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[1.2rem] border-t border-ink/50"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgb(27 24 22 / 0.5) 0 1px, transparent 1px ${100 / W}%)`,
            backgroundPosition: `${(1 / W) * 100}% 0`,
            backgroundSize: "100% 40%",
            backgroundRepeat: "no-repeat",
          }}
        >
          {marks.map((m) => (
            <span key={m} className="absolute top-2 -translate-x-1/2 font-mono text-[0.6rem]" style={{ left: `${((m + 1) / W) * 100}%` }}>
              {m}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-8 text-[1.05rem] text-ink/75">{d.analogy}</p>
    </div>
  );
}

function Timing({ id }: { id: GiftId }) {
  const { day, month } = useBirthday();
  const n = useNames();
  const mounted = useMounted();
  const d = DETAILS[id];
  const est = mounted ? estimateDelivery(d.days, day, month, n.possessive) : null;
  const dot = est?.tone === "fine" ? "bg-acid" : est?.tone === "tight" ? "bg-tangerine" : "bg-cherry";

  return (
    <div>
      <p className="label text-smudge">If you order today</p>
      <p className="display mt-6 text-[clamp(3rem,5.6vw,5.6rem)]">{est ? `Ships ${fmtDay(est.ships)}` : " "}</p>
      <ol className="label mt-6 flex flex-wrap items-center gap-2 text-ink/70">
        <li className="rounded-full border border-ink/20 px-3 py-1.5">{d.days} days in the studio</li>
        <li aria-hidden>→</li>
        <li className="rounded-full border border-ink/20 px-3 py-1.5">2–4 days in the post</li>
        <li aria-hidden>→</li>
        <li className="rounded-full bg-ink px-3 py-1.5 text-paper">{n.hasName ? n.name : "Them"}</li>
      </ol>
      <p className="mt-6 flex max-w-[34rem] items-start gap-3 text-[1.1rem] leading-relaxed" aria-live="polite">
        <span aria-hidden className={cn("mt-2 size-3 shrink-0 rounded-full", dot)} />
        {est?.line}
      </p>
    </div>
  );
}

const ZIGZAG = `polygon(${[
  "0 0",
  "100% 0",
  ...Array.from({ length: 21 }, (_, i) => `${100 - i * 5}% ${i % 2 ? "100%" : "calc(100% - 10px)"}`),
].join(", ")})`;

function Receipt({ id }: { id: GiftId }) {
  const d = DETAILS[id];
  const extras = CONFIGS[id].fields.flatMap((f) =>
    f.kind === "choice" ? f.options.filter((o) => o.delta).map((o) => [`${o.label} upgrade`, `+$${o.delta}`] as const) : [],
  );
  const rows: Array<readonly [string, string]> = [
    ...d.sizes.map((s) => [`${s.label} · ${s.dims}`, `$${s.price}`] as const),
    ...extras,
    ["Digital proof before we make it", "free"],
    ["Card, written by hand", "free"],
    ["Gift wrap", "free"],
  ];
  return (
    <div className="mx-auto w-full max-w-[24rem] rotate-[1.5deg] bg-paper px-5 pb-12 pt-8 font-mono text-[0.72rem] shadow-lift sm:px-7 sm:text-[0.8rem]" style={{ clipPath: ZIGZAG }}>
      <p className="text-center text-[0.7rem] uppercase tracking-[0.2em] text-smudge">kept. studio — price list</p>
      <p className="mt-1 text-center text-[0.7rem] text-smudge">{GIFTS[id].name.toUpperCase()}</p>
      <dl className="mt-6 space-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-2">
            <dt className="min-w-0">{k}</dt>
            <span aria-hidden className="mb-1 min-w-4 flex-1 border-b border-dotted border-ink/40" />
            <dd className="shrink-0 font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-7 text-center text-[0.7rem] uppercase tracking-[0.2em]">Thank you. Keep it.</p>
    </div>
  );
}

/** Materials, size, timing and price — practical, but still physical. */
export function ProductDetails({ id }: { id: GiftId }) {
  const gift = GIFTS[id];
  return (
    <section data-accent={gift.accent} className="bg-frosting px-4 py-[14vh] md:px-10">
      <p className="label text-smudge">The details</p>
      <h2 className="mt-5">
        <RevealLines
          className="display block text-[clamp(3.2rem,7vw,7.5rem)]"
          lines={["The small print,", <span key="2" className="text-accent">printed large.</span>]}
        />
      </h2>

      <div className="mt-16 grid gap-px overflow-hidden rounded-[30px] bg-ink/15 lg:grid-cols-12">
        <div className="bg-frosting p-7 md:p-12 lg:col-span-7">
          <Materials id={id} />
        </div>
        <div className="bg-[#e9dfcf] p-7 md:p-12 lg:col-span-5">
          <Receipt id={id} />
        </div>
        <div className="bg-frosting p-7 md:p-12 lg:col-span-5">
          <Ruler id={id} />
        </div>
        <div className="bg-frosting p-7 md:p-12 lg:col-span-7">
          <Timing id={id} />
        </div>
      </div>
    </section>
  );
}
